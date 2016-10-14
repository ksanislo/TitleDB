from marshmallow import Schema, fields

from pyramid.security import Allow, Everyone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    Binary,
    Text,
    Unicode,
    ForeignKey
)

from sqlalchemy.ext.declarative import ( AbstractConcreteBase, declarative_base, declared_attr )

from sqlalchemy.ext.hybrid import hybrid_property

from sqlalchemy.orm import (
    relationship,
    scoped_session,
    sessionmaker,
    column_property
)

from sqlalchemy.sql import ( select, func, cast )

from zope.sqlalchemy import ZopeTransactionExtension

from .jsonhelper import RenderSchema

DBSession = scoped_session(
    sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()

class GenericBase(AbstractConcreteBase, Base):
    id = Column(Integer, primary_key=True)
    active = Column(Boolean)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class GenericSchema(RenderSchema):
    id = fields.Integer(dump_only=True)
    active = fields.Bool()
    created_at = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ', dump_only=True)
    updated_at = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ', dump_only=True)
    class Meta:
        ordered = True
        exclude = ['created_at','updated_at']

class FileBase(GenericBase, AbstractConcreteBase):
    version = Column(Text(64))
    size = Column(Integer)
    mtime = Column(DateTime)
    path = Column(Text(512))
    sha256 = Column(Text(64))
    @declared_attr
    def url_id(cls):
        return Column(Integer, ForeignKey('url.id'))
    @declared_attr
    def url(cls):
        return relationship('URL')

class FileSchema(GenericSchema):
    version = fields.String()
    size = fields.Integer()
    mtime = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ')
    path = fields.String()
    sha256 = fields.String()
    url_id = fields.Integer()

class FileSchemaNested(FileSchema):
    url_id = fields.Integer(load_only=True)
    url = fields.Nested('URLSchemaNested', many=False, only='url')

class URL(GenericBase):
    __tablename__ = 'url'
    url = Column(Text)
    filename = Column(Text(256))
    version = Column(Text(64))
    etag = Column(Text(512))
    mtime = Column(DateTime)
    content_type = Column(Text(64))
    size = Column(Integer)    
    sha256 = Column(Text(64)) 

class URLSchema(RenderSchema):
    id = fields.Integer(dump_only=True)
    url = fields.URL()
    filename = fields.String()
    version = fields.String()
    etag = fields.String()
    mtime = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ')
    content_type = fields.String()
    created_at = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ', dump_only=True)
    updated_at = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ', dump_only=True)

class URLSchemaNested(URLSchema):
    None

class Entry(GenericBase):
    __tablename__ = 'entry'
    category_id = Column(Integer, ForeignKey('category.id'))
    category = relationship('Category')
    name = Column(Text(128))
    author = Column(Text(128))
    headline = Column(Text(128))
    description = Column(Text(4096))
    url = Column(Text(2048))
    cia = relationship('CIA',
        primaryjoin='and_(CIA.entry_id == Entry.id, CIA.active == True)')
    tdsx = relationship('TDSX',
        primaryjoin='and_(TDSX.entry_id == Entry.id, TDSX.active == True)')
    arm9 = relationship('ARM9',
        primaryjoin='and_(ARM9.entry_id == Entry.id, ARM9.active == True)')

class EntrySchema(GenericSchema):
    category_id = fields.Integer()
    name = fields.String()
    author = fields.String()
    headline = fields.String()
    description = fields.String()
    url = fields.URL()

class EntrySchemaNested(EntrySchema):
    category_id = fields.Integer(load_only=True)
    category = fields.Nested('CategorySchema', many=False, only='name')
    cia = fields.Nested('CIASchemaNested', many=True, exclude=['active','entry_id','entry'])
    tdsx = fields.Nested('TDSXSchemaNested', many=True, exclude=['active','entry_id','entry'])
    arm9 = fields.Nested('ARM9SchemaNested', many=True, exclude=['active','entry_id','entry'])

class CIA(FileBase):
    __tablename__ = 'cia'
    entry_id = Column(Integer, ForeignKey('entry.id'))
    assets_id = Column(Integer, ForeignKey('assets.id'))
    titleid = Column(Text(16))
    name_s = Column(Unicode(64))
    name_l = Column(Unicode(128))
    publisher = Column(Unicode(64))
    icon_s = Column(Text(1535))
    icon_l = Column(Text(6144))
    entry = relationship('Entry')
    assets = relationship('Assets')

class CIASchema(FileSchema):
    entry_id = fields.Integer()
    assets_id = fields.Integer()
    titleid = fields.String()
    name_s = fields.String()
    name_l = fields.String()
    publisher = fields.String()
    icon_s = fields.String()
    icon_l = fields.String()

class CIASchemaNested(FileSchemaNested, CIASchema):
    entry_id = fields.Integer(load_only=True)
    assets_id = fields.Integer(load_only=True)
    entry = fields.Nested('EntrySchemaNested', many=False, exclude=['active','cia','tdsx','arm9'])
    assets = fields.Nested('AssetsSchemaNested', many=False, exclude=['active','cia','tdsx','arm9'])

class CIA_v0(Base):
    __table__ = CIA.__table__
    __mapper_args__ = {
        'include_properties' :['id', 'active', 'titleid', 'name', 'description', 'author', 'size', 'mtime', 'create_time', 'update_time', 'url_id']
    }
    id = CIA.__table__.c.id
    active = CIA.__table__.c.active
    titleid = CIA.__table__.c.titleid
    name = CIA.__table__.c.name_s
    description = CIA.__table__.c.name_l
    author = CIA.__table__.c.publisher
    size = CIA.__table__.c.size
    mtime = CIA.__table__.c.mtime
    url = relationship('URL', primaryjoin=URL.id==__table__.c.url_id)
    create_time = CIA.__table__.c.created_at
    update_time = CIA.__table__.c.updated_at

class CIASchema_v0(RenderSchema):
    id = fields.Integer(dump_only=True)
    titleid = fields.String(dump_only=True)
    name = fields.String(dump_only=True)
    description = fields.String(dump_only=True)
    author = fields.String(dump_only=True)
    size = fields.Integer(dump_only=True)
    mtime = fields.Function(lambda obj: int(obj.mtime.strftime('%s')), dump_only=True)
    url = fields.Nested('URLSchemaNested', many=False, only='url')
    create_time = fields.DateTime(format='%Y-%m-%d %H:%M:%S', dump_only=True)
    update_time = fields.DateTime(format='%Y-%m-%d %H:%M:%S', dump_only=True)
    class Meta:
        ordered = True

class TDSX(FileBase):
    __tablename__ = 'tdsx'
    entry_id = Column(Integer, ForeignKey('entry.id'))
    smdh_id = Column(Integer, ForeignKey('smdh.id'))
    xml_id = Column(Integer, ForeignKey('xml.id'))
    assets_id = Column(Integer, ForeignKey('assets.id'))
    smdh = relationship('SMDH')
    xml = relationship('XML')
    entry = relationship('Entry')
    assets = relationship('Assets')

class TDSXSchema(FileSchema):
    entry_id = fields.Integer()
    smdh_id = fields.Integer()
    xml_id = fields.Integer()
    assets_id = fields.Integer()

class TDSXSchemaNested(FileSchemaNested, TDSXSchema):
    entry_id = fields.Integer(load_only=True)
    smdh_id = fields.Integer(load_only=True)
    xml_id = fields.Integer(load_only=True)
    assets_id = fields.Integer(load_only=True)
    smdh = fields.Nested('SMDHSchemaNested', many=False, exclude=['active','tdsx'])
    xml = fields.Nested('XMLSchemaNested', many=False, exclude=['active','tdsx'])
    entry = fields.Nested('EntrySchemaNested', many=False, exclude=['active','cia','tdsx','arm9'])
    assets = fields.Nested('AssetsSchemaNested', many=False, exclude=['active','cia','tdsx','arm9'])

class SMDH(FileBase):
    __tablename__ = 'smdh'
    name_s = Column(Unicode(64))
    name_l = Column(Unicode(128))
    publisher = Column(Unicode(64))
    icon_s = Column(Text(1535))
    icon_l = Column(Text(6144))
    tdsx = relationship('TDSX', uselist=False,
        primaryjoin='and_(TDSX.smdh_id == SMDH.id, TDSX.active == True)')

class SMDHSchema(FileSchema):
    name_s = fields.String()
    name_l = fields.String()
    publisher = fields.String()
    icon_s = fields.String()
    icon_l = fields.String()

class SMDHSchemaNested(FileSchemaNested, SMDHSchema):
    tdsx = fields.Nested('TDSXSchemaNested', many=False, exclude=['smdh'])

class XML(FileBase):
    __tablename__ = 'xml'
    tdsx = relationship('TDSX', uselist=False,
        primaryjoin='and_(TDSX.xml_id == XML.id, TDSX.active == True)')

class XMLSchema(FileSchema):
    None

class XMLSchemaNested(FileSchemaNested, XMLSchema):
    tdsx = fields.Nested('TDSXSchemaNested', many=False, exclude=['xml'])

class ARM9(FileBase):
    __tablename__ = 'arm9'
    entry_id = Column(Integer, ForeignKey('entry.id'))
    assets_id = Column(Integer, ForeignKey('assets.id'))
    entry = relationship('Entry')
    assets = relationship('Assets')

class ARM9Schema(FileSchema):
    entry_id = fields.Integer()
    assets_id = fields.Integer()

class ARM9SchemaNested(FileSchemaNested, ARM9Schema):
    entry_id = fields.Integer(load_only=True)
    assets_id = fields.Integer(load_only=True)
    entry = fields.Nested('EntrySchemaNested', many=False, exclude=['cia','tdsx','arm9'])
    assets = fields.Nested('AssetsSchemaNested', many=False, exclude=['cia','tdsx','arm9'])

class Assets(FileBase):
    __tablename__ = 'assets'
    mapping = Column(Text(4096))
    cia = relationship('CIA',
        primaryjoin='and_(CIA.assets_id == Assets.id, CIA.active == True)')
    tdsx = relationship('TDSX',
        primaryjoin='and_(TDSX.assets_id == Assets.id, TDSX.active == True)')
    arm9 = relationship('ARM9',
        primaryjoin='and_(ARM9.assets_id == Assets.id, ARM9.active == True)')

class AssetsSchema(FileSchema):
    mapping = fields.String()

class AssetsSchemaNested(FileSchemaNested, AssetsSchema):
    cia = fields.Nested('CIASchemaNested', many=True, exclude=['active','assets_id','assets'])
    tdsx = fields.Nested('TDSXSchemaNested', many=True, exclude=['active','assets_id','assets'])
    arm9 = fields.Nested('ARM9SchemaNested', many=True, exclude=['active','assets_id','assets'])

class AssetsSchemaModerator(AssetsSchema):
    class Meta:
        ordered = True
        exclude = ['created_at','updated_at']
        dump_only = ['version','size','mtime','path','sha256']

class Category(GenericBase):
    __tablename__ = 'category'
    name = Column(Text)

class CategorySchema(RenderSchema):
    id = fields.Integer(dump_only=True)
    name = fields.String()
    active = fields.Bool()
    created_at = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ', dump_only=True)
    updated_at = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ', dump_only=True)

class Submission(GenericBase):
    __tablename__ = 'submission'
    active = Column(Boolean, default=True)
    url = Column(Text(1024))
    status = Column(Text(1024))

class SubmissionSchema(GenericSchema):
    url = fields.URL(required=True)
    status = fields.String()

class SubmissionSchemaEveryone(SubmissionSchema):
    class Meta:
        ordered = True
        exclude = ['created_at','updated_at']
        dump_only = ['active','status']

class User(GenericBase):
    __tablename__ = 'users'
    name = Column(Text, unique=True)
    password = Column(Text)
    email = Column(Text)
 
class Group(GenericBase):
    __tablename__ = 'groups'
    name = Column(Text)
 
