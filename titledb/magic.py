import requests
import hashlib
import transaction
import json
import os
import re
from datetime import datetime

from .models import (
    DBSession,
    URL,
    URLSchema,
)

def checksum_sha256(filename):
    h = hashlib.sha256()
    try:
        with open(filename, 'rb') as f: 
            for chunk in iter(lambda: f.read(65536), b''): 
                h.update(chunk)
        return h.hexdigest()
    except FileNotFoundError:
        return None

def find_version_in_string(string):
    # GitHub URLs are easy, we'll just pick up the tag.
    m = re.fullmatch('https?://github.com/[^/]+/[^/]+/releases/download/([^/]+)/[^/]+', string)
    if m:
        return m.group(1)

    # Find things that look like version strings and return the last match
    m = re.findall('(v?\d[\d_\-\.]*[ab]?)[/_\-\.]', string)
    if m:
        return m[-1]

    return None

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
        headers['User-Agent'] = 'Mozilla/5.0 (Nintendo 3DS; Mobile; rv:10.0) Gecko/20100101 TitleDB/1.0'

        if item.id and item.filename and item.sha256 \
            and item.sha256 == checksum_sha256(os.path.join(path,str(item.id),item.filename)):
            if item.etag:
                headers['If-None-Match'] = '"' + item.etag + '"'
            elif item.mtime:
                headers['If-Modified-Since'] = item.mtime.strftime('%a, %d %b %Y %H:%M:%S GMT')

        print(headers)

        r = requests.get(url, stream=True, headers=headers)

        print(r.headers)

	# GitHub release "archive" fail to properly report as 304, but we can fake it.
        if r.status_code == 200 and 'etag' in r.headers and item.etag == r.headers['etag'] \
            and ('If-None-Match' in headers or 'If-Modified-Since' in headers):
            r.status_code = 304

        if r.status_code == 200:
            item.active = 1

            if 'etag' in r.headers:
                item.etag = r.headers['etag'].strip('"')

            if 'last-modified' in r.headers:
                item.mtime = datetime.strptime(r.headers['last-modified'], '%a, %d %b %Y %H:%M:%S %Z')

            if 'content-type' in r.headers:
                item.content_type = r.headers['content-type']

            if 'content-disposition' in r.headers:
                item.filename = r.headers['content-disposition'].partition('filename=')[2].strip('"').split('/')[-1]
            else:
                item.filename = url.split('/')[-1].split('?')[0]

            item.version = find_version_in_string(url)

            if new: # add/flush to get our item.id
                DBSession.add(item)
                DBSession.flush()

            if not os.path.isdir(path):
                os.mkdir(path)

            if not os.path.isdir(os.path.join(path,str(item.id))):
                os.mkdir(os.path.join(path,str(item.id)))

            h = hashlib.sha256()
            item.size = 0
            with open(os.path.join(path,str(item.id),item.filename), 'wb') as f:
                for chunk in r.iter_content(chunk_size=65536):
                    if chunk: # filter out keep-alive new chunks
                        item.size += len(chunk)
                        h.update(chunk)
                        f.write(chunk)
            item.sha256 = h.hexdigest()

        DBSession.flush()

