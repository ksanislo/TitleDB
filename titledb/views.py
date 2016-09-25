import logging
log = logging.getLogger(__name__)

from datetime import datetime

from pyramid.httpexceptions import HTTPFound

from pyramid.response import (
    Response,
    FileResponse
)

from pyramid.security import (
    remember,
    forget
)

from pyramid.view import (
    view_config,
    view_defaults,
    forbidden_view_config
)

from .security import check_password
from .images import create_png_from_icon
from .proxy import verify_cache
from .models import (
    DBSession,
    Entry,
    EntrySchema,
    EntrySchemaNested,
    CIA,
    CIASchema,
    CIASchemaNested,
    CIA_v0,
    CIASchema_v0,
    TDSX,
    TDSXSchema,
    TDSXSchemaNested,
    SMDH,
    SMDHSchema,
    SMDHSchemaNested,
    XML,
    XMLSchema,
    XMLSchemaNested,
    ARM9,
    ARM9Schema,
    ARM9SchemaNested,
    Assets,
    AssetsSchema,
    AssetsSchemaNested,
    AssetsSchemaModerator,
    Category,
    CategorySchema,
    Submission,
    SubmissionSchema,
    SubmissionSchemaEveryone,
    User,
    Group
)

from time import (
    gmtime,
    strftime
)

from datetime import datetime
from urllib import parse


class register_views(object):
    def __init__(self, route=None, collection_route=None):
        self.route = route
        self.collection_route = collection_route

    def __call__(self, cls):
        cls.item_route = self.route
        if self.route:
            cls = view_config(_depth=1, renderer='json', attr='read_item',
                request_method='GET', route_name=self.route)(cls)
            cls = view_config(_depth=1, renderer='json', attr='update_item',
                request_method='PUT', route_name=self.route)(cls)
            cls = view_config(_depth=1, renderer='json', attr='delete_item',
                request_method='DELETE', route_name=self.route, permission='super')(cls)
        if self.collection_route:
            cls = view_config(_depth=1, renderer='json', attr='list_items',
                request_method='GET', route_name=self.collection_route)(cls)
            cls = view_config(_depth=1, renderer='json', attr='create_item',
                request_method='POST', route_name=self.collection_route)(cls)
        return cls


class BaseView(object):
    read_only = True # Read only view by default

    item_cls = None
    schema_cls = None
    nested_cls = None
    moderator_cls = None
    everyone_cls = None
    active_schema = None

    def __init__(self, request):
        self.request = request

        # Load an item if we're not a collection
        if request.matched_route.name == self.item_route:
            item_id = int(request.matchdict['id'])
            item = DBSession.query(self.item_cls).get(item_id)
            self.item = item

        if self.request.method == 'GET':
            if request.matched_route.name == self.item_route:
                # Set the active_schema for items
                if not self.nested_cls or (self.request.GET.get('nested') and self.request.GET.get('nested').lower() == 'false'):
                    self.active_schema = self.schema_cls(exclude=self.request.GET.getall('exclude'),only=self.request.GET.getall('only'))
                else:
                    self.active_schema = self.nested_cls(exclude=self.request.GET.getall('exclude'),only=self.request.GET.getall('only'))
            else:
                # Set the active_schema for lists
                if self.nested_cls and self.request.GET.get('nested') and self.request.GET.get('nested').lower() == 'true':
                    self.active_schema = self.nested_cls(exclude=self.request.GET.getall('exclude'),only=self.request.GET.getall('only'),many=True)
                else:
                    self.active_schema = self.schema_cls(exclude=self.request.GET.getall('exclude'),only=self.request.GET.getall('only'),many=True)
        else: # POST/PUT requests land here
            if 'group:super' in self.request.effective_principals:
                self.active_schema = self.schema_cls()
            elif self.moderator_cls and 'group:mod' in self.request.effective_principals:
                self.active_schema = self.moderator_cls()
            elif not self.moderator_cls and self.request.method == 'PUT' and 'group:mod' in self.request.effective_principals:
                all_fields = list(self.schema_cls._declared_fields.keys())
                all_fields.remove('active') # Allow moderators to toggle "active" by default
                self.active_schema = self.schema_cls(dump_only=all_fields)
            elif self.everyone_cls and self.request.method == 'POST':
                self.active_schema = self.everyone_cls()
            else: # No preferred schema found, so set everything as dump_only
                all_fields = tuple(self.schema_cls._declared_fields.keys())
                self.active_schema = self.schema_cls(dump_only=all_fields)

            # Check if our active_schema has any writable records, and adjust read_only as required.
            for field in self.active_schema.declared_fields:
                if not self.active_schema.declared_fields[field].dump_only:
                    self.read_only = False
                    break

    def create_item(self):
        if not self.read_only:
            data, errors = self.active_schema.load(self.request.json_body)
            if errors:
                return errors
            item = self.item_cls(**data)
            DBSession.add(item)
            DBSession.flush()
            self.request.render_schema = self.active_schema
            return item
        else:
            return TitleDBViews.forbidden(self)

    def list_items(self):
        data = DBSession.query(self.item_cls).filter(self.item_cls.active == True).all()
        self.request.render_schema = self.active_schema
        return data

    def read_item(self):
        self.request.render_schema = self.active_schema
        return self.item

    def update_item(self):
        if not self.read_only:
            data, errors = self.active_schema.load(self.request.json_body)
            if errors:
                return errors
            for key, value in data.items():
                setattr(self.item, key, value)
            self.request.render_schema = self.active_schema
            return self.item
        else:
            return TitleDBViews.forbidden(self)

    def delete_item(self):
        DBSession.delete(self.item)
        return Response(
            status='202 Accepted',
            content_type='application/json; charset=UTF-8')


