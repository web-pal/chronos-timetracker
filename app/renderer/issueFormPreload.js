/* eslint-disable no-param-reassign */
import * as eff from 'redux-saga/effects';
import * as Sentry from '@sentry/electron';
import {
  actionTypes,
  issuesActions,
} from 'actions';

import configureStore from './store/configurePreloadStore';
import pjson from '../package.json';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enableNative: false,
    release: `${pjson.version}_${process.platform}`,
  });
}
window.CHRONOS_ISSUE_WINDOW = true;

const store = configureStore();

document.addEventListener('DOMContentLoaded', () => {
  const page = document.getElementById('page');
  if (page) {
    page.style.display = 'none';
  }
});

function* takeShowForm(): Generator<*, *, *> {
  while (true) {
    const {
      issueId,
      projectId,
    } = yield eff.take(actionTypes.SHOW_ISSUE_FORM_WINDOW);
    const issueForm = (
      issueId
        ? (
          window.JIRA.Forms.createEditIssueForm({ issueId })
        ) : (
          window.JIRA.Forms.createCreateIssueForm({ pid: projectId })
        )
    )
      .bind(
        'sessionComplete',
        (ev, issues) => {
          if (issueId) {
            store.dispatch(issuesActions.fetchUpdateIssueRequest({
              issueIdOrKey: issueId,
            }));
          } else {
            issues.forEach(({ issueKey }) => {
              store.dispatch(issuesActions.fetchNewIssueRequest({
                issueIdOrKey: issueKey,
              }));
            });
          }
          store.dispatch(issuesActions.closeIssueFormWindow());
        },
      )
      .bind(
        'contentRefreshed',
        () => {
          try {
            setTimeout(() => {
              document.getElementsByClassName('jira-dialog')[0].style.display = 'none';
              const formBody = issueForm.$form.children()[0];
              const jiraDialog = issueForm.$popup[0];
              formBody.style.maxHeight = (
                `${(parseInt(formBody.style.maxHeight.replace('px', ''), 10) + 120).toString()}px`
              );
              jiraDialog.style.marginTop = (
                `${(parseInt(jiraDialog.style.marginTop.replace('px', ''), 10) - 65).toString()}px`
              );
              issueForm.$popupHeading[0].lastElementChild.style.display = 'none';
            }, 0);
            setTimeout(() => {
              document.getElementsByClassName('jira-dialog')[0].style.display = 'block';
            }, 500);
          } catch (err) {
            console.log(err);
          }
        },
      )
      .asDialog({
        windowTitle: (
          issueId
            ? '"Edit issue"'
            : '"Create Issue"'
        ),
      });

    issueForm.bind('Dialog.show', () => {
      document.getElementsByClassName('jira-dialog')[0].style.display = 'none';
      issueForm.bind('Dialog.hide', () => {
        setTimeout(() => {
          store.dispatch(issuesActions.closeIssueFormWindow());
        }, 500);
      });
    });
    issueForm.show();
  }
}

function* rootSaga(): Generator<*, void, *> {
  yield eff.all([
    eff.fork(takeShowForm),
  ]);
}
/* run saga */
store.runSaga(rootSaga);
