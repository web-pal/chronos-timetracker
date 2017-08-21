import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loginBackground, logoShadowed } from 'data/assets';
import { accountBoxIcon, lockIcon, jiraIcon } from 'data/svg';

import Flex from '../components/Base/Flex/Flex';


class Login extends Component {
  static propTypes = {

  };

  render() {
    console.log(lockIcon);
    return (
      <div
        className="n-m"
        style={{
          background: `url(${loginBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: '50% 50%',
        }}
      >
        <Flex column spaceAround className="login-container">
          <Flex row centered>
            <img src={logoShadowed} alt="Chronos" className="login-logo" />
          </Flex>
          <Flex column alignCenter className="login-form">
            <div className="form-group login">
              <img alt="" src={accountBoxIcon} className="form-group__icon account" />
              <input
                className="login-input email"
                placeholder="Username"
              />
            </div>
            <div className="form-group login">
              <img alt="" src={lockIcon} className="form-group__icon lock" />
              <input
                className="login-input password"
                placeholder="••••••••"
                type="password"
              />
            </div>
            <div className="form-group login">
              <img alt="" src={jiraIcon} className="form-group__icon jira" />
              <input
                className="login-input team"
                placeholder="jira.atlassin.com"
              />
            </div>
          </Flex>
          <Flex column alignCenter className="login-btn-container">
            <button
              className="login-btn login-btn-primary"
            >Login</button>
            <button
              className="login-btn login-btn-secondary"
            >Oauth</button>
            <span className="chronos-info-link">What is Chronos?</span>
          </Flex>
        </Flex>
      </div>
    );
  }
}

function mapStateToProps({}) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
