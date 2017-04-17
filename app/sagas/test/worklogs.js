import test from 'tape';
import { put } from 'redux-saga/effects';

import { uploadWorklog } from '../worklogs';
import * as actions from '../../actions/worklogs';


test('uploadWorklog Saga test online mode', (t) => {
  const offlineMode = false;
  const worklog = {
    issueId: 'test-issue-id',
    timeSpentSeconds: 120,
    activity: [],
    comment: 'test comment',
  };

  const generator = uploadWorklog(worklog, offlineMode);

  // eslint-disable-next-line prefer-const
  let next = generator.next();
  t.deepEqual(next.value, put(actions.setWorklogUploadState(true)),
    'must yield actions.setWorklogUploadState(true)',
  );

  t.end();
});
