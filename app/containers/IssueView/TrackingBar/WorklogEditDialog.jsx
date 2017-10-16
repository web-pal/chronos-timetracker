import React, { PureComponent } from 'react';
import InlineDialog from '@atlaskit/inline-dialog';
import InlineEditor from '@atlaskit/inline-edit';
import SingleLineTextInput from '@atlaskit/input';
import { Flex } from 'components';

import { EditButton } from './styled';

const WorklogEditDialogContent = (
  <div style={{ width: 300 }}>
    <h5>Edit worklog</h5>
    <Flex column>
      <InlineEditor
        label="Worklog type"
        editView={<SingleLineTextInput
          isEditing
          isInitiallySelected
          value={'Value'}
          onChange={e => console.log(e.target.value)}
        />}
        readView={<SingleLineTextInput isEditing={false} value={'Automatic'} />}
        onConfirm={() => {}}
        onCancel={() => console.log('cancel')}
      />
      <InlineEditor
        label="Note"
        editView={<SingleLineTextInput
          isEditing
          isInitiallySelected
          value={'Value'}
          onChange={e => console.log(e.target.value)}
        />}
        readView={<SingleLineTextInput isEditing={false} value={'None'} />}
        onConfirm={() => {}}
        onCancel={() => console.log('cancel')}
      />
    </Flex>
  </div>
);

export default class WorklogEditDialog extends PureComponent {
  state = {
    dialogOpen: false,
  }

  toggleDialog = () => this.setState({ dialogOpen: !this.state.dialogOpen })

  render() {
    return (
      <div>
        <InlineDialog
          content={WorklogEditDialogContent}
          isOpen={this.state.dialogOpen}
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
