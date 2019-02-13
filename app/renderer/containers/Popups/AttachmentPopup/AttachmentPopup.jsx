import React from 'react';
import {
  connect,
} from 'react-redux';


const AttachmentPopup = ({ attachments }) => (
  <div>
    {attachments.map(a => (
      <div key={a.id}>
        {a.id}
      </div>
    ))}
  </div>
);

function mapStateToProps(state) {
  return {
    attachments: state.attachmentReducer.attachments,
  };
}

const connector = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(AttachmentPopup);
