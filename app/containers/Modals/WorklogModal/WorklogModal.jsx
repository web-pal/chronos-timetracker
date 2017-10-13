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
import  Tooltip from '@atlaskit/tooltip';
import { H700 } from 'styles/typography';
import { ModalContentContainer } from 'styles/modals';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Flex } from 'components';
import { uiActions } from 'actions';
import { getWorklogModalOpen } from 'selectors';

import {
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

class WorklogModal extends Component<Props> {
  state = {
    calendarOpened: false,
  }

  render() {
    const { isOpen, setWorklogModalOpen } = this.props;
    const { calendarOpened } = this.state;

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
        <ModalContentContainer style={{ height: 'auto' }}>
          <H700 style={{ display: 'block' }}>Add worklog</H700>
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
          <Tooltip
            position="right"
            description="Open calendar"
          >
            <Flex
              row
              style={{ alignItems: 'flex-end', position: 'relative' }}
            >
              <TextField
                label="Date"
                placeholder="09/10/2017"
              />
              <CalendarIconContainer
                onClick={() => this.setState({ calendarOpened: !calendarOpened })}
              >
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
            <Flex row style={{ marginTop: 5 }}>
              <Calendar onUpdate={console.log} />
            </Flex>
          }
          <Flex row>
            <div style={{ width: '30%', marginRight: 10 }}>
              <SingleSelect
                items={worklogTypes}
                label="From"
                shouldFitContainer
                placeholder="16:43"
              />
            </div>
            <div style={{ width: '30%' }}>
              <SingleSelect
                items={worklogTypes}
                label="To"
                placeholder="17:43"
                shouldFitContainer
              />
            </div>
          </Flex>
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
