// @flow
import * as eff from 'redux-saga/effects';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';
import createActionCreators from 'redux-resource-action-creators';

import {
  jiraApi,
} from 'api';

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
    const alreadyFetched = (
      yield eff.select(
        state => (
          getResourceStatus(
            state,
            `issuesComments.requests.issue_${issueId}.status`,
          ).succeeded
        ),
      )
    );
    if (!alreadyFetched) {
      yield eff.put(actions.pending());
    }
    yield eff.call(infoLog, `fetching comments for issue ${issueId}`);
    const { comments } = yield eff.call(
      jiraApi.getIssueComments,
      {
        params: {
          issueIdOrKey: issueId,
        },
      },
    );
    yield eff.put(actions.succeeded({
      resources: comments,
    }));
    yield eff.call(infoLog, `got comments for issue ${issueId}`, comments);
  } catch (err) {
    yield eff.call(throwError, err);
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
    yield eff.call(infoLog, 'adding comment', text, issueId);
    yield put(uiActions.setUiState('commentAdding', true));
    const newComment = yield eff.call(
      jiraApi.addIssueComment,
      {
        params: {
          issueIdOrKey: issueId,
        },
        body: {
          body: text,
        },
      },
    );
    yield eff.call(infoLog, 'comment added', newComment);
    yield eff.put(actions.succeeded({
      resources: [newComment],
    }));
    yield eff.put(uiActions.setUiState('commentAdding', false));
  } catch (err) {
    yield eff.put(uiActions.setUiState('commentAdding', false));
    yield eff.fork(notify, {
      title: 'failed to add comment',
    });
    yield eff.call(throwError, err);
  }
}

export function* watchIssueCommentRequest(): Generator<*, *, *> {
  yield eff.takeEvery(actionTypes.COMMENT_REQUEST, addIssueComment);
}
