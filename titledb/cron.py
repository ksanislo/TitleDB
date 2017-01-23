from .magic import process_url
from .models import (
    DBSession,
    Submission,
    URLSchema
)

import json
import transaction

def process_submission_queue(settings=None):
    with transaction.manager:
        submissions = DBSession.query(Submission).filter_by(active=True).all()
        for submission in submissions:
            if submission.url:
                try:
                    result = process_url(submission.url, settings=settings)
                except:
                    DBSession.rollback()

            submission.status = json.dumps(URLSchema().dump(result).data)
            submission.active = False
    
