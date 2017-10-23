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

import {
  InputLabel,
  CalendarContainer,
  CalendarIconContainer,
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
  endTime: any,
  comment: string,
};

/* const worklogTypes = [
  {
    heading: 'Default worklog types',
    items: [
      { content: 'Automatic', value: 'sydney' },
      { content: 'Manual', value: 'canberra' },
    ],
  },
  {
    heading: 'Custom worklog types',
    items: [
      { content: 'Design', value: 'sheep' },
      { content: 'Development', value: 'cow' },
      { content: 'Play CIV6', value: 'civ6', isDisabled: true },
    ],
  },
]; */


class WorklogModal extends Component<Props, State> {
  state = {
    calendarOpened: false,
    date: moment().format('MM/DD/YYYY'),
    startTime: moment(),
    endTime: moment().add(10, 'm'),
    comment: '',
  }

  handleTimeChange = (label) => value => {
    this.setState({ [label]: value });
  }

  render() {
    const { isOpen, setWorklogModalOpen, fetching }: Props = this.props;
    const { calendarOpened, date, startTime, endTime, comment }: State = this.state;

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
                    this.props.addManualWorklogRequest({ startTime, endTime, comment, date });
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
          <Flex column>
            <InputLabel style={{ paddingTop: 0 }}>Date</InputLabel>
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
          </Flex>
          {calendarOpened &&
            <CalendarContainer>
              <Calendar
                onUpdate={value => this.setState({ date: value, calendarOpened: false })}
              />
            </CalendarContainer>
          }
          <Flex row>
            <div style={{ width: '35%', marginRight: 10 }}>
              <Flex column>
                <InputLabel>From</InputLabel>
                <TimePicker
                  value={startTime}
                  onChange={this.handleTimeChange('startTime')}
                  className="TimePicker"
                  popupClassName="TimePickerPopup"
                  format="hh:mm"
                  showSeconds={false}
                />
              </Flex>
            </div>
            <div style={{ width: '35%' }}>
              <Flex column>
                <InputLabel>To</InputLabel>
                <TimePicker
                  value={endTime}
                  onChange={this.handleTimeChange('endTime')}
                  className={`TimePicker ${endTime.isSameOrBefore(startTime) ? 'invalid' : ''}`}
                  popupClassName="TimePickerPopup"
                  format="hh:mm"
                  showSeconds={false}
                />
                {endTime.isSameOrBefore(startTime) &&
                  <span className="error">End time must be after start time!</span>
                }
              </Flex>
            </div>
          </Flex>
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
