import os
from .magic import process_url, url_to_cache_path

def verify_cache(item, settings):
    # FIXME: This should verify active/inactive and double check return.
    # Final return value is the matching local file path for this item, or None

    retval = process_url(item.url, settings=settings)

    if retval:
        if item.path: 
            return os.path.join(url_to_cache_path(item.url.url, settings['titledb.cache']), 'archive_root', item.path)
        else:
            return os.path.join(url_to_cache_path(item.url.url, settings['titledb.cache']), item.url.filename)

    return None
