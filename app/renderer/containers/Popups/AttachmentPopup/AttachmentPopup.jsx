import React, {
  Component,
} from 'react';
import {
  connect,
} from 'react-redux';
import AttachmentPopupComponent from 'components/AttachmentPopup';
import LoaderAttachmentPopup from 'components/AttachmentPopup/LoaderAttachment';

class AttachmentPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { attachments } = this.props;
    if (nextProps.attachments.length !== attachments.length) {
      this.setState({
        activeIndex: 0,
      });
    }

    if (nextProps.activeIndex !== null) {
      this.setState({
        activeIndex: nextProps.activeIndex,
      });
    }
  }


  selectAttachment = (index) => {
    this.setState({
      activeIndex: index,
    });
  };

  nextAttachment = () => {
    this.setState(prevState => ({
      activeIndex: prevState.activeIndex + 1,
    }));
  };

  prevAttachment = () => {
    this.setState(prevState => ({
      activeIndex: prevState.activeIndex - 1,
    }));
  };


  render() {
    const { activeIndex } = this.state;
    const { attachments } = this.props;


    return (
      <React.Fragment>
        {
          attachments.length !== 0 ? (
            <div>
              <AttachmentPopupComponent
                attachmentSize={attachments.length}
                activeIndex={activeIndex}
                attachmentItem={attachments[activeIndex]}
                attachment={attachments}
                nextAttachment={this.nextAttachment}
                prevAttachment={this.prevAttachment}
                selectAttachment={this.selectAttachment}
              />
            </div>
          ) : (
            <LoaderAttachmentPopup />
          )
        }
      </React.Fragment>
    );
  }
}


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
