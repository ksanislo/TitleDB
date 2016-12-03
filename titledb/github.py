from .magic import process_url
from .models import (
    DBSession,
    URL
)

import json

def github_full_scan(cache_root=None):
    url_like = 'https://github.com/%/releases/download/%'
    urls = DBSession.query(URL).filter_by(active=True).filter(URL.url.like(url_like)).all()

    import pdb; pdb.set_trace()

    if urls:
        for url in urls:
            (repouser, reponame) = github_find_user_repo(url)
            

def github_parse_user_repo(url):
    return url.url.split('/')[3:5]

def github_user_repo_to_api(repouser, reponame):
    return('https://api.github.com/repos/' + repouser + '/' + reponame + '/releases/latest')
