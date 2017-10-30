// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex } from 'components';
import { getSelectedIssue } from 'selectors';

import WorklogItem from './WorklogItem';

import type { Issue } from '../../../types';

type Props = {
  selectedIssue: Issue,
};

const IssueWorklogs: StatelessFunctionalComponent<Props> = ({
  selectedIssue,
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
        <WorklogItem worklog={worklog} issueKey={selectedIssue.key} />,
      )}
    </Flex>
  </Flex>
);

function mapStateToProps(state) {
  return {
    selectedIssue: getSelectedIssue(state),
  };
}

export default connect(mapStateToProps, () => ({}))(IssueWorklogs);
