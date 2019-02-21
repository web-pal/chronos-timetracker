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

import * as S from './styled';


type Props = {
  hostname: string,
  report: IssuesReports,
};

const IssueReport: StatelessFunctionalComponent<Props> = ({
  hostname,
  report,
}: Props): Node => (
  <Flex column style={{ flexGrow: 1 }}>
    <div>
      <S.BackgroundShape number={1} color="#0962E8" opacity="1" />
      <S.BackgroundShape number={2} color="#0962E8" opacity="0.5" />
      <S.BackgroundShape number={3} color="#0962E8" opacity="0.25" />
      <S.BackgroundShape number={4} color="#0962E8" opacity="0.15" />
    </div>
    <S.ReportTab>

      <S.MainColumn>
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

        <S.CTAArea>
          <S.Heading>
            View reports and calculate salaries in Chronos Timesheets
          </S.Heading>
          <S.CTAButton
            onClick={openURLInBrowser(`http://${hostname}/plugins/servlet/ac/jira-chronos/api-page-jira`)}
          >
            Open plugin
          </S.CTAButton>
          <S.ChronosTimesheetsScreenshot />
        </S.CTAArea>

        <S.HelpText
          onClick={openURLInBrowser('https://marketplace.atlassian.com/plugins/jira-chronos/cloud/overview')}
        >
          View on Marketplace
        </S.HelpText>
      </S.MainColumn>

      <S.MetaColumn>
        <StatisticsColumn
          youLoggedToday={report.youLoggedToday}
          youLoggedTotal={report.youLoggedTotal}
          loggedTotal={report.loggedTotal}
        />

        {/* CLOCK */}
        <S.ClockMetaItem>
          <S.BorderLeft color="white" />
          <S.Clock />
          <div />
        </S.ClockMetaItem>

        {/* NEWSPAPER DESCRIPTION */}
        <S.ChronosDescriptionMetaItem>
          <S.BorderLeft color="white" />
          <S.ChronosDescription>
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
            <S.LearnMoreLink
              onClick={openURLInBrowser('https://marketplace.atlassian.com/plugins/jira-chronos/cloud/overview')}
            >Learn more →
            </S.LearnMoreLink>
          </S.ChronosDescription>
        </S.ChronosDescriptionMetaItem>

        {/* ATLASSIAN LOGO */}
        <S.AtlassianLogoMetaItem>
          <S.BorderLeft color="#FFAB00" />
          <S.AtlassianLogo />
          <div />
        </S.AtlassianLogoMetaItem>

      </S.MetaColumn>

    </S.ReportTab>
  </Flex>
);

function mapStateToProps(state) {
  return {
    report: getSelectedIssueReport(state),
    hostname: getUiState('hostname')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(IssueReport);
