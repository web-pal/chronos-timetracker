import React, {
  Component,
} from 'react';
import {
  connect,
} from 'react-redux';
import AttachmentPopupComponent from 'components/AttachmentPopup';
import LoaderAttachmentPopup from 'components/AttachmentPopup/LoaderAttachment';

import {
  attachmentsActions,
}
  from 'actions';

const AttachmentPopup = (
  {
    attachments,
    activeIndex,
    dispatch,
  },
) => (
  <React.Fragment>
    {
        attachments.length !== 0 ? (
          <AttachmentPopupComponent
            attachmentSize={attachments.length}
            activeIndex={activeIndex}
            attachmentItem={attachments[activeIndex]}
            attachment={attachments}
            nextAttachment={() => dispatch(attachmentsActions.nextAttachment())}
            prevAttachment={() => dispatch(attachmentsActions.prevAttachment())}
            selectAttachment={index => dispatch(attachmentsActions.selectAttachment(index))}
          />
        ) : (
          <LoaderAttachmentPopup />
        )
    }
  </React.Fragment>
);

function mapStateToProps(state) {
  return {
    attachments: state.attachmentReducer.attachments,
    activeIndex: state.attachmentReducer.activeIndex,
  };
}


const connector = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(AttachmentPopup);
