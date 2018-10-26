// @flow
import React, { Component } from 'react';
import moment from 'moment';
import type Moment from 'moment';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Tooltip from '@atlaskit/tooltip';
import Spinner from '@atlaskit/spinner';
import {
  connect,
} from 'react-redux';
import {
  getStatus as getResourceStatus,
  getResources,
} from 'redux-resource';
import type {
  Id,
  Worklog,
  Dispatch,
  Issue,
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
import {
  Checkbox,
} from '@atlaskit/checkbox';

import {
  ModalContentContainer,
} from 'styles/modals';

import {
  uiActions,
  worklogsActions,
  settingsActions,
} from 'actions';
import {
  getModalState,
  getUiState,
  getEditWorklog,
  getSettingsState,
} from 'selectors';

import {
  Flex,
  Calendar,
  TextField,
  RemainingEstimatePicker,
} from 'components';

import { jts } from 'utils/time-util';

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
  issue: Issue,
  worklog: Worklog,
  dispatch: Dispatch,
  adjustStartTime: boolean,
  allowEmptyComment: boolean,
};

type State = {
  calendarOpened: boolean,
  date: string,
  startTime: Moment,
  comment: string | null,
  timeSpent: string,
  remainingEstimateValue: 'new' | 'leave' | 'manual' | 'auto',
  remainingEstimateSetTo: string,
  remainingEstimateReduceBy: string,
  errors: { [string]: string },
};

const JIRA_TIME_REGEXP = /^(?:\d{1,2}d{1}(?:\s{1}|$))?(?:\d{1,2}h{1}(?:\s{1}|$))?(?:\d{1,2}m{1}(?:\s{1}|$))?(?:\d{1,2}s{1}(?:\s{1}|$))?$/g;

