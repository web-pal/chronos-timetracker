// @flow
import {
  call,
  select,
  put,
  takeEvery,
  fork,
} from 'redux-saga/effects';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';
import createActionCreators from 'redux-resource-action-creators';

import * as Api from 'api';

import type {
  Id,
} from 'types';

import {
  uiActions,
  actionTypes,
} from 'actions';

import {
  throwError,
  infoLog,
  notify,
} from './ui';


export function* getIssueComments(issueId: Id): Generator<*, void, *> {
  const actions = createActionCreators('read', {
    resourceType: 'issuesComments',
    request: `issue_${issueId}`,
    list: `issue_${issueId}`,
    mergeListIds: false,
  });
  try {
    const alreadyFetched =
      yield select(
        state =>
          getResourceStatus(
            state,
            `issuesComments.requests.issue_${issueId}.status`,
          ).succeeded,
      );
    if (!alreadyFetched) {
      yield put(actions.pending());
    }
    yield call(infoLog, `fetching comments for issue ${issueId}`);
    const { comments } = yield call(Api.fetchIssueComments, issueId);
    yield put(actions.succeeded({
      resources: comments,
    }));
    yield call(infoLog, `got comments for issue ${issueId}`, comments);
  } catch (err) {
    yield call(throwError, err);
  }
}

export function* addIssueComment({
  text,
  issueId,
}: {
  text: string,
  issueId: Id,
}): Generator<*, void, *> {
  const actions = createActionCreators('create', {
    resourceType: 'issuesComments',
    request: 'newComment',
    list: `issue_${issueId}`,
  });
  try {
    yield call(infoLog, 'adding comment', text, issueId);
    yield put(uiActions.setUiState('commentAdding', true));
    const opts = {
      issueId,
      comment: {
        body: text,
      },
    };
    const newComment = yield call(Api.addComment, opts);
    yield call(infoLog, 'comment added', newComment);
    yield put(actions.succeeded({
      resources: [newComment],
    }));
    yield put(uiActions.setUiState('commentAdding', false));
  } catch (err) {
    yield put(uiActions.setUiState('commentAdding', false));
    yield fork(notify, {
      title: 'failed to add comment',
    });
    yield call(throwError, err);
  }
}

export function* watchIssueCommentRequest(): Generator<*, *, *> {
  yield takeEvery(actionTypes.COMMENT_REQUEST, addIssueComment);
}
