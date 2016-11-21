#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import hashlib
import transaction
import json
import os
import re
import mimetypes
import numpy
import base64
import collections

from datetime import datetime

from .models import (
    DBSession,
    URL,
    URLSchema,
    ARM9,
    CIA,
    SMDH,
    TDSX
)

mimetypes.add_type('application/x-3ds-archive','.cia')
mimetypes.add_type('application/x-3ds-homebrew','.3dsx')
mimetypes.add_type('application/x-3ds-iconfile','.smdh')
mimetypes.add_type('application/x-3ds-arm9bin','.bin')
mimetypes.add_type('application/x-3ds-xml','.xml')

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

def process_url(url_string=None, url_id=None, cache_root=''):
    with transaction.manager:
        if url_string:
            url_string = url_string.split('#')[0]    # Remove any # target from the URL
            item = DBSession.query(URL).filter_by(url=url_string).first()
            if not item:
                item = URL(url=url_string)
        elif url_id:
            item = DBSession.query(URL).get(url_id)
            if not item:
                return None
        else:
            return None

        headers = dict()
        headers['User-Agent'] = 'Mozilla/5.0 (Nintendo 3DS; Mobile; rv:10.0) Gecko/20100101 TitleDB/1.0'

        if item.url and item.filename:
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

        subitems = []
        if r.status_code == 200:
            item.version = find_version_in_string(item.url)

            cache_path = url_to_cache_path(item.url, cache_root)
            if not os.path.isdir(cache_path):
                os.makedirs(cache_path)

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

            (item.size, item.sha256) = download_to_filename(r, os.path.join(cache_path,item.filename))

            if not item.size or not item.sha256:
                None # TODO: Errors happened during download.

            # FIXME: This would be cleaner as a function.
            switcher = {
                'application/x-3ds-archive': add_cia,
                'application/x-3ds-homebrew': add_tdsx,
                'application/x-3ds-iconfile': add_smdh,
                'application/x-3ds-arm9bin': add_arm9,
                'application/x-3ds-xml': add_xml
            }
            action = switcher.get(item.content_type, None)
            if action:
                results = action(item, cache_path=cache_path)
                if results:
                    item.active = True
                    if isinstance(results, collections.Iterable):
                        subitems.extend(results)
                    else:
                        subitems.append(results)
            else:
                item.active = False

        elif r.status_code == 304:
            #item.active = True
            None

        else:
            item.active = False

        # Realize self
        if not item.id:
            if item.active:
                DBSession.add(item)
                DBSession.flush()
            else:
                DBSession.rollback()
                return(None)

        # Realize all subitems
        for subitem in subitems:
            subitem.url_id = item.id
            if not subitem.id:
                DBSession.add(subitem)
                DBSession.flush()

        DBSession.flush()
        return URLSchema().dump(item).data

def add_cia(url, cache_path, archive_path=None):
    if archive_path:
        filename=os.path.join(cache_path,'archive_root',archive_path)
    else:
        filename=os.path.join(cache_path,url.filename)

    item = DBSession.query(CIA).filter_by(url_id=url.id,path=archive_path).first()
    if not item:
        item = CIA(active=False)

    item.path = archive_path
    item.version = url.version
    item.size = os.path.getsize(filename)
    item.mtime = datetime.fromtimestamp(os.path.getmtime(filename))
    item.sha256 = checksum_sha256(filename)

    with open(filename, 'rb') as f:
        f.seek(11292)
        try:
            item.titleid = "%0.16X" % numpy.fromfile(f, dtype='>u8', count=1)[0]
        except IndexError:
            return None

        if item.titleid[:8] == "00040000": # and data['titleid'][0:8] != "00048004":
            item.active = True

        f.seek(-14016, 2)
        (item.name_s,item.name_l,item.publisher,item.icon_s,item.icon_l) = decode_smdh(f.read(14016))
    return(item)

def add_tdsx(url_entry, cache_path, archive_path=None):
    None

def add_smdh(url_entry, cache_path, archive_path=None):
    None

def add_arm9(url_entry, cache_path, archive_path=None):
    None

def add_xml(url_entry, cache_path, archive_path=None):
    None

def decode_smdh(smdh):
    # Decoding this raw is pretty awful, it should read headers...

    # freeShop doesn't have SMDH magic. WTF?
    #if req.content[0:4] != 'SMDH':
    #               return None

    # The english description starts at SMDH offset 520, encoded UTF-16
    name_s = smdh[520:520+128].decode('utf-16').rstrip('\0')
    name_l = smdh[520+128:520+384].decode('utf-16').rstrip('\0')
    publisher = smdh[520+384:520+512].decode('utf-16').rstrip('\0')

    # These are the SMDH icons, both small and large.
    icon_s = base64.b64encode(smdh[8256:8256+1152])
    icon_l = base64.b64encode(smdh[9408:9408+4608])

    return (name_s,name_l,publisher,icon_s,icon_l)

