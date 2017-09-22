// TODO: delete state from this component
import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ModalDialog from '@atlaskit/modal-dialog';
import ButtonGroup from '@atlaskit/button-group';
import Button from '@atlaskit/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { remote } from 'electron';

import * as uiActions from '../../../actions/ui';

import GeneralSettings from './GeneralSettings';
import NotificationsSettings from './NotificationsSettings';

import Flex from '../../../components/Base/Flex/Flex';
import {
  Separator,
  SettingsSectionLabel,
} from './styled';
import { H700 } from '../../../styles/typography';
import { ModalContentContainer } from '../../../styles/modals';

const sharedObj = remote.getGlobal('sharedObj');

class SettingsModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    setShowSettingsModal: PropTypes.func.isRequired,
    setLocalDesktopSettings: PropTypes.func.isRequired,
    getLocalDesktopSettings: PropTypes.func.isRequired,
  };

  state = { tab: 'General' };

  componentDidMount() {
    this.props.getLocalDesktopSettings();
  }

  setTraySettings = value => () => {
    sharedObj.trayShowTimer = value;
    this.props.setLocalDesktopSettings('trayShowTimer', value);
  }

  onClose = () => {
    this.props.setShowSettingsModal(false);
  }

  render() {
    const { isOpen, settings, setLocalDesktopSettings } = this.props;
    const { tab } = this.state;

    return (
      <ModalDialog
        isOpen={isOpen}
        onClose={this.onClose}
        onDialogDismissed={this.onClose}
        footer={(
          <Flex row style={{ justifyContent: 'flex-end' }}>
            <ButtonGroup>
              <Button
                appearance="default"
                onClick={this.onClose}
              >
                Close
              </Button>
            </ButtonGroup>
          </Flex>
    )}
      >
        <ModalContentContainer>
          <H700 style={{ marginBottom: 28, display: 'block' }}>Settings</H700>
          <Flex row style={{ height: 250 }}>
            <Flex column style={{ width: 85 }}>
              <SettingsSectionLabel
                active={tab === 'General'}
                onClick={() => this.setState({ tab: 'General' })}
              >
                General
              </SettingsSectionLabel>
              <SettingsSectionLabel
                active={tab === 'Notifications'}
                onClick={() => this.setState({ tab: 'Notifications' })}
              >
                Notifications
              </SettingsSectionLabel>
            </Flex>
            <Separator />
            {tab === 'General' &&
              <GeneralSettings
                settings={settings}
                setTraySettings={this.setTraySettings}
              />
            }
            {tab === 'Notifications' &&
              <NotificationsSettings
                settings={settings}
                setLocalDesktopSettings={setLocalDesktopSettings}
              />
            }
          </Flex>
        </ModalContentContainer>
      </ModalDialog>
    );
  }
}

function mapStateToProps({ ui, settings }) {
  return {
    isOpen: ui.showSettingsModal,
    settings: settings.localDesktopSettings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(uiActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
