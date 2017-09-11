import React from 'react';
import { taskType, majorPriority } from 'data/svg';
import { attachments } from 'data/assets';
import Flex from '../../../components/Base/Flex/Flex';

import {
  IssueDetails,
  DetailsLabel,
  DetailsValue,

  IssuePriority,
  IssueType,
  IssueLabel,
  IssueEpic,
  Label,
} from './styled';

/* eslint-disable */
export default (props) => {
  console.log(props);
  console.log(props.currentIssue.toJS());
  const { currentIssue } = props;
  /* eslint-enable */
  return (
    <IssueDetails>
      <Flex row spaceBetween>
        <Flex column style={{ width: '42%' }}>

          <Flex row spaceBetween>
            <DetailsLabel>
              Type:
            </DetailsLabel>
            <DetailsValue>
              <IssueType
                src={currentIssue.getIn(['fields', 'issuetype', 'iconUrl'])}
                alt={currentIssue.getIn(['fields', 'issuetype', 'name'])}
              />
              {currentIssue.getIn(['fields', 'issuetype', 'name'])}
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Priority:
            </DetailsLabel>
            <DetailsValue>
              <IssuePriority
                src={currentIssue.getIn(['fields', 'priority', 'iconUrl'])}
                alt={currentIssue.getIn(['fields', 'priority', 'name'])}
              />
              {currentIssue.getIn(['fields', 'priority', 'name'])}
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Affects Version/s:
            </DetailsLabel>
            <DetailsValue>
              None
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Component/s:
            </DetailsLabel>
            <DetailsValue>
              None
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Labels/s:
            </DetailsLabel>
            <Label>
              Quckie
            </Label>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Epic Link:
            </DetailsLabel>
            <IssueEpic>
              Refactoring
            </IssueEpic>
          </Flex>

        </Flex>
        <Flex column style={{ width: '42%' }}>

          <Flex row spaceBetween>
            <DetailsLabel>
              Status:
            </DetailsLabel>
            <DetailsValue>
              <IssueLabel>
                {currentIssue.getIn(['fields', 'status', 'name']).toUpperCase()}
              </IssueLabel>
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Resolution:
            </DetailsLabel>
            <DetailsValue>
              Unresolved
            </DetailsValue>
          </Flex>

          <Flex row spaceBetween>
            <DetailsLabel>
              Fix Version/s:
            </DetailsLabel>
            <DetailsValue>
              <a>0.1.4</a>
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
      >Description</div>

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

      <div
        style={{
          borderTop: '2px solid rgba(0, 0, 0, .1)',
          fontWeight: 600,
          marginTop: 10,
          paddingTop: 10,
        }}
      >Attachments</div>

      <img src={attachments} alt="" style={{ width: '100%' }} />
    </IssueDetails>
  );
};
