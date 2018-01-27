// @flow
import React, { Component } from 'react';
import {
  Field,
  FormProps,
} from 'redux-form';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';

import {
  ReduxFormComponents,
} from 'components';
import {
  jiraIcon,
  lockBlue,
} from 'data/svg';

import {
  ContentInner,
  ContentStep,
  PrimaryButton,
  OauthButton,
  ContentSeparator,
  Error,
  Lock,
  ContentIconContainer,
  BackButtonContainer,
  Title,
  Subtitle,
} from '../styled';

import type {
  ProfileAction,
} from '../../../types';


type Props = {
  loginError: string,
  onContinue: () => ProfileAction,
  isActiveStep: boolean,
  onBack: () => any,
  loginRequestInProcess: boolean,
  isPaidUser: boolean,
} & FormProps


class EmailStep extends Component<Props> {
  // Need it because of animation between steps
  componentWillReceiveProps(nextProps) {
    if (!this.props.isActiveStep && nextProps.isActiveStep) {
      setTimeout(() => {
        if (this.usernameInput && this.usernameInput.getRenderedComponent()) {
          try {
            this.usernameInput.getRenderedComponent().input.focus();
          } catch (err) {
            console.log(err);
          }
        }
      }, 500);
    }
  }

  render() {
    const {
      loginError,
      onContinue,
      onJiraClick,
      isActiveStep,
      onBack,
      loginRequestInProcess,
      isPaidUser,
    } = this.props;
    return (
      <ContentInner
        onKeyDown={(ev) => {
          if (ev.key === 'Enter') {
            ev.preventDefault();
            ev.stopPropagation();
            onContinue();
          }
        }}
        isActiveStep={isActiveStep}
        step={2}
      >
        <ContentIconContainer>
          <Lock src={lockBlue} alt="" width="18" />
        </ContentIconContainer>
        <ContentStep>
          {isPaidUser
            ? [
              <OauthButton
                key={1}
                onClick={onJiraClick}
                disabled={loginRequestInProcess}
              >
                <img src={jiraIcon} alt="" style={{ height: 20 }} />
                Log in with JIRA
              </OauthButton>,
              <ContentSeparator key={2}>OR</ContentSeparator>,
            ]
            : [
              <Title key={1}>
                Enter your credentials
              </Title>,
              <Subtitle key={2}>
                Please fill in your JIRA account
              </Subtitle>,
            ]
          }
          <Field
            name="username"
            type="text"
            placeholder="Enter email"
            withRef
            ref={(el) => {
              this.usernameInput = el;
            }}
            disabled={loginRequestInProcess}
            component={ReduxFormComponents.Input}
          />
          <Field
            name="password"
            type="password"
            placeholder="Enter password"
            disabled={loginRequestInProcess}
            component={ReduxFormComponents.Input}
          />
          <Error>{loginError}</Error>
        </ContentStep>
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
  }
}

export default EmailStep;
