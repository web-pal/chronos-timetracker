// @flow
import React, { PureComponent } from 'react';

import InlineDialog from '@atlaskit/inline-dialog';
import SingleLineTextInput from '@atlaskit/input';

import type {
  Issue,
  RemainingEstimate,
} from 'types';

import {
  InlineEditStateless,
} from '@atlaskit/inline-edit';

import {
  Flex,
  RemainingEstimatePicker,
} from 'components';

import {
  EditButton,
  EditButtonContainer,
} from './styled';

import WorklogCommentOptions from './WorklogCommentOptions';

type Props = {
  issue: Issue,
  comment: string | null,
  remainingEstimateValue: RemainingEstimate,
  remainingEstimateNewValue: string,
  remainingEstimateReduceByValue: string,
  onSetComment: (comment: string) => void,
  onRemainingEstimateChange: Function,
  onRemainingEstimateNewChange: Function,
  onRemainingEstimateReduceByChange: Function,
  dialogOpen: boolean,
  setDialogState: (dialogOpen: boolean) => void,
};

type State = {
  isEditing: boolean,
};

class WorklogCommentDialog extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEditing: true,
      comment: this.props.comment,
    };
  }

  onConfirm = () => {
    this.exitEditingMode();
    this.props.onSetComment(this.state.comment);
  };

  onCancel = () => {
    this.exitEditingMode();
    this.setState({ comment: this.props.comment });
  };

  toggleDialog = () => {
    const newState = !this.props.dialogOpen;
    this.setState({
      isEditing: newState,
    });
    this.props.setDialogState(newState);
  }

  enterEditingMode = () => {
    this.setState({
      isEditing: true,
    });
  };

  exitEditingMode = () => {
    this.setState({
      isEditing: false,
    });
  };

  renderDialog = () => (
    <div className="worklog-edit-popup" style={{ width: 350 }}>
      <h5>Edit worklog</h5>
      <Flex column>
        <InlineEditStateless
          label="Comment"
          isEditing={this.state.isEditing}
          editView={
            <SingleLineTextInput
              autoFocus
              isEditing
              isInitiallySelected
              value={this.state.comment}
              onChange={e => this.setState({ comment: e.target.value })}
            />
          }
          readView={(
            <div id="inline-edit-value">
              <SingleLineTextInput
                autoFocus
                isEditing={false}
                value={this.props.comment || 'None'}
              />
            </div>
          )}
          onEditRequested={this.enterEditingMode}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        />
        <WorklogCommentOptions />
        <RemainingEstimatePicker
          issue={this.props.issue}
          value={this.props.remainingEstimateValue}
          onChange={this.props.onRemainingEstimateChange}
          onReduceByChange={this.props.onRemainingEstimateReduceByChange}
          onNewChange={this.props.onRemainingEstimateNewChange}
          newValue={this.props.remainingEstimateNewValue}
          reduceByValue={this.props.remainingEstimateReduceByValue}
        />
      </Flex>
    </div>
  )

  render() {
    return (
      <EditButtonContainer>
        <InlineDialog
          content={this.renderDialog()}
          isOpen={this.props.dialogOpen}
          onClose={(e) => {
            // Atlaskit HACK.
            // without it inline dialog gets closed on clicking inline-edit action buttons
            const { path } = e.event;
            const shouldClose = !path.some(el =>
                el.className === 'worklog-edit-popup' ||
                el.className === 'worklog-edit-popup-shouldNotCLose');
            if (shouldClose) {
              this.setState({
                isEditing: true,
              });
              this.props.setDialogState(false);
            }
          }}
          position="bottom left"
        >
          <EditButton
            size="medium"
            primaryColor="white"
            secondaryColor="#172B4D"
            label="Toggle Tracking View"
            onClick={this.toggleDialog}
          />
        </InlineDialog>
      </EditButtonContainer>
    );
  }
}

export default WorklogCommentDialog;
