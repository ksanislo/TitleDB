from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.config import Configurator
from pyramid.events import NewRequest

from sqlalchemy import engine_from_config, event

from .models import DBSession, Base

from .security import authtkt_callback

from .jsonhelper import custom_json_renderer

import logging
log = logging.getLogger(__name__)

def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '1728000',
        })
    event.request.add_response_callback(cors_headers)

def main(global_config, **settings):
    engine = engine_from_config(settings, 'sqlalchemy.')

    DBSession.configure(bind=engine)
    Base.metadata.bind = engine

    config = Configurator(settings=settings,
                          root_factory='.resources.Root')
    config.include('pyramid_chameleon')

    config.add_subscriber(add_cors_headers_response_callback, NewRequest)

    config.add_renderer('json', custom_json_renderer())

    # Security policies
    authn_policy = AuthTktAuthenticationPolicy(
        settings['titledb.secret'], callback=authtkt_callback,
        hashalg='sha512')
    authz_policy = ACLAuthorizationPolicy()
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    config.add_route('home', '/{x:|v1/?}')

    config.add_route('cia_collection_v0', '/v0{x:/?}')
    config.add_route('png_image_v0', '/{x:(v0/)?}images/{titleid:00040000[0-9A-Fa-f]{8}}.png')
    config.add_route('proxy_v0', '/v0/proxy/{titleid:00040000[0-9A-Fa-f]{8}}')

    config.add_route('entry_v1', '/v1/entry/{id:\d+}')
    config.add_route('entry_collection_v1', '/v1/entry')
    config.add_route('url_v1', '/v1/url/{id:\d+}')
    config.add_route('url_collection_v1', '/v1/url')
    config.add_route('cia_v1', '/v1/cia/{id:\d+}')
    config.add_route('cia_collection_v1', '/v1/cia')
    config.add_route('3dsx_v1', '/v1/tdsx/{id:\d+}')
    config.add_route('3dsx_collection_v1', '/v1/tdsx')
    config.add_route('smdh_v1', '/v1/smdh/{id:\d+}')
    config.add_route('smdh_collection_v1', '/v1/smdh')
    config.add_route('xml_v1', '/v1/xml/{id:\d+}')
    config.add_route('xml_collection_v1', '/v1/xml')
    config.add_route('arm9_v1', '/v1/arm9/{id:\d+}')
    config.add_route('arm9_collection_v1', '/v1/arm9')
    config.add_route('assets_v1', '/v1/assets/{id:\d+}')
    config.add_route('assets_collection_v1', '/v1/assets')
    config.add_route('category_v1', '/v1/category/{id:\d+}')
    config.add_route('category_collection_v1', '/v1/category')
    config.add_route('status_v1', '/v1/status/{id:\d+}')
    config.add_route('status_collection_v1', '/v1/status')
    config.add_route('submission_v1', '/v1/submission/{id:\d+}')
    config.add_route('submission_collection_v1', '/v1/submission')

    config.add_route('icon_image_v1', '/v1/{table:(cia|smdh)}/{id:\d+}/{field:icon_[sl]}.{format:(gif|png|jpg|jpeg|bmp|bin)}')
    config.add_route('download_v1', '/v1/{table:(cia|tdsx|arm9|smdh|xml)}/{id:\d+}/download')

    config.add_route('time_v1', '/v1/time')
    config.add_route('login_v1', '/v1/login')
    config.add_route('logout_v1', '/v1/logout')
    config.add_route('login_status_v1', '/v1/login_status')

    config.add_static_view(name='static', path='titledb:static')

    config.scan('.views')
    return config.make_wsgi_app()
