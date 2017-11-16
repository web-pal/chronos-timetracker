// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import Spinner from '@atlaskit/spinner';
import { Flex } from 'components';
import { getSelectedIssue } from 'selectors';
import { shell } from 'electron';

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
};

const IssueReport: StatelessFunctionalComponent<Props> = ({
  selectedIssue,
}: Props): Node => {
  const estimate = selectedIssue.fields.timeestimate;
  const logged = selectedIssue.fields.timespent;
  const remaining = estimate - logged < 0 ? 0 : estimate - logged;

  const youLogged = '2h 16min';
  const youLoggedTotal = '3h 33min';

  // Percent values for progress bar
  const youLoggedPercent = 36;
  const youLoggedTotalPercent = 54;
  const loggedTotalPercent = 76;

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
              remaining={estimate}
            />
            <ProgressBar
              youLoggedPercent={youLoggedPercent}
              youLoggedTotalPercent={youLoggedTotalPercent}
              loggedTotalPercent={loggedTotalPercent}
              remaining={remaining}
            />
          </Flex>

          <CTAArea>
            <Heading>
              View reports and calculate salaries in Chronos Timesheets
            </Heading>
            <CTAButton
              onClick={() => { /* TODO */ }}
            >
              Open plugin
            </CTAButton>
            <ChronosTimesheetsScreenshot />
          </CTAArea>

          <HelpText
            onClick={() =>
              shell.openExternal('https://marketplace.atlassian.com/plugins/jira-chronos/cloud/overview')
            }
          >
            View on Marketplace
          </HelpText>
        </MainColumn>

        <MetaColumn>
          <StatisticsColumn
            youLogged={youLogged}
            youLoggedTotal={youLoggedTotal}
            loggedTotal={logged}
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
                onClick={() =>
                  shell.openExternal('https://marketplace.atlassian.com/plugins/jira-chronos/cloud/overview')
                }
              >Learn more →</LearnMoreLink>
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueReport);
