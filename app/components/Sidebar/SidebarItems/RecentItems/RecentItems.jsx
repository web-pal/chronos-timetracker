import React, { PropTypes } from 'react';
import moment from 'moment';

import Flex from '../../../Base/Flex/Flex';
import RecentItem from './RecentItem/RecentItem';
import RecentEmptyItem from './RecentEmptyItem/RecentEmptyItem';
import TimestampItem from './TimestampItem/TimestampItem';

moment.locale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    lastWeek: 'L',
    sameElse: 'L',
  },
});

const RecentItems = ({
  items,
  onItemClick,
  fetching,
  current,
  tracking,
  selectRecent,
  recentSelected,
}) =>
  <div className="RecentItems">
    {items.toList().map((item, i) =>
      <Flex column className="RecentItems__block" key={i}>
        <TimestampItem
          date={item.toList().get(0).get('updated')}
          index={i}
          items={item.toList()}
        />
        <RecentItem
          onClick={(issue, ind) => {
            onItemClick(issue);
            selectRecent(`${i}_${ind}`);
          }}
          index={i}
          worklogs={item}
          current={current}
          recentSelected={recentSelected}
          tracking={tracking}
        />
      </Flex>
    )}
    {items.size === 0 && !fetching && <RecentEmptyItem />}
  </div>;

RecentItems.propTypes = {
  items: PropTypes.object.isRequired,
  onItemClick: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
  current: PropTypes.string,
  tracking: PropTypes.string,
  selectRecent: PropTypes.func.isRequired,
  recentSelected: PropTypes.string,
};

export default RecentItems;
