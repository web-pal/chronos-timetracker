// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import {
  Checkbox,
} from '@atlaskit/checkbox';

import {
  uiActions,
} from 'actions';
import {
  getUiState,
} from 'selectors';
import {
  CheckboxGroup,
} from 'styles';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import type {
  Dispatch,
} from 'types';

import {
  IssueCommentCheckboxWrapper,
} from './styled';

type Props = {
  postAlsoAsIssueComment: boolean,
  changePostOption: () => void,
};

const WorklogCommentOptions: StatelessFunctionalComponent<Props> = ({
  postAlsoAsIssueComment,
  changePostOption,
}: Props): Node =>
  <IssueCommentCheckboxWrapper>
    <CheckboxGroup>
      <Checkbox
        isChecked={postAlsoAsIssueComment}
        value={postAlsoAsIssueComment}
        name="postAlsoAsIssueComment"
        label="Post also as comment to issue"
        onChange={changePostOption}
      />
    </CheckboxGroup>
  </IssueCommentCheckboxWrapper>;

export default compose(
  connect(
    state => ({
      postAlsoAsIssueComment: getUiState('postAlsoAsIssueComment')(state),
    }),
    dispatch => ({ dispatch }),
  ),
  withHandlers({
    changePostOption: ({
      dispatch,
      postAlsoAsIssueComment,
    }: {
      postAlsoAsIssueComment: boolean,
      dispatch: Dispatch,
    }) => () => dispatch(uiActions.setUiState('postAlsoAsIssueComment', !postAlsoAsIssueComment))
  })
)(WorklogCommentOptions);
