#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import hashlib
import transaction
import json
import os
import re
import rarfile
import mimetypes
import numpy
import base64
import collections
import libarchive

from datetime import datetime

from .models import (
    DBSession,
    URL,
    URLSchema,
    Entry,
    ARM9,
    CIA,
    SMDH,
    TDSX,
    XML,
    Assets
)

mimetypes.add_type('application/x-3ds-archive', '.cia')
mimetypes.add_type('application/x-3ds-homebrew', '.3dsx')
mimetypes.add_type('application/x-3ds-iconfile', '.smdh')
mimetypes.add_type('application/x-3ds-arm9bin', '.bin')
mimetypes.add_type('application/x-3ds-xml', '.xml')

# RAR is bad. Please don't use proprietary formats.
rarfile.UNRAR_TOOL = "unrar-nonfree"
rarfile.NEED_COMMENTS = 0
rarfile.USE_DATETIME = 1
rarfile.PATH_SEP = '/'

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

        #subitems = []
        results = None
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

            switcher = {
                'application/rar': process_rar_archive,

                'application/x-3ds-archive': process_cia,
                'application/x-3ds-homebrew': process_tdsx,
                'application/x-3ds-iconfile': process_smdh,
                'application/x-3ds-arm9bin': process_arm9,
                'application/x-3ds-xml': process_xml
            }
            action = switcher.get(item.content_type, process_archive)
            if action:
                relatives = find_item_relatives(item)
                results = action(item, relatives, cache_path)
                if results:
                    item.active = True
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

        if results:
            if not isinstance(results, collections.Iterable):
                results = [results]
                results.extend(find_nonarchive_results(item))

            # Make sure everything new gets a url_id before we try to find siblings.
            for result_item in results:
                if not result_item.url_id:
                    result_item.url_id = item.id

            # Match up any xml or smdh files in the same folder as our 3dsx.
            for result_item in results:
                if result_item.__class__ == TDSX:
                    for check_item in results:
                        if check_siblings(check_item, result_item):
                            exec('result_item.'+check_item.__class__.__name__.lower()+'_id = check_item.id')

                if not result_item.id and result_item.active:
                    DBSession.add(result_item)
                    DBSession.flush()

        DBSession.flush()
        return URLSchema().dump(item).data

def find_nonarchive_results(item):
    results = list()
    url_like = '/'.join(item.url.split('?')[0].split('/')[:-1]) + '/%'
    filename_like = '.'.join(item.filename.split('.')[:-1]) + '.%'
    # TODO: I'm sure this could be more efficient with a join somehow.
    urls = DBSession.query(URL).filter(URL.url.like(url_like)).filter(URL.filename.like(filename_like)).all()
    for url in urls:
        for item_cls in (TDSX, SMDH, XML):
            new_items = DBSession.query(item_cls).filter(item_cls.url_id == url.id).all()
            results.extend(new_items)
    return(results)

def check_siblings(first, second):
    if first == second:
        return(False)

    if first.path and second.path \
        and first.url_id == second.url_id \
        and first.path.split('.')[:-1] == second.path.split('.')[:-1]:
        return(True)

    if not first.path and not second.path:
        first_url = DBSession.query(URL).get(first.url_id)
        second_url = DBSession.query(URL).get(second.url_id)
        if first_url.url.split('?')[0].split('/')[:-1]+first_url.filename.split('.')[:-1] == second_url.url.split('?')[0].split('/')[:-1]+second_url.filename.split('.')[:-1]:
            return(True)

    return(False)

def find_item_relatives(item):
    previous_item = DBSession.query(URL).filter(URL.url.like(item.url.replace(item.version,'%'))).order_by(URL.created_at.desc()).first()
    relatives = list()
    for item_cls in (CIA, TDSX, ARM9):
        new_items = DBSession.query(item_cls).filter(item_cls.url_id == item.id).all()
        relatives.extend(new_items)
    return(relatives)

def process_archive(parent, relatives, cache_path):
    filename = os.path.join(cache_path, parent.filename)
    if parent.__class__ == URL:
        url_id = parent.id
    else:
        url_id = parent.url_id

    results = list()
    try:
        with libarchive.file_reader(filename) as archive:
            for entry in archive:
                if entry.isfile:
                    switcher = {
                        'application/x-3ds-archive': process_cia,
                        'application/x-3ds-homebrew': process_tdsx,
                        'application/x-3ds-iconfile': process_smdh,
                        'application/x-3ds-arm9bin': process_arm9,
                        'application/x-3ds-xml': process_xml
                    }
                    action = switcher.get(determine_mimetype(entry.pathname), None)
                    if action:
                        working_file = os.path.join(cache_path, 'archive_root', entry.pathname)
                        working_path = '/'.join(working_file.split('/')[:-1])
                        if not os.path.isdir(working_path):
                            os.makedirs(working_path)
                        with open(working_file, 'wb') as f:
                            for block in entry.get_blocks():
                                f.write(block)
                        os.utime(working_file, (entry.mtime,entry.mtime))
                        results.append(action(parent, relatives, cache_path, entry.pathname))
    except libarchive.exception.ArchiveError as e:
        print(e)

    return(results)

