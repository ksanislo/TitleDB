import requests
import hashlib
import transaction
import json
import os
import re
import mimetypes

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

def determine_mimetype(filename, content_type=None):
    mimetypes.add_type('application/x-3ds-archive','.cia')
    mimetypes.add_type('application/x-3ds-homebrew','.3dsx')
    mimetypes.add_type('application/x-3ds-iconfile','.smdh')
    mimetypes.add_type('application/x-3ds-arm9bin','.bin')
    (mimetype, encoding) = mimetypes.guess_type(filename)    
    if mimetype:
        return(mimetype)
    elif content_type:
        return(content_type)

def url_to_cache_path(string, cache_root):
    url_hash = hashlib.sha256(string.encode('utf-8')).hexdigest()
    cache_path = os.path.join(cache_root,url_hash[0:3],url_hash[3:6],url_hash[6:])
    print(cache_path)
    return(cache_path)

def download_to_filename(r, filename):
    with open(filename, 'wb') as f:
        h = hashlib.sha256()
        calculated_size = 0

        try:
            for chunk in r.iter_content(chunk_size=65536):
                if chunk: # filter out keep-alive new chunks
                    calculated_size += len(chunk)
                    h.update(chunk)
                    f.write(chunk)
            del chunk
        except:
            return(None, None)

        return(calculated_size, h.hexdigest())

def process_url(url=None, url_id=None, cache_root=''):
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

        if not new and item.url and item.filename:
            cache_path = url_to_cache_path(item.url, cache_root)

            if item.sha256 and item.sha256 == checksum_sha256(os.path.join(cache_path,item.filename)):
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
            item.active = True
            item.version = find_version_in_string(item.url)

            if 'etag' in r.headers:
                item.etag = r.headers['etag'].strip('"')

            if 'last-modified' in r.headers:
                item.mtime = datetime.strptime(r.headers['last-modified'], '%a, %d %b %Y %H:%M:%S %Z')

            if 'content-disposition' in r.headers:
                item.filename = r.headers['content-disposition'].partition('filename=')[2].strip('"').split('/')[-1]
            else:
                item.filename = item.url.split('/')[-1].split('?')[0]

            if 'content-type' in r.headers:
                item.content_type = determine_mimetype(os.path.join(cache_path,item.filename),r.headers['content-type'])
            else:
                item.content_type = determine_mimetype(os.path.join(cache_path,item.filename))

            cache_path = url_to_cache_path(item.url, cache_root)
            if not os.path.isdir(cache_path):
                os.makedirs(cache_path)

            (item.size, item.sha256) = download_to_filename(r, os.path.join(cache_path,item.filename))

            if not item.size or not item.sha256:
                None # TODO: Errors happened during download.

        if r.status_code == 304:
            item.active = True

        if r.status_code >= 400 and r.status_code <= 499:
            item.active = False

        if new:
            if item.active:
                DBSession.add(item)
            else:
                DBSession.rollback()

        DBSession.flush()
        return URLSchema().dump(item).data

