#import titledb.debug

import os
import sys
import re
import transaction
#import base64
#import zlib

from sqlalchemy import engine_from_config

from pyramid.paster import (
    get_appsettings,
    setup_logging,
)

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
    url_info = process_url(url,cache_root=settings['titledb.cache'])
    

def action_none(settings, url):
    print(find_version_in_string(url))

def main(argv=sys.argv):
    #if len(argv) != 2:
    #    usage(argv)
    #config_uri = argv[1]
    config_uri = "/home/ken/git/TitleDB/development.ini"
    setup_logging(config_uri)
    settings = get_appsettings(config_uri)
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)

    choice = argv[1]

    switcher = {
        'add': action_add,
        'none': action_none,
    }
    action = switcher.get(choice, action_none)
    action(settings,argv[2])



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

