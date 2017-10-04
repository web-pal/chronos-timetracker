// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Flex } from 'components';
import { getIssueViewTab } from 'selectors';
import { uiActions } from 'actions';

import type { SetIssueViewTab, TabLabel } from '../../types';
import type { Tab } from './IssueView';
import { TabItem } from './styled';

type Props = {
  tabs: { [TabLabel]: Tab },
  activeTab: TabLabel,
  setIssueViewTab: SetIssueViewTab,
}

const IssueViewTabs: StatelessFunctionalComponent<Props> = ({
  tabs,
  activeTab,
  setIssueViewTab,
}: Props): Node => (
  <Flex column style={{ minHeight: 32 }}>
    <Flex row spaceBetween style={{ minHeight: 32 }}>
      {
        // $FlowFixMe: Object.keys() bugged in flow
        Object.keys(tabs).map((key: TabLabel): Node => {
          const label: TabLabel = tabs[key].label;
          return (
            <TabItem
              key={label}
              active={label === activeTab}
              onClick={() => setIssueViewTab(label)}
            >
              {label}
            </TabItem>
          );
        })
      }
    </Flex>
  </Flex>
);

function mapStateToProps(state) {
  return {
    activeTab: getIssueViewTab(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueViewTabs);
