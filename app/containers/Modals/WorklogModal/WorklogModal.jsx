// @flow
import React, { Component } from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import ButtonGroup from '@atlaskit/button-group';
import Button from '@atlaskit/button';
import SingleSelect from '@atlaskit/single-select';
import InlineEditor from '@atlaskit/inline-edit';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Tooltip from '@atlaskit/tooltip';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { H700 } from 'styles/typography';
import { ModalContentContainer } from 'styles/modals';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Flex, Calendar, TextField } from 'components';
import { uiActions, worklogsActions } from 'actions';
import { getWorklogModalOpen } from 'selectors';

import {
  InputLabel,
  CalendarContainer,
  CalendarIconContainer,
} from './styled';

import type { SetWorklogModalOpen, AddManualWorklogRequest } from '../../../types';

type Props = {
  isOpen: boolean,
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
    endTime: moment(),
    comment: '',
  }

  handleTimeChange = (label) => value => {
    this.setState({ [label]: value });
  }

  render() {
    const { isOpen, setWorklogModalOpen }: Props = this.props;
    const { calendarOpened, date, startTime, endTime, comment }: State = this.state;
    console.log('DATE STATE', date);

    return (
      <ModalDialog
        isOpen={isOpen}
        onClose={() => setWorklogModalOpen(false)}
        onDialogDismissed={() => setWorklogModalOpen(false)}
        footer={
          <Flex row style={{ justifyContent: 'flex-end' }}>
            <ButtonGroup>
              <Button
                appearance="primary"
                onClick={() => {
                  this.props.addManualWorklogRequest({ startTime, endTime, comment, date });
                }}
              >
                Log
              </Button>
              <Button appearance="subtle" onClick={() => setWorklogModalOpen(false)}>
                Cancel
              </Button>
            </ButtonGroup>
          </Flex>
        }
      >
        <ModalContentContainer style={{ minHeight: 360 }}>
          <H700 style={{ display: 'block' }}>Add worklog</H700>
          <Flex column>
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
                  className={`TimePicker ${endTime.isBefore(startTime) ? 'invalid' : ''}`}
                  popupClassName="TimePickerPopup"
                  format="hh:mm"
                  showSeconds={false}
                />
                {endTime.isBefore(startTime) &&
                  <span className="error">End time must be after start time!</span>
                }
              </Flex>
            </div>
          </Flex>
          <TextField
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...uiActions, ...worklogsActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WorklogModal);
