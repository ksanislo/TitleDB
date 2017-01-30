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
        import pdb; pdb.set_trace()
        for submission in submissions:
            result = None
            if submission.url:
                try:
                    with DBSession.begin_nested():
                        result = process_url(submission.url, settings=settings)
                except:
                    None

            if result:
                submission.status = json.dumps(URLSchema().dump(result).data)
            submission.active = False
    
