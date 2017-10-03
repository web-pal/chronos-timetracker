// @flow

import React from 'react';
import { Field, FormProps } from 'redux-form';
import { Flex } from 'components';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';
import { jiraIcon, lockBlue } from 'data/svg';

import { renderField } from '../Form';
import type { ProfileAction } from '../../../types';


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

type Props = {
  loginError: string,
  onContinue: () => ProfileAction,
  isActiveStep: boolean,
  onBack: () => ProfileAction,
  loginRequestInProcess: boolean,
} & FormProps

const EmailStep = ({
  loginError, onContinue, onJiraClick, isActiveStep, onBack, loginRequestInProcess,
}: Props) =>
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
      <Error>{loginError}</Error>
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
  </ContentInner>;

export default EmailStep;