@register_views(route='entry_v1', collection_route='entry_collection_v1')
class EntryView(BaseView):
    item_cls = Entry
    schema_cls = EntrySchema
    nested_cls = EntrySchemaNested
    moderator_cls = EntrySchema

@register_views(route='cia_v1', collection_route='cia_collection_v1')
class CIAView(BaseView):
    item_cls = CIA
    schema_cls = CIASchema
    nested_cls = CIASchemaNested

@register_views(route='3dsx_v1', collection_route='3dsx_collection_v1')
class TDSXView(BaseView):
    item_cls = TDSX
    schema_cls = TDSXSchema
    nested_cls = TDSXSchemaNested

@register_views(route='smdh_v1', collection_route='smdh_collection_v1')
class SMDHView(BaseView):
    item_cls = SMDH
    schema_cls = SMDHSchema
    nested_cls = SMDHSchemaNested

@register_views(route='xml_v1', collection_route='xml_collection_v1')
class XMLView(BaseView):
    item_cls = XML
    schema_cls = XMLSchema
    nested_cls = XMLSchemaNested

@register_views(route='arm9_v1', collection_route='arm9_collection_v1')
class ARM9View(BaseView):
    item_cls = ARM9
    schema_cls = ARM9Schema
    nested_cls = ARM9SchemaNested

@register_views(route='assets_v1', collection_route='assets_collection_v1')
class AssetsView(BaseView):
    item_cls = Assets
    schema_cls = AssetsSchema
    nested_cls = AssetsSchemaNested
    moderator_cls = AssetsSchemaModerator

@register_views(route='category_v1', collection_route='category_collection_v1')
class CategoryView(BaseView):
    item_cls = Category
    schema_cls = CategorySchema

@register_views(route='submission_v1', collection_route='submission_collection_v1')
class SubmissionView(BaseView):
    item_cls = Submission
    schema_cls = SubmissionSchema
    everyone_cls = SubmissionSchemaEveryone

@view_defaults(renderer='json')
class TitleDBViews:
    active_version = 'v1'

    def __init__(self, request):
        self.request = request
        self.logged_in = request.authenticated_userid

    @view_config(route_name='home')
    def home(self):
        return dict(api_version=self.active_version)

    @view_config(route_name='cia_collection_v0', renderer='json')
    def legacy_list_v0(self):
        data = DBSession.query(CIA_v0).filter_by(active=True).all()
        self.request.render_schema = CIASchema_v0(many=True)
        return data

    @view_config(route_name='login_v1', renderer='login.pt')
    def login(self):
        request = self.request
        login_url = request.route_url('login_'+TitleDBViews.active_version)
        referrer = request.url
        message = ''
        login = ''
        password = ''
        if 'form.submitted' in request.params:
            login = request.params['login']
            password = request.params['password']
            user = DBSession.query(User).filter_by(name=login,active=True).first()
            if user and check_password(password, user.password):
                headers = remember(request, login)
            else:
                headers = forget(request)

            return HTTPFound(location=request.route_url('login_status_'+TitleDBViews.active_version),
                                 headers=headers)

        return dict(
            name='Login',
            message=message,
            url=request.application_url+'/'+TitleDBViews.active_version+'/login',
            login=login,
            password=password,
        )

    @view_config(route_name='logout_v1')
    def logout(self):
        request = self.request
        headers = forget(request)
        url = request.route_url('login_status_'+TitleDBViews.active_version)
        return HTTPFound(location=url,
                         headers=headers)

    @view_config(route_name='login_status_v1')
    def login_status(self):
        request = self.request
        logged_in = request.authenticated_userid
        return dict(login=logged_in)

    @view_config(route_name='png_image_v0')
    def png_image(self):
        request = self.request
        if request.matchdict and request.matchdict['titleid']:
            titleid = request.matchdict['titleid']
            cia = DBSession.query(CIA).filter(CIA.titleid.ilike(titleid)).first()
            if cia:
                #create_png_from_icon(cia.icon_l, 'titledb/images/'+cia.titleid+'.png')
                return Response(pragma='public',cache_control='max-age=86400',content_type='image/png',
                                body=create_png_from_icon(cia.icon_l))
        return dict(error='TitleID not found.')

    #@view_config(route_name='redirect_v0')
    #def redirect_to_url(self):
    #    request = self.request
    #    if request.matchdict and request.matchdict['titleid']:
    #        titleid = request.matchdict['titleid']
    #        cia = DBSession.query(CIA).filter(CIA.titleid.ilike(titleid)).first()
    #        if cia:
    #            return HTTPFound(location=cia.url)
    #    return dict(error='TitleID not found.')

    @view_config(route_name='proxy_v0')
    def proxy_or_redirect_cia(self):
        request = self.request
        if request.matchdict and request.matchdict['titleid']:
            titleid = request.matchdict['titleid']
            cia = DBSession.query(CIA).filter(CIA.titleid.ilike(titleid)).first()
            if cia:
                if cia.path:
                    # Verify cache file is there and valid.
                    verify_cache()

                    return FileResponse(
                               'cache/'+ parse.quote_plus(cia.url) +'/'+cia.path,
                               request=request,
                               content_type='application/x-3dsarchive'
                           )
                else:
                    return HTTPFound(location=cia.url)
        return dict(error='TitleID not found.')

    @view_config(route_name='time_v1')
    def time(self):
        return datetime.utcnow()

    @forbidden_view_config(renderer='json')
    def forbidden(self):
        return dict(error='Access denied.')

