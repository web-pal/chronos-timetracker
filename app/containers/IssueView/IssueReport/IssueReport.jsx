// @flow
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import Spinner from '@atlaskit/spinner';
import { Flex } from 'components';
import { getSelectedIssue, getSelfKey, getHost } from 'selectors';
import { openURLInBrowser } from 'external-open-util';

import type { Issue } from '../../../types';

import {
  ReportTabContainer,
  MainColumn,
  MetaColumn,
  CTAButton,
  CTAArea,
  Heading,
  HelpText,
  BorderLeft,
  ChronosDescriptionMetaItem,
  ChronosDescription,
  ChronosTimesheetsScreenshot,
  ClockMetaItem,
  Clock,
  AtlassianLogoMetaItem,
  AtlassianLogo,
  LearnMoreLink,
} from './styled';

import ProgressBar from './MainColumn/ProgressBar/ProgressBar';
import StatisticsRow from './MainColumn/StatisticsRow/StatisticsRow';

import StatisticsColumn from './MetaColumn/StatisticsColumn/StatisticsColumn';

import BackgroundShapes from './BackgroundShapes';

type Props = {
  selectedIssue: Issue,
  selfKey: string,
  host: URL,
};

const IssueReport: StatelessFunctionalComponent<Props> = ({
  selectedIssue,
  selfKey,
  host,
}: Props): Node => {
  const timespent = selectedIssue.fields.timespent || 0;
  const remaining = selectedIssue.fields.timeestimate || 0;
  const estimate = remaining - timespent < 0 ? 0 : remaining - timespent;

  const { worklogs } = selectedIssue.fields.worklog;

  const loggedTotal = worklogs.reduce((v, w) => v + w.timeSpentSeconds, 0);

  const yourWorklogs = worklogs.filter(w => w.author.key === selfKey);

  const youLoggedTotal = yourWorklogs.reduce((v, w) => v + w.timeSpentSeconds, 0);

  const yourWorklogsToday = yourWorklogs.filter(w => moment(w.updated).isSameOrAfter(moment().startOf('day')));

  const youLoggedToday = yourWorklogsToday.reduce((v, w) => v + w.timeSpentSeconds, 0);

  const isLoading = false;
  if (isLoading) {
    return (
      <Flex
        column
        alignCenter
        style={{
          flexGrow: 1,
          justifyContent: 'center',
          backgroundColor: '#0052CC',
          margin: '-20px -20px auto -20px',
        }}
      >
        <Spinner size="xlarge" invertColor />
      </Flex>
    );
  }

  return (
    <Flex column style={{ flexGrow: 1 }}>
      <BackgroundShapes />
      <ReportTabContainer>

        <MainColumn>
          <Flex column style={{ width: '100%' }}>
            <StatisticsRow
              estimate={estimate}
              remaining={remaining}
            />
            <ProgressBar
              loggedTotal={loggedTotal}
              remaining={remaining}
            />
          </Flex>

          <CTAArea>
            <Heading>
              View reports and calculate salaries in Chronos Timesheets
            </Heading>
            <CTAButton
              onClick={openURLInBrowser(`${host.origin}/plugins/servlet/ac/jira-chronos/api-page-jira`)}
            >
              Open plugin
            </CTAButton>
            <ChronosTimesheetsScreenshot />
          </CTAArea>

          <HelpText
            onClick={openURLInBrowser('https://marketplace.atlassian.com/plugins/jira-chronos/cloud/overview')}
          >
            View on Marketplace
          </HelpText>
        </MainColumn>

        <MetaColumn>
          <StatisticsColumn
            youLoggedToday={youLoggedToday}
            youLoggedTotal={youLoggedTotal}
            loggedTotal={loggedTotal}
          />

          {/* CLOCK */}
          <ClockMetaItem>
            <BorderLeft color="white" />
            <Clock />
            <div />
          </ClockMetaItem>

          {/* NEWSPAPER DESCRIPTION */}
          <ChronosDescriptionMetaItem>
            <BorderLeft color="white" />
            <ChronosDescription>
              <b>Chronos Timesheets</b> is our solution
              for viewing worklog report. Watch what
              your team is busy with, make printable
              invoices, calculate salaries, check what
              you’ve spent time on during last week.


              <br />
              <br />
              Rich filtering criterias, reports are available
              in Calendar and Timeline views.
              It’s really fast and responsive. Try it.

              <br />
              <br />
              <LearnMoreLink
                onClick={openURLInBrowser('https://marketplace.atlassian.com/plugins/jira-chronos/cloud/overview')}
              >Learn more →
              </LearnMoreLink>
            </ChronosDescription>
          </ChronosDescriptionMetaItem>

          {/* ATLASSIAN LOGO */}
          <AtlassianLogoMetaItem>
            <BorderLeft color="#FFAB00" />
            <AtlassianLogo />
            <div />
          </AtlassianLogoMetaItem>

        </MetaColumn>

      </ReportTabContainer>
    </Flex>
  );
};

function mapStateToProps(state) {
  return {
    selectedIssue: getSelectedIssue(state),
    selfKey: getSelfKey(state),
    host: getHost(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueReport);
