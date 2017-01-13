#import titledb.debug

import os
import sys
import re
import transaction
#import base64
#import zlib

from sqlalchemy import engine_from_config, event

from pyramid.paster import (
    get_appsettings,
    setup_logging,
)

from .cron import process_submission_queue
from .github import github_full_scan
from .magic import process_url, find_version_in_string

from .models import (
    DBSession,
    CIA,
    Entry,
    User,
    Group,
    Base,
)

from .security import hash_password

def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri>\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)

def action_add(settings, url):
    with transaction.manager:
        url_info = process_url(url,cache_root=settings['titledb.cache'])
    
def action_cron(settings, args):
    process_submission_queue(cache_root=settings['titledb.cache'])

def action_github(settings, args):
    github_full_scan(cache_root=settings['titledb.cache'])

def action_none(settings, url):
    None

def main(argv=sys.argv):
    #if len(argv) != 2:
    #    usage(argv)
    #config_uri = argv[1]
    config_uri = "development.ini"
    setup_logging(config_uri)
    settings = get_appsettings(config_uri)
    engine = engine_from_config(settings, 'sqlalchemy.')


    @event.listens_for(engine, "connect")
    def do_connect(dbapi_connection, connection_record):
        # disable pysqlite's emitting of the BEGIN statement entirely.
        # also stops it from emitting COMMIT before any DDL.
        dbapi_connection.isolation_level = None

    @event.listens_for(engine, "begin")
    def do_begin(conn):
        # emit our own BEGIN
        conn.execute("BEGIN")


    DBSession.configure(bind=engine)

    choice = argv[1]

    switcher = {
        'add': action_add,
        'cron': action_cron,
        'github': action_github,
        'none': action_none
    }
    action = switcher.get(choice, action_none)

    if len(argv) >= 3:
        args = argv[2]
    else:
        args = None

    action(settings,args)



#    with transaction.manager:
#        for cia in DBSession.query(CIA).all():
#            cia.icon_s = base64.b64encode(zlib.decompress(base64.b64decode(cia.icon_s)))
#            cia.icon_l = base64.b64encode(zlib.decompress(base64.b64decode(cia.icon_l)))
#            DBSession.query(CIA).filter_by(id=cia.id).update(dict(icon_s=cia.icon_s,icon_l=cia.icon_l))
#
#    with transaction.manager:
#        for cia in DBSession.query(CIA).all():
#
#            m = re.search('(.*)#(.*)', cia.url)
#            if m:
#                cia.url = m.group(1)
#                cia.path = m.group(2)

