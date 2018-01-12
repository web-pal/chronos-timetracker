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
import { getEditWorklogModalOpen, getEditWorklogFetching, getEditingWorklog } from 'selectors';
import { jts } from 'time-util';

import {
  InputLabel,
  CalendarContainer,
  CalendarIconContainer,
  InputExample,
} from './styled';

import type { SetEditWorklogModalOpen, Worklog, ConfirmEditWorklog } from '../../../types';

type Props = {
  isOpen: boolean,
  fetching: boolean,
  worklog: Worklog | null,
  setEditWorklogModalOpen: SetEditWorklogModalOpen,
  confirmEditWorklog: ConfirmEditWorklog,
};

type State = {
  calendarOpened: boolean,
  date: mixed,
  started: any,
  comment: string | null,
  timeSpent: string,
  jiraTimeError: string | null,
};

class EditWorklogModal extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      calendarOpened: false,
      date: moment().format('MM/DD/YYYY'),
      started: moment(),
      comment: '',
      timeSpent: '10m',
      jiraTimeError: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.worklog && !nextProps.fetching) {
      const { started, comment, timeSpent } = nextProps.worklog;
      this.setState({
        date: moment(started).format('MM/DD/YYYY'),
        started: moment(started),
        timeSpent,
        comment,
      });
    }
  }

  handleDateChange = (date) => {
    const started = moment(date);
    started.set('hour', this.state.started.get('hour'));
    started.set('minute', this.state.started.get('minute'));
    this.setState({ date, started, calendarOpened: false });
  }

  handleTimeChange = (started) => {
    this.setState({ started });
  }

  handleTotalSpentChange = (e) => {
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
      setEditWorklogModalOpen,
      fetching,
      worklog,
    }: Props = this.props;
    const {
      calendarOpened,
      date,
      started,
      comment,
      timeSpent,
      jiraTimeError,
    }: State = this.state;

    return isOpen && (
      <ModalDialog
        onClose={() => setEditWorklogModalOpen(false)}
        footer={() => (
          <ModalFooter>
            <Flex row style={{ justifyContent: 'flex-end', width: '100%' }}>
              <ButtonGroup>
                <Button
                  appearance="primary"
                  disabled={fetching}
                  onClick={() => {
                    this.props.confirmEditWorklog({
                      ...worklog,
                      started: moment(started).utc().format().replace('Z', '.000+0000'),
                      updated: moment().utc().format().replace('Z', '.000+0000'),
                      comment,
                      timeSpentSeconds: jts(timeSpent),
                      timeSpent,
                    });
                  }}
                  iconAfter={fetching ? <Spinner invertColor /> : null}
                >
                  Confirm
                </Button>
                <Button appearance="subtle" onClick={() => setEditWorklogModalOpen(false)}>
                  Cancel
                </Button>
              </ButtonGroup>
            </Flex>
          </ModalFooter>
        )}
        header={() => (
          <ModalHeader>
            <ModalTitle>Edit worklog</ModalTitle>
          </ModalHeader>
        )}
      >
        <ModalContentContainer style={{ minHeight: 360 }}>

          {/* TIME SPENT */}
          <InputLabel style={{ marginTop: 0 }}>Time spent</InputLabel>
          <Flex row alignCenter>
            <TextField
              value={timeSpent}
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
                onUpdate={this.handleDateChange}
              />
            </CalendarContainer>
          }

          {/* FROM */}
          <Flex column style={{ width: 165 }}>
            <InputLabel>Started</InputLabel>
            <TimePicker
              value={started}
              onChange={this.handleTimeChange}
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
          />
        </ModalContentContainer>
      </ModalDialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpen: getEditWorklogModalOpen(state),
    worklog: getEditingWorklog(state),
    fetching: getEditWorklogFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions, ...worklogsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditWorklogModal);
