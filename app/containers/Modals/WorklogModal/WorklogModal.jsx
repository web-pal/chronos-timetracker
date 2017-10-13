// @flow
import React, { Component } from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
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

const timeOptions = [
  {
    items: [
      { content: '00:00', value: '00:00' },
      { content: '00:30', value: '00:30' },
      { content: '01:00', value: '01:00' },
      { content: '01:30', value: '01:30' },
      { content: '02:00', value: '02:00' },
      { content: '02:30', value: '02:30' },
      { content: '03:00', value: '03:00' },
      { content: '03:30', value: '03:30' },
      { content: '04:00', value: '04:00' },
      { content: '04:30', value: '04:30' },
      { content: '05:00', value: '05:00' },
      { content: '05:30', value: '05:30' },
      { content: '06:00', value: '06:00' },
      { content: '06:30', value: '06:30' },
      { content: '07:00', value: '07:00' },
      { content: '07:30', value: '07:30' },
      { content: '08:00', value: '08:00' },
      { content: '08:30', value: '08:30' },
      { content: '09:00', value: '09:00' },
      { content: '09:30', value: '09:30' },
      { content: '10:00', value: '10:00' },
      { content: '10:30', value: '10:30' },
      { content: '11:00', value: '11:00' },
      { content: '11:30', value: '11:30' },
      { content: '12:00', value: '12:00' },
      { content: '12:30', value: '12:30' },
      { content: '13:00', value: '13:00' },
      { content: '13:30', value: '13:30' },
      { content: '14:00', value: '14:00' },
      { content: '14:30', value: '14:30' },
      { content: '15:00', value: '15:00' },
      { content: '15:30', value: '15:30' },
      { content: '16:00', value: '16:00' },
      { content: '16:30', value: '16:30' },
      { content: '17:00', value: '17:00' },
      { content: '17:30', value: '17:30' },
      { content: '18:00', value: '18:00' },
      { content: '18:30', value: '18:30' },
      { content: '19:00', value: '19:00' },
      { content: '19:30', value: '19:30' },
      { content: '20:00', value: '20:00' },
      { content: '20:30', value: '20:30' },
      { content: '21:00', value: '21:00' },
      { content: '21:30', value: '21:30' },
      { content: '22:00', value: '22:00' },
      { content: '22:30', value: '22:30' },
      { content: '23:00', value: '23:00' },
      { content: '23:30', value: '23:30' },
    ],
  },
];

class WorklogModal extends Component<Props> {
  state = {
    calendarOpened: false,
    date: undefined,
  }

  render() {
    const { isOpen, setWorklogModalOpen } = this.props;
    const { calendarOpened, date } = this.state;

    return (
      <ModalDialog
        isOpen={isOpen}
        onClose={() => setWorklogModalOpen(false)}
        onDialogDismissed={() => setWorklogModalOpen(false)}
        footer={
          <Flex row style={{ justifyContent: 'flex-end' }}>
            <ButtonGroup>
              <Button appearance="primary">
                Create
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
              <Calendar onUpdate={date => this.setState({ date, calendarOpened: false })} />
            </CalendarContainer>
          }
          <Flex row>
            <div style={{ width: '35%', marginRight: 10 }}>
              <SingleSelect
                items={timeOptions}
                label="From"
                shouldFitContainer
                placeholder="16:30"
              />
            </div>
            <div style={{ width: '35%' }}>
              <SingleSelect
                items={timeOptions}
                label="To"
                placeholder="17:30"
                shouldFitContainer
              />
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
