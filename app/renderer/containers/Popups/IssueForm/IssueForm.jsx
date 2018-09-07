import React, { Component } from 'react';
import {
  ipcRenderer,
} from 'electron';
import {
  getPreload,
} from 'utils/preload';

import Spinner from '@atlaskit/spinner';
import {
  AppWrapper,
  FullPageSpinner,
} from 'styles';
import config from 'config';


class IssueForm extends Component<{}, any> {
  constructor(props: {}) {
    super(props);
    this.state = {
      show: true,
    };
  }

  componentDidMount() {
    ipcRenderer.on('url', this.onLoadUrl);
    ipcRenderer.on('showForm', this.onShowForm);
    ipcRenderer.on('page-fully-loaded', () => {
      setTimeout(() => {
        this.setState({
          show: false,
        });
        document.getElementById('root').style.display = 'none';
      }, 500);
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('url', this.onLoadUrl);
    ipcRenderer.removeListener('showForm', this.onShowForm);
  }

  onLoadUrl = (ev, url) => {
    let webview = document.querySelector('webview');
    if (!webview) {
      webview = document.createElement('webview');
      webview.setAttribute('preload', getPreload('issueFormPreload'));
      webview.style.height = '100%';

      webview.addEventListener('did-finish-load', () => {
        if (
          config.issueWindowDevTools ||
          process.env.DEBUG_PROD === true
        ) {
          webview.openDevTools();
        }
      });

      webview.src = url;
      document.getElementById('forWebview').appendChild(webview);
    } else {
      webview.src = url;
    }
  }

  onShowForm = (
    ev,
    {
      projectId,
      issueId,
    },
  ) => {
    const webview = document.querySelector('webview');
    if (webview.isLoading()) {
      return setTimeout(() => {
        this.onShowForm(ev, {
          projectId,
          issueId,
        });
      }, 1000);
    }
    document.getElementById('root').style.display = 'block';
    this.setState({
      show: true,
    });
    return webview.executeJavaScript(`
      document.getElementById('page').style.display = 'none';
      var issueForm = JIRA.Forms
        ${issueId ?
      `.createEditIssueForm({ issueId: ${issueId} })` :
      `.createCreateIssueForm({ pid: ${projectId} })`
        }
        .bind('sessionComplete', function(ev, issues) {
          ${issueId ?
          `ipcRenderer.send("issue-refetch", "${issueId}");` :
          'ipcRenderer.send("issue-created", issues);'
          }
          ipcRenderer.send('close-issue-window');
        })
        .bind('contentRefreshed', function() {
          try {
            setTimeout(function() {
              var formBody = issueForm.$form.children()[0];
              var jiraDialog = issueForm.$popup[0];
              formBody.style.maxHeight = (parseInt(formBody.style.maxHeight.replace('px', ''), 10) + 120).toString() + 'px';
              jiraDialog.style.marginTop = (parseInt(jiraDialog.style.marginTop.replace('px', ''), 10) - 65).toString() + 'px';
            }, 200);
          } catch(err) {
            console.log(err);
          }
        })
        .asDialog({
          windowTitle: ${issueId ? '"Edit issue"' : '"Create Issue"'}
        });
      issueForm.bind('Dialog.show', function() {
        issueForm.bind('Dialog.hide', function() {
          ipcRenderer.send('close-issue-window');
        });
      });
      issueForm.show();
      var timerId = setInterval(function() {
        if (issueForm.$buttonContainer) {
          clearInterval(timerId);
          try {
            var forRemove = document.getElementsByClassName('aui-blanket');
            forRemove[0].remove();
          } catch(err) {
            console.log(err);
          }
          ipcRenderer.send('page-fully-loaded');
        }
      }, 500);
    `);
  }

  render() {
    if (this.state.show) {
      return (
        <AppWrapper id="app">
          <FullPageSpinner>
            <Spinner size="xlarge" />
          </FullPageSpinner>
        </AppWrapper>
      );
    }
    return null;
  }
}

export default IssueForm;
