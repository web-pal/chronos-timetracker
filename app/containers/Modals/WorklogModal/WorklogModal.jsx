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
import { getWorklogModalOpen, getEditWorklogFetching } from 'selectors';

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
  jiraTimeError: string | null,
};

class WorklogModal extends Component<Props, State> {
  state = {
    calendarOpened: false,
    date: moment().format('MM/DD/YYYY'),
    startTime: moment(),
    comment: '',
    totalSpent: '20m',
    jiraTimeError: null,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen && !this.props.isOpen) {
      setTimeout(() => {
        this.totalSpent = '';
        this.setState({ totalSpent: '' });
        this.setDateAndTimeToNow();
        if (this.comment) this.comment.focus();
      }, 10);
    }
  }
  setDateAndTimeToNow = (e) => {
    const newTime = moment();
    const newDate = moment().format('MM/DD/YYYY');
    this.setState({ startTime: newTime });
    this.setState({ date: newDate });
  }

  handleTimeChange = label => (value) => {
    this.setState({ [label]: value });
  }

  handleTotalSpentChange = (e) => {
    const jiraTime = e.target.value || '';
    const isValid = this.checkIfJiraTime(jiraTime);
    if (isValid) {
      this.setState({ totalSpent: jiraTime, jiraTimeError: null });
    } else {
      this.setState({ totalSpent: jiraTime, jiraTimeError: 'invalid format' });
    }
  }

  checkIfJiraTime = (jiraTime) => {
    if (/^(\d{1,2}d{1}(\s{1}|$))?(\d{1,2}h{1}(\s{1}|$))?(\d{1,2}m{1}(\s{1}|$))?(\d{1,2}s{1}(\s{1}|$))?$/g.test(jiraTime)) {
      return true;
    }
    return false;
  }

  render() {
    const { isOpen, setWorklogModalOpen, fetching }: Props = this.props;
    const {
      calendarOpened,
      date,
      startTime,
      comment,
      totalSpent,
      jiraTimeError,
    }: State = this.state;

    return isOpen && (
      <ModalDialog
        onClose={() => setWorklogModalOpen(false)}
        footer={() => (
          <ModalFooter>
            <Flex row style={{ justifyContent: 'flex-end', width: '100%' }}>
              <ButtonGroup>
                <Button appearance="primary" onClick={this.setDateAndTimeToNow}>
                  Now
                </Button>
                <Button
                  appearance="primary"
                  disabled={fetching}
                  onClick={() => {
                    this.props.addManualWorklogRequest({
                      startTime: startTime.set({
                        year: date.split('/')[2],
                        month: parseInt(date.split('/')[0], 10) - 1,
                        date: date.split('/')[1],
                      }),
                      totalSpent,
                      comment,
                      date,
                    });
                    this.setState({ comment: '' });
                  }}
                  iconAfter={fetching ? <Spinner invertColor /> : null}
                >
                  Log work
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
              isInvalid={!!jiraTimeError}
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
            onChange={ev => this.setState({ comment: ev.target.value })}
            ref={(c) => { this.comment = c; }}
          />
        </ModalContentContainer>
      </ModalDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpen: getWorklogModalOpen(state),
    fetching: getEditWorklogFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions, ...worklogsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WorklogModal);
