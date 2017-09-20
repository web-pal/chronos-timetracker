// TODO: provide team in user info
import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import { avatarIcon, cogIcon } from 'data/svg';

import Flex from '../../../components/Base/Flex/Flex';

import * as profileActions from '../../../actions/profile';
import * as uiActions from '../../../actions/ui';

import {
  HeaderContainer,
  Name,
  ProfileInfo,
  SettingsIcon,
  ProfilePicture,
  Team,
  DropdownSeparator,
} from './styled';


const DropdownLogoutItem = styled(DropdownItem)`
  :hover {
    color: hsla(0, 90%, 55%, 1) !important;
  }
`;

const DropdownUpdateItem = styled(DropdownItem)`
  color: hsl(261, 90%, 55%) !important;
  :hover {
    background-color: hsla(261,85%,98%, 1) !important;
    color: hsl(261, 95%, 50%) !important;
  }
`;

class Header extends Component {
  onLogout = () => {
    const { logout } = this.props;
    const { getGlobal } = remote;
    const { running, uploading } = getGlobal('sharedObj');

    if (running) {
      // eslint-disable-next-line no-alert
      window.alert('Tracking in progress, save worklog before logout!');
    }
    if (uploading) {
      // eslint-disable-next-line no-alert
      window.alert('Currently app in process of saving worklog, wait few seconds please');
    }
    if (!running && !uploading) {
      logout();
    }
  }

  openModal = (modalName) => () => {
    this.props[`setShow${modalName}Modal`](true);
  }

  render() {
    const { userData } = this.props;
    // TODO: update available
    const updateAvailable = true;

    return (
      <HeaderContainer>
        <Flex row alignCenter>
          <ProfilePicture src={avatarIcon} alt="" />
          <ProfileInfo>
            <Name>{userData.get('displayName')}</Name>
            <Team>{'web-pal.atlassian.com'}</Team>
          </ProfileInfo>
        </Flex>
        <Flex row>
          <DropdownMenu
            trigger={<SettingsIcon src={cogIcon} alt="" />}
            triggerType="default"
            position="bottom right"
          >
            <DropdownItemGroup>
              <DropdownItem onClick={this.openModal('Settings')}>
                Settings
              </DropdownItem>
              <DropdownItem onClick={this.openModal('Support')}>
                Support and feedback
              </DropdownItem>
              <DropdownItem onClick={this.openModal('About')}>
                About
              </DropdownItem>
              {updateAvailable &&
                <DropdownSeparator />
              }
              {updateAvailable &&
              <DropdownUpdateItem onClick={() => alert('TODO: start update')}>
                Update available. Restart now
              </DropdownUpdateItem>
              }
              <DropdownSeparator />
              <DropdownLogoutItem onClick={this.onLogout}>
                Logout
              </DropdownLogoutItem>
            </DropdownItemGroup>
          </DropdownMenu>
        </Flex>
      </HeaderContainer>
    );
  }
}

Header.propTypes = {
  userData: ImmutablePropTypes.map.isRequired,
  logout: PropTypes.func.isRequired,
};

function mapStateToProps({ profile }) {
  return {
    userData: profile.userData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...profileActions,
    ...uiActions,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
