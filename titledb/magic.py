import requests
import hashlib
import transaction
import json
import re
from datetime import datetime

from .models import (
    DBSession,
    URL,
    URLSchema,
)

def download_file(path, url):
    url = url.split('#')[0]    # Remove any # target from the URL
    with transaction.manager:
        item = DBSession.query(URL).filter_by(url=url).first()

        if item:
            new = False
        else:
            new = True
            item = URL(url=url)

        headers = dict()
        headers['User-Agent'] = "Mozilla/5.0 (Nintendo 3DS; Mobile; rv:10.0) Gecko/20100101 api.titledb.com/1.0"

        if item.etag:
            headers['If-None-Match'] = item.etag
        elif item.mtime:
            headers['If-Modified-Since'] = item.mtime.strftime('%a, %d %b %Y %H:%M:%S GMT')

        print("URL: "+url)
        print("Request headers:")
        print(json.dumps(dict(headers), sort_keys=True, indent=4, separators=(',', ': ')))

        r = requests.get(url, stream=True, headers=headers)

        print("Response headers:")
        print(json.dumps(dict(r.headers), sort_keys=True, indent=4, separators=(',', ': ')))

	# GitHub release "archive" fail to properly report as 304, but we can fake it.
        if r.status_code == 200 and 'etag' in r.headers and item.etag == r.headers['etag']:
            r.status_code = 304

        print("HTTP Status: " + str(r.status_code))

        if r.status_code == 200:
            item.active = 1

            if 'etag' in r.headers:
                item.etag = r.headers['etag']

            if 'last-modified' in r.headers:
                item.mtime = datetime.strptime(r.headers['last-modified'], "%a, %d %b %Y %X %Z")

            if 'content-type' in r.headers:
                item.content_type = r.headers['content-type']

            if 'content-disposition' in r.headers:
                item.filename = r.headers['content-disposition'].partition("filename=")[2].strip('"')
            else:
                item.filename = url.split('/')[-1].split('?')[0]

            h = hashlib.sha256()
            item.size = 0
            with open(path + '/' + item.filename, 'wb') as f:
                for chunk in r.iter_content(chunk_size=65536):
                    if chunk: # filter out keep-alive new chunks
                        item.size += len(chunk)
                        h.update(chunk)
                        f.write(chunk)
            item.sha256 = h.hexdigest()

        if new and item.active:
            DBSession.add(item)

        DBSession.flush()

