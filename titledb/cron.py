from .magic import process_url
from .models import (
    DBSession,
    Submission
)

import json
import transaction

def process_submission_queue(cache_root=None):
    submissions = DBSession.query(Submission).filter_by(active=True).all()
    for submission in submissions:
        if submission.url:
            try:
                with transaction.manager:
                #with DBSession.begin_nested():
                    result = json.dumps(process_url(submission.url, cache_root=cache_root))
                    #process_url(asset['browser_download_url'], cache_root=cache_root)
            except:
                DBSession.rollback()
            else:
                submission.status = result            
                submission.active = False
                transaction.commit()
                #DBSession.flush()

