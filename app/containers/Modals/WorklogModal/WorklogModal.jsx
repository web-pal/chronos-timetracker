// @flow
import React, { Component } from 'react';
import ModalDialog from '@atlaskit/modal-dialog';
import ButtonGroup from '@atlaskit/button-group';
import Button from '@atlaskit/button';
import TextField from '@atlaskit/field-text';
import SingleSelect from '@atlaskit/single-select';
import InlineEditor from '@atlaskit/inline-edit';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Calendar from '@atlaskit/calendar';
import Tooltip from '@atlaskit/tooltip';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { H700 } from 'styles/typography';
import { ModalContentContainer } from 'styles/modals';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Flex } from 'components';
import { uiActions } from 'actions';
import { getWorklogModalOpen } from 'selectors';

import {
  InputLabel,
  CalendarContainer,
  CalendarIconContainer,
} from './styled';

import type { SetWorklogModalOpen } from '../../../types';

type Props = {
  isOpen: boolean,
  setWorklogModalOpen: SetWorklogModalOpen,
};

type State = {
  calendarOpened: boolean,
  date: mixed,
  startTime: any,
  endTime: any,
};

const worklogTypes = [
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
];


class WorklogModal extends Component<Props, State> {
  state = {
    calendarOpened: false,
    date: undefined,
    startTime: moment(),
    endTime: moment(),
  }

  handleTimeChange = (value) => label => {
    this.setState({ [label]: value });
  }

  render() {
    const { isOpen, setWorklogModalOpen }: Props = this.props;
    const { calendarOpened, date, startTime, endTime }: State = this.state;

    return (
      <ModalDialog
        isOpen={isOpen}
        onClose={() => setWorklogModalOpen(false)}
        onDialogDismissed={() => setWorklogModalOpen(false)}
        footer={
          <Flex row style={{ justifyContent: 'flex-end' }}>
            <ButtonGroup>
              <Button appearance="primary">
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
                  placeholder="09/10/2017"
                  value={date || ''}
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
              <Calendar onUpdate={value => this.setState({ date: value, calendarOpened: false })} />
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
                  className="TimePicker"
                  popupClassName="TimePickerPopup"
                  format="hh:mm"
                  showSeconds={false}
                />
              </Flex>
            </div>
          </Flex>
          <div style={{ width: '50%' }}>
            <SingleSelect
              items={worklogTypes}
              label="Worklog type"
              placeholder="Automatic"
              shouldFitContainer
            />
          </div>
          <TextField
            shouldFitContainer
            label="Worklog comment"
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
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WorklogModal);
