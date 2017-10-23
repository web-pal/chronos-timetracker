import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InlineDialog from '@atlaskit/inline-dialog';
import InlineEditor from '@atlaskit/inline-edit';
import SingleLineTextInput from '@atlaskit/input';
import { Flex } from 'components';
import { worklogsActions } from 'actions';
import { getWorklogComment } from 'selectors';

import { EditButton } from './styled';

class WorklogEditDialog extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      tempComment: props.worklogComment || '',
    };
  }

  setTempComment = (value) => this.setState({ tempComment: value });

  toggleDialog = () => this.setState({ dialogOpen: !this.state.dialogOpen })

  renderDialog = () => {
    const { setWorklogComment, worklogComment } = this.props;

    return (
      <div className="worklog-edit-popup" style={{ width: 300 }}>
        <h5>Edit worklog</h5>
        <Flex column>
          {/*
          <InlineEditor
            label="Worklog type"
          editView={<SingleLineTextInput
            isEditing
            isDisabled
            isInitiallySelected
            value={'Value'}
            onChange={e => console.log(e.target.value)}
              />}
              readView={<SingleLineTextInput isEditing={false} value={'Automatic'} />}
          onConfirm={() => {}}
          onCancel={() => console.log('cancel')}
          shouldConfirmOnEnter
        />
        */}
          <InlineEditor
            label="Comment"
            editView={<SingleLineTextInput
              isEditing
              isInitiallySelected
              value={this.state.tempComment}
              onChange={e => this.setTempComment(e.target.value)}
            />}
            readView={(
              <div id="inline-edit-value">
                <SingleLineTextInput isEditing={false} value={this.props.worklogComment || 'None'} />
              </div>
            )}
            onConfirm={() => setWorklogComment(this.state.tempComment)}
            onCancel={() => this.setTempComment('')}
            shouldConfirmOnEnter
          />
        </Flex>
      </div>
    );
  }

  render() {
    return (
      <div>
        <InlineDialog
          content={this.renderDialog()}
          isOpen={this.state.dialogOpen}
          onClose={(e) => {
            // Atlaskit HACK.
            // without it inline dialog gets closed on clicking inline-edit action buttons
            const path = e.event.path;
            const shouldClose = !path.some(el => el.className === 'worklog-edit-popup');
            if (shouldClose) {
              this.setState({ dialogOpen: false });
            }
          }}
          position="bottom left"
        >
          <EditButton
            size="medium"
            primaryColor="#172B4D"
            secondaryColor="white"
            label="Toggle Tracking View"
            onClick={this.toggleDialog}
          />
        </InlineDialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    worklogComment: getWorklogComment(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(worklogsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WorklogEditDialog);
