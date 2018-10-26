// @flow
import React from 'react';

import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  IssuesReports,
} from 'types';

import {
  Flex,
} from 'components';
import {
  getSelectedIssueReport,
  getUiState,
} from 'selectors';
import {
  openURLInBrowser,
} from 'utils/external-open-util';

import ProgressBar from './MainColumn/ProgressBar/ProgressBar';
import StatisticsRow from './MainColumn/StatisticsRow/StatisticsRow';
import StatisticsColumn from './MetaColumn/StatisticsColumn/StatisticsColumn';

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
  BackgroundShape,
} from './styled';


type Props = {
  host: string,
  report: IssuesReports,
};

const IssueReport: StatelessFunctionalComponent<Props> = ({
  host,
  report,
}: Props): Node =>
  <Flex column style={{ flexGrow: 1 }}>
    <div>
      <BackgroundShape number={1} color="#0962E8" opacity="1" />
      <BackgroundShape number={2} color="#0962E8" opacity="0.5" />
      <BackgroundShape number={3} color="#0962E8" opacity="0.25" />
      <BackgroundShape number={4} color="#0962E8" opacity="0.15" />
    </div>
    <ReportTabContainer>

      <MainColumn>
        <Flex column style={{ width: '100%' }}>
          <StatisticsRow
            estimate={report.estimate}
            remaining={report.remaining}
          />
          <ProgressBar
            loggedTotal={report.loggedTotal}
            remaining={report.remaining}
          />
        </Flex>

        <CTAArea>
          <Heading>
            View reports and calculate salaries in Chronos Timesheets
          </Heading>
          <CTAButton
            onClick={openURLInBrowser(`http://${host}/plugins/servlet/ac/jira-chronos/api-page-jira`)}
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
          youLoggedToday={report.youLoggedToday}
          youLoggedTotal={report.youLoggedTotal}
          loggedTotal={report.loggedTotal}
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
  </Flex>;

function mapStateToProps(state) {
  return {
    report: getSelectedIssueReport(state),
    host: getUiState('host')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(IssueReport);
