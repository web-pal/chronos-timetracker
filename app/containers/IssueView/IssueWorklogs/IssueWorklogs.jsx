// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex, AutosizableList as List } from 'components';
import { getSelectedIssue, getWorklogListScrollIndex } from 'selectors';
import { worklogsActions } from 'actions';
import { noIssuesImage } from 'data/assets';
import { H600 } from 'styles/typography';

import WorklogItem from './WorklogItem';

import type { Issue, DeleteWorklogRequest, EditWorklogRequest } from '../../../types';

type Props = {
  selectedIssue: Issue,
  scrollIndex: number,
  deleteWorklogRequest: DeleteWorklogRequest,
  editWorklogRequest: EditWorklogRequest,
};

const IssueWorklogs: StatelessFunctionalComponent<Props> = ({
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
              const worklog = selectedIssue.fields.worklog.worklogs[index];
              return <WorklogItem
                style={style}
                key={key}
                worklog={worklog}
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
        <Flex row centered>
          <Flex column centered alignCenter>
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
    selectedIssue: getSelectedIssue(state),
    scrollIndex: getWorklogListScrollIndex(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(worklogsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueWorklogs);
