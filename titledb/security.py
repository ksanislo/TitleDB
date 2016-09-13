import bcrypt

from sqlalchemy.orm.exc import NoResultFound

from .models import (
    DBSession,
    User,
    Group
)

import logging
log = logging.getLogger(__name__)

def hash_password(pw):
    pwhash = bcrypt.hashpw(pw.encode('utf8'), bcrypt.gensalt())
    return pwhash.decode('utf8')

def check_password(pw, hashed_pw):
    expected_hash = hashed_pw.encode('utf8')
    return bcrypt.checkpw(pw.encode('utf8'), expected_hash)


USERS = {'editor': hash_password('editor'),
         'viewer': hash_password('viewer')}
GROUPS = {'editor': ['group:editors']}


def authtkt_callback(userid, request):

    try:
        userquery = DBSession.query(User).filter_by(name=userid,active=True).one()
    except NoResultFound:
        return None

    groupquery = DBSession.query(Group).filter_by(id=userquery.id).all()

    groups = []
    for item in groupquery:
        groups.append("group:"+item.name)

    log.debug('Callback checking user: %s (groups: %s)', userid, groups)
    return groups
