// @flow
import React, { Component } from 'react';
import ModalDialog, { ModalFooter, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import FieldTextArea from '@atlaskit/field-text-area';
import Button, { ButtonGroup } from '@atlaskit/button';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Tooltip from '@atlaskit/tooltip';
import Spinner from '@atlaskit/spinner';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { ModalContentContainer } from 'styles/modals';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Flex, Calendar, TextField } from 'components';
import { uiActions, worklogsActions } from 'actions';
import { getWorklogModalOpen, getAddWorklogFetching } from 'selectors';
import { jts, stj } from 'time-util';

import {
  InputLabel,
  CalendarContainer,
  CalendarIconContainer,
  InputExample,
} from './styled';

import type { SetWorklogModalOpen, AddManualWorklogRequest } from '../../../types';

type Props = {
  isOpen: boolean,
  fetching: boolean,
  setWorklogModalOpen: SetWorklogModalOpen,
  addManualWorklogRequest: AddManualWorklogRequest,
};

type State = {
  calendarOpened: boolean,
  date: mixed,
  startTime: any,
  comment: string,
  totalSpent: string,
};

class WorklogModal extends Component<Props, State> {
  state = {
    calendarOpened: false,
    date: moment().format('MM/DD/YYYY'),
    startTime: moment(),
    comment: '',
    totalSpent: '20m',
  }

  handleTimeChange = (label) => value => {
    this.setState({ [label]: value });
  }

  handleTotalSpentChange = (e) => {
    const jiraTime = e.target.value || '';
    const isValid = this.checkIfJiraTime(jiraTime);
    if (isValid) {
      this.setState({ totalSpent: jiraTime });
    }
  }

  checkIfJiraTime = (jiraTime) => {
    // TODO: make regexp and only allow user to fill in date in jira time
    if ('4h 20m'.indexOf(jiraTime) >= -1) {
      return true;
    }
    return false;
  }

  render() {
    const { isOpen, setWorklogModalOpen, fetching }: Props = this.props;
    const { calendarOpened, date, startTime, comment, totalSpent }: State = this.state;

    return isOpen && (
      <ModalDialog
        onClose={() => setWorklogModalOpen(false)}
        footer={() => (
          <ModalFooter>
            <Flex row style={{ justifyContent: 'flex-end', width: '100%' }}>
              <ButtonGroup>
                <Button
                  appearance="primary"
                  disabled={fetching}
                  onClick={() => {
                    this.props.addManualWorklogRequest({ startTime, totalSpent, comment, date });
                  }}
                >
                  Log work&nbsp;
                  {fetching && <Spinner invertColor size={16} />}
                </Button>
                <Button appearance="subtle" onClick={() => setWorklogModalOpen(false)}>
                  Cancel
                </Button>
              </ButtonGroup>
            </Flex>
          </ModalFooter>
        )}
        header={() => (
          <ModalHeader>
            <ModalTitle>Add worklog</ModalTitle>
          </ModalHeader>
        )}
      >
        <ModalContentContainer style={{ minHeight: 360 }}>

          {/* TIME SPENT */}
          <InputLabel style={{ marginTop: 0 }}>Time spent</InputLabel>
          <Flex row alignCenter>
            <TextField
              value={totalSpent}
              onChange={this.handleTotalSpentChange}
              isLabelHidden
            />
            <InputExample>(eg. 1d 12h 30m)</InputExample>
          </Flex>

          {/* DATE */}
          <InputLabel>Date</InputLabel>
          <Tooltip
            position="right"
            description={calendarOpened ? 'Close calendar' : 'Open calendar'}
          >
            <Flex
              row
              alignCenter
              style={{ cursor: 'pointer' }}
              onClick={() => this.setState({ calendarOpened: !calendarOpened })}
            >
              <TextField
                value={date}
                isLabelHidden
                isReadOnly
              />
              <CalendarIconContainer>
                {calendarOpened ?
                  <EditorCloseIcon
                    label="Close Calendar"
                    size="medium"
                    primaryColor="#263958"
                  /> :
                  <CalendarIcon
                    label="Open Calendar"
                    size="medium"
                    primaryColor="#263958"
                  />
                }
              </CalendarIconContainer>
            </Flex>
          </Tooltip>

          {calendarOpened &&
            <CalendarContainer onClickOutside={() => this.setState({ calendarOpened: false })}>
              <Calendar
                onUpdate={value => this.setState({ date: value, calendarOpened: false })}
              />
            </CalendarContainer>
          }

          {/* FROM */}
          <Flex column style={{ width: 165 }}>
            <InputLabel>Started</InputLabel>
            <TimePicker
              value={startTime}
              onChange={this.handleTimeChange('startTime')}
              className="TimePicker"
              popupClassName="TimePickerPopup"
              format="HH:mm"
              showSecond={false}
            />
          </Flex>

          {/* COMMENT */}
          <FieldTextArea
            shouldFitContainer
            label="Worklog comment"
            value={comment}
            onChange={(ev) => this.setState({ comment: ev.target.value })}
          />
        </ModalContentContainer>
      </ModalDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpen: getWorklogModalOpen(state),
    fetching: getAddWorklogFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions, ...worklogsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WorklogModal);
