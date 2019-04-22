import React from 'react';
import PropTypes from 'prop-types';

import {
  Flex,
} from 'styles';

import WorklogReport from '../WorklogReport';

const ActivityReport = ({
  activity: {
    worklogs,
    issue,
  },
}) => (
  <Flex
    column
    width="100%"
  >
    <Flex
      width="100%"
      spacing={8}
      padding="16px"
      background="#f3f3f3"
    >
      <Flex
        style={{
          backgroundImage: `url(${issue.fields.project.avatarUrls['48x48']})`,
          backgroundSize: 'contain',
        }}
        borderRadius="4px"
        height="48px"
        width="48px"
        align="flex-end"
      >
        {issue.fields?.assignee?.avatarUrls
          && (
          <Flex
            border="1px solid #f3f3f3"
            borderRadius="50%"
            height="24px"
            width="24px"
            justify="center"
            align="center"
            style={{
              overflow: 'hidden',
            }}
          >
            <img
              width="24px"
              height="24px"
              src={issue.fields.assignee.avatarUrls}
              alt={`${issue.fields.assignee?.displayName}-avatar`}
            />
          </Flex>
          )
        }
      </Flex>
      <Flex column spacing={4}>
        <Flex spacing={4}>
          <a>
            {issue.fields.project.name}
          </a>
          <span>
            /
          </span>
          <a>
            {issue.key}
          </a>
        </Flex>
        <span
          style={{
            fontSize: '24px',
            lineHeight: '16px',
          }}
        >
          {issue.fields.summary}
        </span>
      </Flex>
    </Flex>
    <Flex
      column
      width="100%"
      spacing={12}
    >
      {worklogs.map(
        worklog => (
          <WorklogReport
            key={worklog.id}
            issue={issue}
            worklog={worklog}
          />
        ),
      )}
    </Flex>
  </Flex>
);

ActivityReport.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default ActivityReport;
