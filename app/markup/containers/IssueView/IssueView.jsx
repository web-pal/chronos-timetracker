import React, { Component } from 'react';
import styled from 'styled-components';

import Flex from '../../../components/Base/Flex/Flex';

import Comments from './Comments/Comments';
// import Attachments from './Attachments/Attachments';
import Details from './Details/Details';
// import Description from './Description/Description';
import Worklogs from './Worklogs/Worklogs';
import Statistics from './Statistics/Statistics';

import IssueHeader from './IssueHeader/IssueHeader';
import Tabs from './Tabs/Tabs';

import TrackingBar from '../../components/TrackingBar/TrackingBar';
import TrackingView from '../TrackingView/TrackingView';

const tabs = [
  { label: 'Details', content: <Details /> },
  // { label: 'Description', content: <Description /> },
  // { label: 'Attachments', content: <Attachments /> },
  { label: 'Comments', content: <Comments /> },
  { label: 'Worklogs', content: <Worklogs /> },
  { label: 'Report', content: <Statistics /> },
];

const IssueViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 500px;
  width: 100%
`;

class IssueView extends Component {
  state = { activeTab: 'Worklogs' }

  onChangeTab = (newTab) => this.setState({ activeTab: newTab });

  render() {
    const isTracking = false;
    const isTrackingView = false;
    // eslint-disable-next-line
    const { style } = this.props;
    const { activeTab } = this.state;

    return (
      <IssueViewContainer style={style || {}}>
        {isTrackingView &&
          <TrackingView />
        }
        {isTracking &&
          <TrackingBar />
        }
        <IssueHeader isTracking={isTracking} />
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChangeTab={this.onChangeTab}
        />
        <Flex column style={{ padding: '20px 20px 0px 20px', overflowY: 'auto' }}>
          {tabs.find(i => i.label === activeTab).content}
        </Flex>
      </IssueViewContainer>
    );
  }
}

export default IssueView;
