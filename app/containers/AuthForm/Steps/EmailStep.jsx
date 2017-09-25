import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';

import { jiraIcon, lockBlue } from 'data/svg';
import { renderField } from '../Form';
import Flex from '../../../components/Base/Flex/Flex';

import {
  ContentInner,
  PrimaryButton,
  OauthButton,
  ContentSeparator,
  Error,
  Lock,
  ContentIconContainer,
  BackButtonContainer,
} from '../styled';

const EmailStep = ({
  error, onContinue, onJiraClick, isActiveStep, onBack, loginRequestInProcess,
}) => (
  <ContentInner isActiveStep={isActiveStep} step={2}>
    <ContentIconContainer>
      <Lock src={lockBlue} alt="" width="18" />
    </ContentIconContainer>
    <Flex column alignCenter style={{ width: '100%' }}>
      <OauthButton
        onClick={onJiraClick}
        disabled={loginRequestInProcess}
      >
        <img src={jiraIcon} alt="" style={{ height: 20 }} />
        Log in with JIRA
      </OauthButton>
      <ContentSeparator>OR</ContentSeparator>
      <Field
        name="username"
        placeholder="Enter email"
        component={renderField}
        type="text"
        autoFocus
        disabled={loginRequestInProcess}
      />
      <Field
        name="password"
        placeholder="Enter password"
        component={renderField}
        type="password"
        disabled={loginRequestInProcess}
      />
      <Error>{error}</Error>
    </Flex>
    <PrimaryButton onClick={onContinue}>
      {loginRequestInProcess ?
        <Spinner invertColor /> : 'Continue'
      }
    </PrimaryButton>
    <BackButtonContainer>
      <Button
        appearance="subtle"
        onClick={onBack}
      >
        Back
      </Button>
    </BackButtonContainer>
  </ContentInner>
);

EmailStep.propTypes = {
  error: PropTypes.string,
  onContinue: PropTypes.func.isRequired,
  onJiraClick: PropTypes.func.isRequired,
  isActiveStep: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  loginRequestInProcess: PropTypes.bool.isRequired,
};

EmailStep.defaultProps = {
  error: '',
};

export default EmailStep;
