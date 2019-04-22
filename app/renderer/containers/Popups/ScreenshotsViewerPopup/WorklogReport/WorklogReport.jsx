import React from 'react';
import {
  connect,
} from 'react-redux';
import PropTypes from 'prop-types';

import {
  screenshotsActions,
} from 'actions';

import CameraTakePictureIcon from '@atlaskit/icon/glyph/camera-take-picture';
import {
  Flex,
} from 'styles';

import ScreenshotsSection from '../ScreenshotsSection';
import {
  RecordIconAnimated,
} from '../styled';

const WorklogReport = ({
  worklog,
  issue,
  dispatch,
}) => {
  const {
    screenshots,
    isUnfinished,
    sections,
    createdFormat,
  } = worklog;
  return (
    <Flex column width="100%">
      <Flex
        width="100%"
        spacing={4}
        padding="16px"
        background="#f9f9f9"
      >
        {isUnfinished
          ? (
            <Flex
              spacing={4}
              align="center"
              justify="center"
            >
              <RecordIconAnimated>
                <CameraTakePictureIcon />
              </RecordIconAnimated>
              <span>
                Tracking right now
              </span>
            </Flex>
          ) : (
            <>
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
                  src={worklog.author.avatarUrls['24x24']}
                  alt={`${worklog.author.displayName}-avatar`}
                />
              </Flex>
              <span style={{ fontWeight: 500 }}>
                {worklog.author.displayName}
              </span>
              <span>
                logged {worklog.timeSpent}
                {' – '}
                {createdFormat}
              </span>
            </>
          )
        }
      </Flex>
      {screenshots.length
        ? (
          <Flex
            column
            width="100%"
            padding="16px 16px 16px 0"
          >
            {sections.map((section, i) => (
              <ScreenshotsSection
                key={section.id}
                index={i}
                section={section}
                onDeleteScreenshot={(screenshot) => {
                  dispatch(screenshotsActions.deleteScreenshotRequest({
                    isUnfinished,
                    worklogId: worklog.id,
                    issueId: issue.id,
                    timestamp: screenshot.timestamp,
                  }));
                }}
              />
            ))}
          </Flex>
        ) : (
          <Flex
            column
            width="100%"
            height="128px"
            align="center"
            justify="center"
          >
            <span
              style={{
                fontSize: '1.5em',
                fontWeight: 900,
                opacity: 0.2,
              }}
            >
              No screenshots available for this worklog
            </span>
          </Flex>
        )
      }
    </Flex>
  );
};

WorklogReport.propTypes = {
  worklog: PropTypes.object.isRequired,
  issue: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const connector = connect(
  null,
  dispatch => ({ dispatch }),
);

export default connector(WorklogReport);
