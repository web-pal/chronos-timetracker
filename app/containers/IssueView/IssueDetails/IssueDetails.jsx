// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSelectedIssue } from 'selectors';
import { Flex } from 'components';

import IssueAttachments from './IssueAttachments';
import type { Issue } from '../../../types';
import {
  IssueDetailsContainer,
  DetailsLabel,
  DetailsValue,
  IssuePriority,
  IssueType,
  IssueLabel,
  Label,
} from './styled';

type Props = {
  issue: Issue,
}

const IssueDetails: StatelessFunctionalComponent<Props> = ({
  issue,
}: Props): Node => {
  const versions = issue.fields.versions;
  const fixVersions = issue.fields.fixVersions;
  const components = issue.fields.components;
  const labels = issue.fields.labels;
  const resolution = issue.fields.resolution;
  return (
    <IssueDetailsContainer>
      <Flex row spaceBetween>
        <Flex column style={{ width: '42%' }}>

          <Flex row spaceBetween>
            <DetailsLabel>
              Type:
            </DetailsLabel>
            <DetailsValue>
              <IssueType
                src={issue.fields.issuetype.iconUrl}
                alt={issue.fields.issuetype.name}
              />
              {issue.fields.issuetype.name}
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Priority:
            </DetailsLabel>
            <DetailsValue>
              <IssuePriority
                src={issue.fields.priority.iconUrl}
                alt={issue.fields.priority.name}
              />
              {issue.fields.priority.name}
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Affects Version/s:
            </DetailsLabel>
            <DetailsValue>
              {versions.length === 0 && 'None'}
              {versions.map(v => <a key={v.id}>{v.name}</a>)}
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Component/s:
            </DetailsLabel>
            <DetailsValue>
              {components.length === 0 && 'None'}
              {components.map(v => <a key={v.id}>{v.name}</a>)}
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Labels/s:
            </DetailsLabel>
            {labels.length === 0 &&
              <DetailsValue>
                None
              </DetailsValue>
            }
            {labels.map(v => <Label key={v}>{v}</Label>)}
          </Flex>

        </Flex>
        <Flex column style={{ width: '42%' }}>

          <Flex row spaceBetween>
            <DetailsLabel>
              Status:
            </DetailsLabel>
            <DetailsValue>
              <IssueLabel>
                {issue.fields.status.name.toUpperCase()}
              </IssueLabel>
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Resolution:
            </DetailsLabel>
            <DetailsValue>
              {resolution === null
                ? 'Unresolved'
                : resolution.name
              }
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Fix Version/s:
            </DetailsLabel>
            <DetailsValue>
              {fixVersions.length === 0 && 'None'}
              {fixVersions.map(v => <a key={v.id}>{v.name}</a>)}
            </DetailsValue>
          </Flex>

        </Flex>
      </Flex>

      <div
        style={{
          borderTop: '2px solid rgba(0, 0, 0, .1)',
          fontWeight: 600,
          marginTop: 10,
          paddingTop: 10,
        }}
      >
        Description
      </div>

      <ul style={{ paddingLeft: 20 }}>
        <li style={{ marginBottom: 5 }}>
          {'add a channel to channels list called Homeaway API (with some API-ish logo beside homeaway log), and change the current homeaway channel to homeaway ical'}
        </li>
        <li style={{ marginBottom: 5 }}>
          {"I added status of homeaway api to /accounts/info... Remember, it's different fromr homeaway ical.."}
        </li>
        <li style={{ marginBottom: 5 }}>
          {"if it's false, we will show users how they can request to activate it, but if it's true, we will show users which listings are active in listingmap matrix and in a configure button. currently users can't change anything in configure button, they only can see which listings are active (using field homeawayApiActive of each listingMap)"}
        </li>
      </ul>
      <IssueAttachments />
    </IssueDetailsContainer>
  );
};

function mapStateToProps(state) {
  return {
    issue: getSelectedIssue(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueDetails);
