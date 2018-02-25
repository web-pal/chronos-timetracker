// @flow
import React from 'react';
import {
  render,
} from 'react-dom';

import IssueForm from './containers/Popups/IssueForm/IssueForm';

render(
  <IssueForm />,
  document.getElementById('root') || document.createElement('div'),
);
