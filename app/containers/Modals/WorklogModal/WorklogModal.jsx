// @flow
import React, { Component } from 'react';
import moment from 'moment';
import {
  connect,
} from 'react-redux';
import {
  getStatus as getResourceStatus,
} from 'redux-resource';

import type {
  Connector,
} from 'react-redux';
import type {
  Id,
  Worklog,
  Dispatch,
} from 'types';

import ModalDialog, {
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import {
  FieldTextAreaStateless,
} from '@atlaskit/field-text-area';
import TimePicker from 'rc-time-picker';
import Button, {
  ButtonGroup,
} from '@atlaskit/button';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Tooltip from '@atlaskit/tooltip';
import Spinner from '@atlaskit/spinner';

import {
  ModalContentContainer,
} from 'styles/modals';

import {
  uiActions,
  worklogsActions,
} from 'actions';
import {
  getWorklogModalOpen,
  getModalState,
  getUiState,
  getEditWorklog,
} from 'selectors';

import {
  Flex,
  Calendar,
  TextField,
} from 'components';

import {
  InputLabel,
  CalendarContainer,
  CalendarIconContainer,
  InputExample,
} from './styled';


type Props = {
  isOpen: boolean,
  saveInProcess: boolean,
  issueId: Id,
  worklog: Worklog,
  dispatch: Dispatch,
};

type State = {
  calendarOpened: boolean,
  date: any,
  startTime: any,
  comment: string,
  timeSpent: string,
  jiraTimeError: string | null,
};

class WorklogModal extends Component<Props, State> {
  state = {
    calendarOpened: false,
    date: moment().format('MM/DD/YYYY'),
    startTime: moment(),
    comment: '',
    timeSpent: '20m',
    jiraTimeError: null,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen && !this.props.isOpen) {
      if (nextProps.worklog) {
        this.setState({
          date: moment(nextProps.worklog.started).format('MM/DD/YYYYY'),
          timeSpent: nextProps.worklog.timeSpent,
          startTime: moment(nextProps.worklog.started),
          comment: nextProps.worklog.comment,
        });
      } else {
        this.setState({ timeSpent: '' });
        this.setDateAndTimeToNow();
      }
      setTimeout(() => {
        if (this.timeInput) {
          this.timeInput.focus(); // eslint-disable-line
        }
      }, 50);
    }
    if (!nextProps.isOpen && this.props.isOpen) {
      this.setState({
        comment: '',
      });
    }
  }

  setDateAndTimeToNow = () => {
    const now = moment();
    this.setState({ startTime: now });
    this.setState({ date: now.format('MM/DD/YYYY') });
  }

  handleTimeChange = label => (value) => {
    this.setState({ [label]: value });
  }

  handleTimeSpentChange = (e) => {
    const jiraTime = e.target.value || '';
    const isValid = this.checkIfJiraTime(jiraTime);
    if (isValid) {
      this.setState({ timeSpent: jiraTime, jiraTimeError: null });
    } else {
      this.setState({ timeSpent: jiraTime, jiraTimeError: 'invalid format' });
    }
  }

  checkIfJiraTime = (jiraTime) => {
    if (/^(\d{1,2}d{1}(\s{1}|$))?(\d{1,2}h{1}(\s{1}|$))?(\d{1,2}m{1}(\s{1}|$))?(\d{1,2}s{1}(\s{1}|$))?$/g.test(jiraTime)) {
      return true;
    }
    return false;
  }

  render() {
    const {
      isOpen,
      issueId,
      worklog,
      saveInProcess,
      dispatch,
    }: Props = this.props;
    const {
      calendarOpened,
      date,
      startTime,
      comment,
      timeSpent,
      jiraTimeError,
    }: State = this.state;

    return isOpen && (
      <ModalDialog
        onClose={() => {
          dispatch(uiActions.setModalState('worklog', false));
          dispatch(uiActions.setUiState('editWorklogId', null));
        }}
        footer={() => (
          <ModalFooter>
            <Flex row style={{ justifyContent: 'flex-end', width: '100%' }}>
              <ButtonGroup>
                <Button
                  appearance="primary"
                  disabled={saveInProcess}
                  onClick={() => {
                    dispatch(worklogsActions.saveWorklogRequest({
                      worklogId: worklog ? worklog.id : null,
                      issueId,
                      startTime: startTime.set({
                        year: date.split('/')[2],
                        month: parseInt(date.split('/')[0], 10) - 1,
                        date: date.split('/')[1],
                      }),
                      timeSpent,
                      comment,
                      date,
                    }));
                    this.setState({ comment: '' });
                  }}
                  iconAfter={saveInProcess ? <Spinner invertColor /> : null}
                >
                  Log work
                </Button>
                <Button
                  appearance="subtle"
                  onClick={() => {
                    dispatch(uiActions.setModalState('worklog', false));
                    dispatch(uiActions.setUiState('editWorklogId', null));
                  }}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </Flex>
          </ModalFooter>
        )}
        header={() => (
          <ModalHeader>
            <ModalTitle>
              {`${this.props.worklog ? 'Edit' : 'Add'} worklog`}
            </ModalTitle>
          </ModalHeader>
        )}
      >
        <ModalContentContainer style={{ minHeight: 360 }}>

          {/* TIME SPENT */}
          <InputLabel style={{ marginTop: 0 }}>Time spent</InputLabel>
          <Flex row alignCenter>
            <TextField
              value={timeSpent}
              onChange={this.handleTimeSpentChange}
              isLabelHidden
              isInvalid={!!jiraTimeError}
              ref={(ref) => {
                this.timeInput = ref; // eslint-disable-line
              }}
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
            <CalendarContainer
              onClickOutside={() => {
                this.setState({
                  calendarOpened: false,
                });
              }}
            >
              <Calendar
                onUpdate={(newDate) => {
                  this.setState({
                    date: newDate,
                    calendarOpened: false,
                  });
                }}
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
          <FieldTextAreaStateless
            shouldFitContainer
            label="Worklog comment"
            value={comment}
            onChange={ev => this.setState({ comment: ev.target.value })}
          />
        </ModalContentContainer>
      </ModalDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpen: getModalState('worklog')(state),
    issueId: getUiState('worklogFormIssueId')(state),
    worklog: getEditWorklog(state),
    saveInProcess: getResourceStatus(
      state,
      'worklogs.requests.saveWorklog.status',
    ).pending,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(WorklogModal);
