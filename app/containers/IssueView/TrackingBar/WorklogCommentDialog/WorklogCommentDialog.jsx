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
};

type State = {
  dialogOpen: boolean,
  isEditing: boolean,
};

class WorklogCommentDialog extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      dialogOpen: false,
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
    this.setState({
      dialogOpen: !this.state.dialogOpen,
      isEditing: !this.state.dialogOpen,
    });
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
          isOpen={this.state.dialogOpen}
          onClose={(e) => {
            // Atlaskit HACK.
            // without it inline dialog gets closed on clicking inline-edit action buttons
            const { path } = e.event;
            const shouldClose = !path.some(el => el.className === 'worklog-edit-popup');
            if (shouldClose) {
              this.setState({
                dialogOpen: false,
                isEditing: true,
              });
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
