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
  Connector,
} from 'react-redux';
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
  CheckboxStateless as Checkbox,
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
};

type State = {
  calendarOpened: boolean,
  date: string,
  startTime: Moment,
  comment: string | null,
  timeSpent: string,
  jiraTimeError: string | null,
  remainingEstimateValue: 'new' | 'leave' | 'manual' | 'auto',
  remainingEstimateSetTo: string,
  remainingEstimateReduceBy: string,
  adjustStartTime: boolean,
};

const JIRA_TIME_REGEXP = /^(\d{1,2}d{1}(\s{1}|$))?(\d{1,2}h{1}(\s{1}|$))?(\d{1,2}m{1}(\s{1}|$))?(\d{1,2}s{1}(\s{1}|$))?$/g;

class WorklogModal extends Component<Props, State> {
  state = {
    calendarOpened: false,
    date: moment().format('MM/DD/YYYY'),
    startTime: moment(),
    comment: '',
    timeSpent: '20m',
    jiraTimeError: null,
    remainingEstimateValue: 'auto',
    remainingEstimateSetTo: '',
    remainingEstimateReduceBy: '',
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

  timeInput: any;

  handleTimeChange = (label: 'startTime') => (value) => {
    this.setState({ [label]: value });
  }

  handleTimeSpentChange = (e) => {
    const jiraTime = e.target.value || '';
    const isValid = this.checkIfJiraTime(jiraTime);
    if (isValid) {
      this.setState(({ startTime }) => {
        if (this.props.adjustStartTime) {
          const newStartTime = startTime.clone().subtract(
            jiraTime.split(' ').map((t) => {
              const value = +(t.substr(0, t.length - 1));
              switch (t.substr(-1)) {
                case 's':
                  return value;
                case 'm':
                  return value * 60;
                case 'h':
                  return value * 60 * 60;
                case 'd':
                  return value * 60 * 60 * 8;
              }
            }).reduce((s, v) => s + v, 0),
            's',
          );
          return {
            timeSpent: jiraTime,
            jiraTimeError: null,
            startTime: newStartTime,
            date: newStartTime.format('MM/DD/YYYY'),
          };
        }
        return {
          timeSpent: jiraTime,
          jiraTimeError: null,
        };
      });
    } else {
      this.setState({ timeSpent: jiraTime, jiraTimeError: 'invalid format' });
    }
  }

  checkIfJiraTime = RegExp.prototype.test.bind(JIRA_TIME_REGEXP)

  render() {
    const {
      isOpen,
      issueId,
      worklog,
      saveInProcess,
      dispatch,
      issue,
      adjustStartTime,
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
            value={comment}
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
    adjustStartTime: !getSettingsState('localDesktopSettings')(state).notAdjustStartTime,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(WorklogModal);