class WorklogModal extends Component<Props, State> {
  state = {
    calendarOpened: false,
    date: moment().format('MM/DD/YYYY'),
    startTime: moment(),
    comment: '',
    timeSpent: '20m',
    remainingEstimateValue: 'auto',
    remainingEstimateSetTo: '',
    remainingEstimateReduceBy: '',
    errors: {
      comment: '',
      timeSpent: '',
      date: '',
      started: '',
    },
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
          this.timeInput.focus();
        }
      }, 50);
    }
    if (!nextProps.isOpen && this.props.isOpen) {
      this.setState({
        comment: '',
        errors: {
          comment: '',
          timeSpent: '',
        },
      });
    }
  }

  setDateAndTimeToNow = () => {
    const now = moment();
    this.setState({
      startTime: now,
      date: now.format('MM/DD/YYYY'),
    });
  }

  setError = (fieldName, error) => this.setState({
    errors: {
      ...this.state.errors,
      [fieldName]: error,
    },
  });

  handleTimeChange = (label: 'startTime') => (value) => {
    this.setState({ [label]: value });
  }

  timeInput: any;

  clearError = fieldName => this.setError(fieldName, '');

  handleTimeSpentChange = (e) => {
    const timeSpent = e.target.value || '';
    this.setState(({ startTime }) => {
      if (this.props.adjustStartTime) {
        const newStartTime = moment().subtract(jts(timeSpent), 's');
        return {
          timeSpent,
          startTime: newStartTime,
        };
      }
      return {
        timeSpent,
      };
    });
  }

  validateJiraTime = value => /^(?:\d{1,2}d{1}(?:\s{1}|$))?(?:\d{1,2}h{1}(?:\s{1}|$))?(?:\d{1,2}m{1}(?:\s{1}|$))?(?:\d{1,2}s{1}(?:\s{1}|$))?$/.test(value);

  validate = () => {
    const { errors, comment, timeSpent } = this.state;
    let valid = true;

    if (comment === '' && !this.props.allowEmptyComment) {
      errors.comment = 'Comment is required';
      valid = false;
    } else {
      errors.comment = '';
    }

    const condition = (timeSpent === '') || !this.validateJiraTime(timeSpent);

    if (condition) {
      errors.timeSpent = 'Invalid time format';
      valid = false;
    } else {
      errors.timeSpent = '';
    }

    this.setState({ errors });

    return valid;
  }

  render() {
    const {
      isOpen,
      issueId,
      worklog,
      saveInProcess,
      dispatch,
      issue,
      adjustStartTime,
      allowEmptyComment,
    }: Props = this.props;

    const {
      calendarOpened,
      date,
      startTime,
      comment,
      timeSpent,
      remainingEstimateValue,
      remainingEstimateSetTo,
      remainingEstimateReduceBy,
      errors,
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
                    const isValid = this.validate();
                    if (isValid) {
                      dispatch(worklogsActions.saveWorklogRequest({
                        worklogId: worklog ? worklog.id : null,
                        issueId,
                        startTime: startTime.set({
                          year: parseInt(date.split('/')[2], 10),
                          month: parseInt(date.split('/')[0], 10) - 1,
                          date: parseInt(date.split('/')[1], 10),
                        }),
                        adjustEstimate: remainingEstimateValue,
                        newEstimate: remainingEstimateSetTo,
                        reduceBy: remainingEstimateReduceBy,
                        timeSpent,
                        comment,
                        date,
                      }));
                      this.setState({ comment: '', errors: { comment: '', timeSpent: '' } });
                    }
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
              required
              isInvalid={errors.timeSpent !== ''}
              invalidMessage={errors.timeSpent}
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

          <Flex column>
            <InputLabel>Started</InputLabel>
            <Flex alignCenter>
              <div style={{ width: 165 }}>
                <TimePicker
                  value={startTime}
                  onChange={this.handleTimeChange('startTime')}
                  className="TimePicker"
                  popupClassName="TimePickerPopup"
                  format="HH:mm"
                  showSecond={false}
                />
              </div>
              <Checkbox
                name="adjust_start_time"
                id="adjust_start_time"
                isChecked={adjustStartTime}
                label="Adjust start time according to time spend"
                onChange={() => {
                  dispatch(settingsActions.setLocalDesktopSetting(
                    adjustStartTime,
                    'notAdjustStartTime',
                  ));
                }}
              />
            </Flex>
          </Flex>

          {/* ESTIMATE */}
          <RemainingEstimatePicker
            issue={issue}
            value={remainingEstimateValue}
            onChange={value => this.setState({ remainingEstimateValue: value })}
            onReduceByChange={value => this.setState({ remainingEstimateReduceBy: value })}
            onNewChange={value => this.setState({ remainingEstimateSetTo: value })}
            newValue={remainingEstimateSetTo}
            reduceByValue={remainingEstimateReduceBy}
          />

          {/* COMMENT */}
          <FieldTextAreaStateless
            shouldFitContainer
            label="Worklog comment"
            required={!allowEmptyComment}
            isInvalid={errors.comment !== ''}
            invalidMessage={errors.comment}
            value={comment || ''}
            onChange={ev => this.setState({ comment: ev.target.value })}
          />
        </ModalContentContainer>
      </ModalDialog>
    );
  }
}

function mapStateToProps(state) {
  const issueId = getUiState('worklogFormIssueId')(state);
  return {
    issueId,
    isOpen: getModalState('worklog')(state),
    issue: getResources(state.issues, [issueId])[0],
    worklog: getEditWorklog(state),
    saveInProcess: getResourceStatus(
      state,
      'worklogs.requests.saveWorklog.status',
    ).pending,
    localDesktopSettings: getSettingsState('localDesktopSettings')(state),
    allowEmptyComment: getSettingsState('localDesktopSettings')(state).allowEmptyComment,
    adjustStartTime: !getSettingsState('localDesktopSettings')(state).notAdjustStartTime,
  };
}

const connector = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(WorklogModal);
