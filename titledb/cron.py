from .magic import process_url
from .models import (
    DBSession,
    Submission
)

import json
import transaction

def process_submission_queue(cache_root=None):
    with transaction.manager:
        submissions = DBSession.query(Submission).filter_by(active=True).all()
        for submission in submissions:
            if submission.url:
                try:
                    result = json.dumps(process_url(submission.url, cache_root=cache_root))
                except:
                    DBSession.rollback()

            submission.status = result            
            submission.active = False
    
