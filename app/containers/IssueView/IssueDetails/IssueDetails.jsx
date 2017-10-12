// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSelectedIssue } from 'selectors';
import { Flex } from 'components';
import ReactMarkdown from 'react-markdown';

// import IssueAttachments from './IssueAttachments';
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
          marginTop: 10,
          paddingTop: 10,
        }}
      >
        <strong>
          Description
        </strong>
        <ReactMarkdown source={issue.fields.description || '*no description*'} />
      </div>
      {
        /* TODO <IssueAttachments /> */
      }
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
