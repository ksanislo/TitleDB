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
    TDSX,
    XML
)

mimetypes.add_type('application/x-3ds-archive', '.cia')
mimetypes.add_type('application/x-3ds-homebrew', '.3dsx')
mimetypes.add_type('application/x-3ds-iconfile', '.smdh')
mimetypes.add_type('application/x-3ds-arm9bin', '.bin')
mimetypes.add_type('application/x-3ds-xml', '.xml')

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
    cache_path = os.path.join(cache_root, url_hash[0:3], url_hash[3:6], url_hash[6:])
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

        cache_path = url_to_cache_path(item.url, cache_root)

        if item.filename and item.sha256 and item.sha256 == checksum_sha256(os.path.join(cache_path, item.filename)):
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
                item.content_type = determine_mimetype(os.path.join(cache_path, item.filename), r.headers['content-type'])
            else:
                item.content_type = determine_mimetype(os.path.join(cache_path, item.filename))

            (item.size, item.sha256) = download_to_filename(r, os.path.join(cache_path, item.filename))

            if not item.size or not item.sha256:
                None # TODO: Errors happened during download.

            # FIXME: This would be cleaner as a function.
            switcher = {
                'application/x-3ds-archive': process_cia,
                'application/x-3ds-homebrew': process_tdsx,
                'application/x-3ds-iconfile': process_smdh,
                'application/x-3ds-arm9bin': process_arm9,
                'application/x-3ds-xml': process_xml
            }
            action = switcher.get(item.content_type, None)
            if action:
                results = action(item, None, cache_path=cache_path)
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

def process_cia(parent, children, cache_path, archive_path=None):
    (cia, filename) = find_or_fill_generic(CIA, parent, children, cache_path, archive_path)
    with open(filename, 'rb') as f:
        f.seek(11292)
        try:
            cia.titleid = "%0.16X" % numpy.fromfile(f, dtype='>u8', count=1)[0]
        except IndexError:
            return None

        if cia.titleid[:8] == "00040000":
            cia.active = True

        f.seek(-14016, 2)
        (cia.name_s, cia.name_l, cia.publisher, cia.icon_s, cia.icon_l) = decode_smdh_data(f.read(14016))
    return(cia)

def process_tdsx(parent, children, cache_path, archive_path=None):
    (tdsx, filename) = find_or_fill_generic(TDSX, parent, children, cache_path, archive_path)
    tdsx.active = True
    return(tdsx)

def process_smdh(parent, children, cache_path, archive_path=None):
    (smdh, filename) = find_or_fill_generic(SMDH, parent, children, cache_path, archive_path)
    with open(filename, 'rb') as f:
        (smdh.name_s, smdh.name_l, smdh.publisher, smdh.icon_s, smdh.icon_l) = decode_smdh_data(f.read(14016))
    smdh.active = True
    return(smdh)

def process_arm9(parent, children, cache_path, archive_path=None):
    (arm9, filename) = find_or_fill_generic(ARM9, parent, children, cache_path, archive_path)
    arm9.active = True
    return(arm9)

def process_xml(parent, children, cache_path, archive_path=None):
    (xml, filename) = find_or_fill_generic(XML, parent, children, cache_path, archive_path)
    xml.active = True
    return(xml)

def find_or_fill_generic(cls, parent, children, cache_path, archive_path=None):
    if archive_path:
        filename = os.path.join(cache_path, 'archive_root', archive_path)
    else:
        filename = os.path.join(cache_path, parent.filename)

    if parent.__class__ == URL:
        url_id = parent.id
    else:
        url_id = parent.url_id

    item = DBSession.query(cls).filter_by(url_id=url_id, path=archive_path).first()
    if not item:
        item = cls(active=False)

    item.path = archive_path
    item.version = parent.version
    item.size = os.path.getsize(filename)
    item.mtime = datetime.fromtimestamp(os.path.getmtime(filename))
    item.sha256 = checksum_sha256(filename)

    if children:
        if not isinstance(children, collections.Iterable):
            children = [children]

        for child in children:
            exec('item.'+child.__class__.__name__.lower()+'_id = child.id')
            import pdb; pdb.set_trace()
            #if child.__class__ == Entry:
            #    item.entry_id = child.id
            #elif child.__class__ == Assets:
            #    item.assets_id = child.id
            #elif child.__class__ == SMDH:
            #    item.smdh_id = child.id
            #elif child.__class__ == XML:
            #    item.xml_id = child.id

    return(item, filename)

def decode_smdh_data(data):
    # Decoding this raw is pretty awful, it should read headers...

    # freeShop doesn't have SMDH magic. WTF?
    #if req.content[0:4] != 'SMDH':
    #               return None

    # The english description starts at SMDH offset 520, encoded UTF-16
    name_s = data[520:520+128].decode('utf-16').rstrip('\0')
    name_l = data[520+128:520+384].decode('utf-16').rstrip('\0')
    publisher = data[520+384:520+512].decode('utf-16').rstrip('\0')

    # These are the SMDH icons, both small and large.
    icon_s = base64.b64encode(data[8256:8256+1152])
    icon_l = base64.b64encode(data[9408:9408+4608])

    return (name_s, name_l, publisher, icon_s, icon_l)

