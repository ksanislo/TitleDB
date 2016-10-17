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

def download_url(url=None, url_id=None, cache_path=''):
    with transaction.manager:
        new = False
        if url:
            url = url.split('#')[0]    # Remove any # target from the URL
            item = DBSession.query(URL).filter_by(url=url).first()
            if not item:
                new = True
                item = URL(url=url)
        elif url_id:
            item = DBSession.query(URL).get(url_id)
            if not item:
                return None
        else:
            return None

        headers = dict()
        headers['User-Agent'] = 'Mozilla/5.0 (Nintendo 3DS; Mobile; rv:10.0) Gecko/20100101 TitleDB/1.0'

        if item.id and item.filename and item.sha256 \
            and item.sha256 == checksum_sha256(os.path.join(cache_path,str(item.id),item.filename)):
            if item.etag:
                headers['If-None-Match'] = '"' + item.etag + '"'
            elif item.mtime:
                headers['If-Modified-Since'] = item.mtime.strftime('%a, %d %b %Y %H:%M:%S GMT')

        try:
            r = requests.get(item.url, stream=True, headers=headers)
        except requests.exceptions.RequestException:
            return None

	# GitHub release "archive" fail to properly report as 304, but we can fake it.
        if r.status_code == 200 and 'etag' in r.headers and item.etag == r.headers['etag'] \
            and ('If-None-Match' in headers or 'If-Modified-Since' in headers):
            r.status_code = 304

        if r.status_code == 200:
            item.active = 1
            item.version = find_version_in_string(item.url)
            if 'etag' in r.headers:
                item.etag = r.headers['etag'].strip('"')
            if 'last-modified' in r.headers:
                item.mtime = datetime.strptime(r.headers['last-modified'], '%a, %d %b %Y %H:%M:%S %Z')
            if 'content-type' in r.headers:
                item.content_type = r.headers['content-type']
            if 'content-disposition' in r.headers:
                item.filename = r.headers['content-disposition'].partition('filename=')[2].strip('"').split('/')[-1]
            else:
                item.filename = item.url.split('/')[-1].split('?')[0]

            expected_size = 0
            if 'content-length' in r.headers:
                expected_size = int(r.headers['content-length'])

            if new: # add/flush to get our item.id
                DBSession.add(item)
                DBSession.flush()

            if not os.path.isdir(cache_path):
                os.mkdir(cache_path)

            if not os.path.isdir(os.path.join(cache_path,str(item.id))):
                os.mkdir(os.path.join(cache_path,str(item.id)))

            h = hashlib.sha256()
            item.size = 0
            with open(os.path.join(cache_path,str(item.id),item.filename), 'wb') as f:
                try:
                    for chunk in r.iter_content(chunk_size=65536):
                        if chunk: # filter out keep-alive new chunks
                            item.size += len(chunk)
                            h.update(chunk)
                            f.write(chunk)
                except requests.exceptions.RequestException:
                    DBSession.rollback()
                    return None

            chunk = None
            item.sha256 = h.hexdigest()

            if expected_size and item.size != expected_size:
                DBSession.rollback()
                return None

        if r.status_code >= 400 and r.status_code <= 499:
            item.active = 0

        DBSession.flush()
        return URLSchema().dump(item).data

