from .magic import process_url
from .models import (
    DBSession,
    Submission
)

import json
import transaction
from zope.sqlalchemy import mark_changed

def process_submission_queue(cache_root=None):
    submissions = DBSession.query(Submission).filter_by(active=True).all()
    for submission in submissions:
        if submission.url:
            result = json.dumps(process_url(submission.url, cache_root=cache_root))
            submission.status = result            
            submission.active = False
            DBSession.flush()

