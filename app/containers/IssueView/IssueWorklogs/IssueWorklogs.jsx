// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex } from 'components';
import { getSelectedIssue } from 'selectors';
import { worklogsActions } from 'actions';

import WorklogItem from './WorklogItem';

import type { Issue, DeleteWorklogRequest } from '../../../types';

type Props = {
  selectedIssue: Issue,
  deleteWorklogRequest: DeleteWorklogRequest,
};

const IssueWorklogs: StatelessFunctionalComponent<Props> = ({
  selectedIssue,
  deleteWorklogRequest,
}: Props): Node => (
  <Flex column>
    <Flex row alignCenter spaceBetween style={{ marginBottom: 25 }}>
      <Flex row style={{ paddingBottom: 5 }}>
        <span style={{ color: 'rgb(112,112,112)', marginRight: 5 }}>Logged today: </span>
        <span style={{ fontWeight: 500, color: '#0052cc' }}>2h 32min</span>
      </Flex>
    </Flex>
    <Flex column style={{ overflowX: 'scroll' }}>
      {selectedIssue.fields.worklog.worklogs.map(worklog =>
        <WorklogItem
          worklog={worklog}
          issueKey={selectedIssue.key}
          deleteWorklogRequest={deleteWorklogRequest}
        />,
      )}
    </Flex>
  </Flex>
);

function mapStateToProps(state) {
  return {
    selectedIssue: getSelectedIssue(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(worklogsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueWorklogs);
