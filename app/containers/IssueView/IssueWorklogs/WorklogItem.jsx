// @flow
import React from 'react';
import moment from 'moment';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex } from 'components';
import { openWorklogInBrowser } from 'external-open-util';
import Tooltip from '@atlaskit/tooltip';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';
import LinkIcon from '@atlaskit/icon/glyph/link';
import TrashIcon from '@atlaskit/icon/glyph/trash';

import type { Worklog, DeleteWorklogRequest, EditWorklogRequest } from '../../../types';

import {
  WorklogContainer,
  UserAvatar,
  WorklogActions,
  Edited,
} from './styled';

const isEdited = (worklog: Worklog) => (
  moment(worklog.created).format('D/M/H/m') !== moment(worklog.updated).format('D/M/H/m')
);

type Props = {
  style: any,
  selected: boolean,
  worklog: Worklog,
  issueKey: string,
  deleteWorklogRequest: DeleteWorklogRequest,
  editWorklogRequest: EditWorklogRequest,
};

const WorklogItem: StatelessFunctionalComponent<Props> = ({
  style,
  selected,
  worklog,
  issueKey,
  deleteWorklogRequest,
  editWorklogRequest,
}: Props): Node => (
  <WorklogContainer selected={selected} id={`worklog-${worklog.id}`} style={style}>
    <Flex row alignCenter style={{ padding: 10 }}>
      <UserAvatar src={worklog.author.avatarUrls['32x32']} />
      {worklog.author.displayName} logged
      work – {moment(worklog.started).format('DD/MMM/YY h:mm A')}
      {isEdited(worklog) && (
        <Edited>- <span>edited</span></Edited>
      )}
      <WorklogActions>
        <Tooltip description="Open worklog in JIRA" position="left">
          <LinkIcon
            onClick={openWorklogInBrowser(worklog, issueKey)}
            label="Open in browser"
            size="small"
            primaryColor="#707070"
          />
        </Tooltip>
        <Tooltip description="Edit worklog" position="left">
          <EditFilledIcon
            onClick={() => editWorklogRequest(worklog)}
            label="Edit"
            size="small"
            primaryColor="#707070"
          />
        </Tooltip>
        <Tooltip description="Delete worklog" position="left">
          <TrashIcon
            onClick={() => deleteWorklogRequest(worklog)}
            label="Delete"
            size="small"
            primaryColor="#707070"
          />
        </Tooltip>
      </WorklogActions>
    </Flex>
    <Flex row alignCenter style={{ marginLeft: 32, marginTop: 10 }}>
      <span style={{ color: '#5e6c84' }}>Time spent:</span>&nbsp;{worklog.timeSpent}
    </Flex>
    <Flex row alignCenter style={{ marginLeft: 32, marginTop: 5 }}>
      <span style={{ color: '#5e6c84' }}>Comment:</span>&nbsp;{worklog.comment || '<no comment>'}
    </Flex>
  </WorklogContainer>
);

export default WorklogItem;
