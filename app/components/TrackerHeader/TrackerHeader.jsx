import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import Markdown from 'react-markdown';
import { stj } from 'time-util';

import Flex from '../Base/Flex/Flex';
import IssueInfo from './IssueInfo';
import WorklogTypePicker from '../../containers/ComponentsWrappers/WorklogTypePickerWrapper';

const TrackerHeader = ({
  currentIssue, currentWorklog,
  selfLogged, selfLoggedToday,
  loggedToday, sidebarType,
  showWorklogTypes, running,
}) => {
  const estimate = currentIssue.getIn(['fields', 'timeestimate']);
  const logged = currentIssue.getIn(['fields', 'timespent']);
  const remaining = estimate - logged < 0 ? 0 : estimate - logged;
  const isToday = moment(currentWorklog.get('created')).calendar() === 'Today';

  return (
    <Flex column className="TrackerHeader">
      <IssueInfo currentIssue={currentIssue} />
      {currentIssue.getIn(['fields', 'description']) &&
        <div className="TrackerHeader__description">
          <Markdown source={currentIssue.getIn(['fields', 'description'])} />
        </div>
      }
      <Flex row centerd spaceBetween className="TrackerHeader__times">
        <Flex column spaceBetween>
          <span className="logged">
            Total logged: <b>{stj(logged, 'h[h] m[m]')}</b>
          </span>
          <span className="logged">
            You logged: <b>{stj(selfLogged, 'h[h] m[m]')}</b>
          </span>
        </Flex>
        <Flex column spaceBetween>
          <span className="logged">
            Logged today: <b>{stj(loggedToday, 'h[h] m[m]')}</b>
          </span>
          <span className="estimate">
            You logged today: <b>{stj(selfLoggedToday, 'h[h] m[m]')}</b>
          </span>
        </Flex>
        <Flex column spaceBetween>
          <span className="remaining">
            Remaining: <b>{stj(remaining, 'h[h] m[m] s[s]')}</b>
          </span>
          <span className="estimate">
            Estimated: <b>{stj(estimate, 'h[h] m[m]')}</b>
          </span>
        </Flex>
      </Flex>
      {(sidebarType === 'Recent' && currentWorklog.size !== 0) &&
        <Flex row centerd spaceBetween className="TrackerHeader__worklog_times">
          <span className="logged">
            Worklog time: <b>{currentWorklog.get('timeSpent')}</b>
          </span>
          <span className="logged">
            Worklog date: <b>{moment(currentWorklog.get('created')).calendar()}</b>
          </span>
          <span className="estimate">
            Worklog id: <b>{currentWorklog.get('id')}</b>
          </span>
        </Flex>
      }
      {(sidebarType === 'Recent' && showWorklogTypes && !running && currentWorklog.size !== 0) &&
        <Flex row className="TrackerHeader__worklog-type">
          <span style={{ marginRight: 10 }}>
            Worklog type:
          </span>
          <WorklogTypePicker
            currentWorklogType={currentWorklog.get('worklogType')}
            currentWorklogId={currentWorklog.get('id')}
            showText={!isToday}
          />
        </Flex>
      }
    </Flex>
  );
};

TrackerHeader.propTypes = {
  currentIssue: ImmutablePropTypes.map.isRequired,
  currentWorklog: ImmutablePropTypes.map.isRequired,
  showWorklogTypes: PropTypes.bool.isRequired,
  running: PropTypes.bool.isRequired,
  sidebarType: PropTypes.string.isRequired,
  selfLogged: PropTypes.number.isRequired,
  selfLoggedToday: PropTypes.number.isRequired,
  loggedToday: PropTypes.number.isRequired,
};

export default TrackerHeader;