def process_rar_archive(parent, relatives, cache_path):
    filename = os.path.join(cache_path, parent.filename)
    if parent.__class__ == URL:
        url_id = parent.id
    else:
        url_id = parent.url_id

    results = list()
    try:
        with rarfile.RarFile(filename) as archive:
            for entry in archive.infolist():
                switcher = {
                    'application/x-3ds-archive': process_cia,
                    'application/x-3ds-homebrew': process_tdsx,
                    'application/x-3ds-iconfile': process_smdh,
                    'application/x-3ds-arm9bin': process_arm9,
                    'application/x-3ds-xml': process_xml
                }
                action = switcher.get(determine_mimetype(entry.filename), None)
                if action:
                    working_file = os.path.join(cache_path, 'archive_root', entry.filename)
                    working_path = '/'.join(working_file.split('/')[:-1])
                    if not os.path.isdir(working_path):
                        os.makedirs(working_path)
                    with open(working_file, 'wb') as f:
                        with archive.open(entry.filename, 'r') as a:
                            for block in iter((lambda:a.read(32768)),''):
                                if not block: break
                                f.write(block)
                    os.utime(working_file, (entry.date_time.timestamp(),entry.date_time.timestamp()))
                    results.append(action(parent, relatives, cache_path, entry.filename))
    except rarfile.Error as e:
        print(e)

    return(results)

def process_cia(parent, relatives, cache_path, archive_path=None):
    (cia, filename) = find_or_fill_generic(CIA, parent, relatives, cache_path, archive_path)
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

def process_tdsx(parent, relatives, cache_path, archive_path=None):
    (tdsx, filename) = find_or_fill_generic(TDSX, parent, relatives, cache_path, archive_path)
    tdsx.active = True
    return(tdsx)

def process_smdh(parent, relatives, cache_path, archive_path=None):
    (smdh, filename) = find_or_fill_generic(SMDH, parent, relatives, cache_path, archive_path)
    with open(filename, 'rb') as f:
        (smdh.name_s, smdh.name_l, smdh.publisher, smdh.icon_s, smdh.icon_l) = decode_smdh_data(f.read(14016))
    smdh.active = True
    return(smdh)

def process_arm9(parent, relatives, cache_path, archive_path=None):
    (arm9, filename) = find_or_fill_generic(ARM9, parent, relatives, cache_path, archive_path)
    with open(filename, 'rb') as f:
        # Look for ARM instruction: mov sp, #0x27000000
        if 0xE3A0D427 in numpy.fromfile(f, dtype='<u4', count=32):
            arm9.active = True
    return(arm9)

def process_xml(parent, relatives, cache_path, archive_path=None):
    (xml, filename) = find_or_fill_generic(XML, parent, relatives, cache_path, archive_path)
    xml.active = True
    return(xml)

def find_or_fill_generic(cls, parent, relatives, cache_path, archive_path=None):
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

    if relatives:
        if not isinstance(relatives, collections.Iterable):
            relatives = [relatives]

        relative_entry_ids = []
        relative_assets_ids = []
        for relative in relatives:
            if relative.entry_id:
                relative_entry_ids.append(relative.entry_id)

            if relative.assets_id:
                relative_assets_ids.appent(relative.assets_id)

            # Try to find an exact match for this file in our relatives.
            if relative.__class__ == item.__class__ and item.path.replace(item.version, '') == relative.path.replace(relative.version, ''):
                item.entry_id = relative.entry_id
                item.assets_id = relative.assets_id

        # If there's still nothing, add the most common entry_id and assets_id from the relatives.
        if 'entry_id' in dir(item) and not item.entry_id and relative_entry_ids:
            counter = collections.Counter(relative_entry_ids)
            item.entry_id = counter.most_common(1)[0][0]

        if 'assets_id' in dir(item) and not item.assets_id and relative_assets_ids:
            counter = collections.Counter(relative_assets_ids)
            item.assets_id = counter.most_common(1)[0][0]

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

