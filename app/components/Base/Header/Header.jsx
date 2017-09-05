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

class Header extends Component {
  onLogout = () => {
    const { logout } = this.props;
    const { getGlobal } = remote;
    const { running, uploading } = getGlobal('sharedObj');

    if (running) {
      window.alert('Tracking in progress, save worklog before logout!');
    }
    if (uploading) {
      window.alert('Currently app in process of saving worklog, wait few seconds please');
    }
    if (!running && !uploading) {
      logout();
    }
  }

  render() {
    const { userData } = this.props;

    return (
      <HeaderContainer>
        <Flex row alignCenter>
          <ProfilePicture src={avatarIcon} alt="" />
          <ProfileInfo>
            <Name>{userData.get('displayName')}</Name>
            <Team onClick={() => alert('Change team')}>{'web-pal.atlassian.com'}</Team>
          </ProfileInfo>
        </Flex>
        <Flex row>
          <DropdownMenu
            trigger={<SettingsIcon src={cogIcon} alt="" />}
            triggerType="default"
            onOpenChange={e => console.log('dropdown opened', e)}
            position="bottom right"
          >
            <DropdownItemGroup>
              <DropdownItem onClick={() => {}}>Settings</DropdownItem>
              <DropdownItem onClick={() => {}}>Support and feedback</DropdownItem>
              <DropdownItem onClick={() => {}}>About</DropdownItem>
              <DropdownSeparator />
              <DropdownLogoutItem onClick={this.onLogout}>Logout</DropdownLogoutItem>
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
  return bindActionCreators(profileActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
