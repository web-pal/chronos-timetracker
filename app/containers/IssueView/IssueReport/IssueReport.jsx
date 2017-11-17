// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex, AutoSizeableList as List } from 'components';
import { getSelectedIssue, getWorklogListScrollIndex } from 'selectors';
import { worklogsActions } from 'actions';
import { noIssuesImage } from 'data/assets';
import { H600 } from 'styles/typography';

import type { Issue, DeleteWorklogRequest, EditWorklogRequest } from '../../../types';

type Props = {
  selectedIssue: Issue,
  scrollIndex: number,
  deleteWorklogRequest: DeleteWorklogRequest,
  editWorklogRequest: EditWorklogRequest,
};

const IssueReport: StatelessFunctionalComponent<Props> = ({
  selectedIssue,
  scrollIndex,
  deleteWorklogRequest,
  editWorklogRequest,
}: Props): Node => (
  <Flex column style={{ flexGrow: 1 }}>
    kek
  </Flex>
);

function mapStateToProps(state) {
  return {
    selectedIssue: getSelectedIssue(state),
    scrollIndex: getWorklogListScrollIndex(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(worklogsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueReport);
