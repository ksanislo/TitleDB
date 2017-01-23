#from .magic import process_url
import titledb.magic

from .models import (
    DBSession,
    URL
)

import json
import re
import requests
import transaction
import logging

log = logging.getLogger(__name__)

def github_full_scan(settings=None):
    url_like = 'https://github.com/%/releases/download/%'
    urls = DBSession.query(URL).filter_by(active=True).filter(URL.url.like(url_like)).all()

    api_urls = []
    if urls:
        for url in urls:
            (repouser, reponame) = github_parse_user_repo(url)
            api_urls.append(github_user_repo_to_api(repouser, reponame))

    api_urls = set(api_urls)

    headers = {}
    headers['User-Agent'] = 'Mozilla/5.0 (Nintendo 3DS; Mobile; rv:10.0) Gecko/20100101 TitleDB/1.0'

    for github_api_url in api_urls:
        userpass = json.load(open("private/github_credentials.json"))
        req = requests.get(github_api_url, headers=headers, auth=(userpass['username'],userpass['password']))

        data = json.loads(req.text)

        #import pdb; pdb.set_trace()
        if 'assets' in data:
            for asset in data['assets']:
                try:
                    with transaction.manager:
                        with DBSession.begin_nested():
                            titledb.magic.process_url(asset['browser_download_url'], settings=settings)
                            #transaction.commit()
                except:
                    transaction.rollback()

        else:
            log.info("GitHub API Failure: %s", github_api_url)

def github_parse_user_repo(url):
    m = re.fullmatch('https?://github.com/([^/]+)/([^/]+)/releases/download/.*/[^/]+', url.url)

    if m:
        return(m.group(1), m.group(2))
    return (None, None)

def github_user_repo_to_api(repouser, reponame):
    return('https://api.github.com/repos/' + repouser + '/' + reponame + '/releases/latest')
