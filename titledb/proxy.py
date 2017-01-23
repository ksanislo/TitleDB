from .magic import process_url

def verify_cache(item, settings):
    # FIXME: This should verify active/inactive and double check return.

    retval = process_url(item.url, settings=settings)
    #raise
    return retval
