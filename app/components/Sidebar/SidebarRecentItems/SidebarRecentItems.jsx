import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';

import TimestampItem from './TimestampItem';
import RecentItem from '../../../containers/ComponentsWrappers/SidebarItemWrapper';
import Flex from '../../Base/Flex/Flex';

moment.locale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    lastWeek: 'L',
    sameElse: 'L',
  },
});

const SidebarRecentItems = ({ recentItems, showSpinner, style }) =>
  <div className="RecentItems" style={style}>
    {recentItems.map(item =>
      <Flex key={item.day} column className="RecentItems__block">
        <TimestampItem
          date={item.day}
          worklogs={item.worklogs}
        />
        <Flex column className="RecentItems__list">
          {item.worklogs.map(worklog =>
            <RecentItem
              key={worklog.get('id')}
              worklog={worklog}
              issue={worklog.get('issue')}
              itemType="Recent"
            />,
          )}
        </Flex>
      </Flex>,
    )}
    {recentItems.size === 0 && !showSpinner &&
      <Flex column centered className="RecentEmptyItem">
        Nothing has been tracked recently
      </Flex>
    }
  </div>;

SidebarRecentItems.propTypes = {
  recentItems: ImmutablePropTypes.list.isRequired,
  showSpinner: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
};

export default SidebarRecentItems;
