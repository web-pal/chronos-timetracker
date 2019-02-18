// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  shell,
} from 'electron';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Issue,
} from 'types';

import {
  getSelectedIssue,
  getSelectedIssueEpic,
} from 'selectors';
import {
  issuesActions,
} from 'actions';
import {
  Flex,
} from 'components';
import {
  getStatusColor,
  getEpicColor,
} from 'utils/jiraColors-util';

import DescriptionSectionAttachment from 'components/DescriptionSectionAttachment';
import DataRenderer from '../DataRenderer';

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
  dispatch: any,
  epic: Issue & {
    color: string,
    name: string,
  },
};

const IssueDetails: StatelessFunctionalComponent<Props> = ({
  issue,
  epic,
  dispatch,
}: Props): Node => {
  const {
    versions,
    fixVersions,
    issuetype,
    priority,
    components,
    status,
    labels,
    reporter,
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
              {issuetype
                ? (
                  <div>
                    <IssueType
                      src={issuetype.iconUrl}
                      alt={issuetype.name}
                    />
                    {issuetype.name}
                  </div>
                )
                : 'None'
              }
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Priority:
            </DetailsLabel>
            <DetailsValue>
              {priority
                ? (
                  <div>
                    <IssuePriority
                      src={priority.iconUrl}
                      alt={priority.name}
                    />
                    {priority.name}
                  </div>
                )
                : 'None'
              }
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Affects Version/s:
            </DetailsLabel>
            <DetailsValue>
              {versions
                ? (
                  <div>
                    {versions.length === 0 && 'None'}
                    {versions.map(v => <a href="#version" key={v.id}>{v.name}</a>)}
                  </div>
                )
                : 'None'
              }
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Component/s:
            </DetailsLabel>
            <DetailsValue>
              {components
                ? (
                  <div>
                    {components.length === 0 && 'None'}
                    {components.map(v => <a href="#component" key={v.id}>{v.name}</a>)}
                  </div>
                )
                : 'None'
              }
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Labels/s:
            </DetailsLabel>
            {labels
              ? (
                <div>
                  {labels.length === 0
                  && (
                  <DetailsValue>
                    None
                  </DetailsValue>
                  )
                }
                  {labels.map(v => <Label key={v}>{v}</Label>)}
                </div>
              )
              : 'None'
            }
          </Flex>

        </DetailsColumn>
        <DetailsColumn>

          <Flex row spaceBetween>
            <DetailsLabel>
              Status:
            </DetailsLabel>
            {status
              ? (
                <DetailsValue style={{ maxWidth: 'calc(100% - 50px)' }}>
                  <IssueLabel
                    backgroundColor={getStatusColor(status.statusCategory.colorName)}
                  >
                    {status.name.toUpperCase()}
                  </IssueLabel>
                </DetailsValue>
              )
              : 'None'
            }
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Resolution:
            </DetailsLabel>
            {resolution
              ? (
                <div>
                  <DetailsValue>
                    {resolution === null
                      ? 'Unresolved'
                      : resolution.name
                  }
                  </DetailsValue>
                </div>
              )
              : 'None'
            }
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Fix Version/s:
            </DetailsLabel>
            {fixVersions
              ? (
                <div>
                  <DetailsValue>
                    {fixVersions.length === 0 && 'None'}
                    {fixVersions.map(v => <a href="#version" key={v.id}>{v.name}</a>)}
                  </DetailsValue>
                </div>
              )
              : 'None'
            }
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Epic link:
            </DetailsLabel>
            <DetailsValue>
              {epic
                ? (
                  <IssueLabel
                    backgroundColor={getEpicColor(epic.color)}
                  >
                    {epic.name}
                  </IssueLabel>
                )
                : 'None'
              }
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Reporter:
            </DetailsLabel>
            <DetailsValue>
              {reporter
                ? reporter.displayName
                : 'None'
              }
            </DetailsValue>
          </Flex>

        </DetailsColumn>
      </Flex>

      <DescriptionSectionHeader>
        <strong>
          Description
        </strong>
        <DataRenderer
          html={issue.renderedFields ? issue.renderedFields.description : null}
          source={issue.fields.description || '*No description*'}
          onAttachmentClick={(e) => {
            const tag = e.target ? e.target.tagName.toLowerCase() : null;
            if (tag && (tag === 'img' || tag === 'a')) {
              e.preventDefault();
              if (tag === 'img') {
                const imgName = e.target.getAttribute('data-attachment-name');
                const attachments = issue.fields.attachment;
                const activeIndex = attachments.findIndex(item => item.filename === imgName);
                dispatch(issuesActions.showAttachmentWindow(
                  {
                    issueId: issue.id,
                    activeIndex,
                  },
                ));
              } else {
                // external links only
                const url = e.target.getAttribute(tag === 'a' ? 'href' : 'src');
                if (url && url.includes('http')) {
                  shell.openExternal(url);
                }
              }
            }
          }}
        />
        <DescriptionSectionAttachment
          showAttachmentWindow={index => dispatch(
            issuesActions.showAttachmentWindow({ issueId: issue.id, activeIndex: index }),
          )}
          attachment={issue.renderedFields.attachment}
        />
      </DescriptionSectionHeader>
    </IssueDetailsContainer>
  );
};

function mapStateToProps(state) {
  return {
    issue: getSelectedIssue(state),
    epic: getSelectedIssueEpic(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(IssueDetails);
