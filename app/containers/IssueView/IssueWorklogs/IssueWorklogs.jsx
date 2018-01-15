// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex, AutosizableList as List } from 'components';
import { worklogsActions } from 'actions';
import { noIssuesImage } from 'data/assets';
import { H600 } from 'styles/typography';
import {
  getSelectedIssue,
  getWorklogListScrollIndex,
  getSelectedWorklogId,
} from 'selectors';

import WorklogItem from './WorklogItem';

import type { Id, Issue, DeleteWorklogRequest, EditWorklogRequest } from '../../../types';

type Props = {
  selectedWorklogId: Id | null,
  selectedIssue: Issue,
  scrollIndex: number,
  deleteWorklogRequest: DeleteWorklogRequest,
  editWorklogRequest: EditWorklogRequest,
};

const IssueWorklogs: StatelessFunctionalComponent<Props> = ({
  selectedWorklogId,
  selectedIssue,
  scrollIndex,
  deleteWorklogRequest,
  editWorklogRequest,
}: Props): Node => (
  <Flex column style={{ flexGrow: 1 }}>
    <Flex column style={{ flexGrow: 1 }}>
      {selectedIssue.fields.worklog.worklogs &&
        <List
          listProps={{
            rowCount: selectedIssue.fields.worklog.worklogs.length,
            rowHeight: 120,
            rowRenderer: ({ index, key, style }: { index: number, key: string, style: any }) => {
              const worklog = selectedIssue.fields.worklog.worklogs.sort(
                (left, right) => left.id < right.id,
              )[index];

              return <WorklogItem
                style={style}
                key={key}
                worklog={worklog}
                selected={selectedWorklogId === worklog.id}
                issueKey={selectedIssue.key}
                deleteWorklogRequest={deleteWorklogRequest}
                editWorklogRequest={editWorklogRequest}
              />;
            },
            scrollToIndex: scrollIndex,
          }}
          autoSized
        />
      }
      {selectedIssue.fields.worklog.worklogs.length === 0 &&
        <Flex row justifyCenter>
          <Flex column alignCenter justifyCenter>
            <img src={noIssuesImage} alt="not found" width="100px" />
            <H600>
              No work logged for this issue
            </H600>
          </Flex>
        </Flex>
      }
    </Flex>
  </Flex>
);

function mapStateToProps(state) {
  return {
    selectedWorklogId: getSelectedWorklogId(state),
    selectedIssue: getSelectedIssue(state),
    scrollIndex: getWorklogListScrollIndex(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(worklogsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueWorklogs);
