// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSelectedIssue, getIssueEpic } from 'selectors';
import { Flex } from 'components';
import { getStatusColor, getEpicColor } from 'jiraColors-util';
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
  DetailsColumn,
  DescriptionSectionHeader,
} from './styled';

type Props = {
  issue: Issue,
  epic: Issue,
}

const IssueDetails: StatelessFunctionalComponent<Props> = ({ issue, epic }: Props): Node => {
  const {
    versions,
    fixVersions,
    components,
    labels,
    resolution,
  } = issue.fields;
  return (
    <IssueDetailsContainer>
      <Flex row spaceBetween>
        <DetailsColumn>

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
              {versions.map(v => <a href="#version" key={v.id}>{v.name}</a>)}
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Component/s:
            </DetailsLabel>
            <DetailsValue>
              {components.length === 0 && 'None'}
              {components.map(v => <a href="#component" key={v.id}>{v.name}</a>)}
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

        </DetailsColumn>
        <DetailsColumn>

          <Flex row spaceBetween>
            <DetailsLabel>
              Status:
            </DetailsLabel>
            <DetailsValue style={{ maxWidth: 'calc(100% - 50px)' }}>
              <IssueLabel
                backgroundColor={getStatusColor(issue.fields.status.statusCategory.colorName)}
              >
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
              {fixVersions.map(v => <a href="#version" key={v.id}>{v.name}</a>)}
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Epic link:
            </DetailsLabel>
            <DetailsValue>
              {epic ?
                <IssueLabel
                  backgroundColor={getEpicColor(epic.fields.epicColor)}
                >
                  {epic.fields.epicName}
                </IssueLabel> :
                'none'
              }
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Reporter:
            </DetailsLabel>
            <DetailsValue>
              {issue.fields.reporter.displayName}
            </DetailsValue>
          </Flex>

        </DetailsColumn>
      </Flex>

      <DescriptionSectionHeader>
        <strong>
          Description
        </strong>
        {issue.renderedFields
          ?  <div
            dangerouslySetInnerHTML={{
              __html: issue.renderedFields.description,
            }}
          />
          : <ReactMarkdown source={issue.fields.description || '*No description*'} />
        }
      </DescriptionSectionHeader>
      {
        /* TODO <IssueAttachments /> */
      }
    </IssueDetailsContainer>
  );
};

function mapStateToProps(state) {
  return {
    issue: getSelectedIssue(state),
    epic: getIssueEpic(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueDetails);
