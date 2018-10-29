// @flow
import React, {
  Component,
} from 'react';
import {
  Field,
  reduxForm,
} from 'redux-form';

import type {
  FormProps,
} from 'redux-form';

import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';

import {
  ReduxFormComponents,
} from 'components';
import {
  lockBlue,
} from 'utils/data/svg';

import {
  ContentInner,
  ContentStep,
  Form,
  PrimaryButton,
  Error,
  Lock,
  ContentIconContainer,
  BackButtonContainer,
  Title,
  Subtitle,
} from '../styled';


type Props = {
  authError: string,
  onContinue: () => void,
  isActiveStep: boolean,
  onBack: () => void,
  authRequestInProcess: boolean,
} & FormProps


class SelfHostLoginStep extends Component<Props> {
  // Need it because of animation between steps
  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isActiveStep && nextProps.isActiveStep) {
      setTimeout(() => {
        if (this.usernameInput && this.usernameInput.getRenderedComponent) {
          try {
            this.usernameInput.getRenderedComponent().input.focus();
          } catch (err) {
            console.log(err);
          }
        }
      }, 500);
    }
  }

  usernameInput: any;

  render() {
    const {
      authError,
      onContinue,
      isActiveStep,
      onBack,
      handleSubmit,
      authRequestInProcess,
    } = this.props;
    return (
      <ContentInner
        isActiveStep={isActiveStep}
        step={2}
      >
        <Form onSubmit={handleSubmit(onContinue)}>
          <ContentIconContainer>
            <Lock src={lockBlue} alt="" width="18" />
          </ContentIconContainer>
          <ContentStep>
            <Title>
            Enter your credentials
            </Title>,
            <Subtitle>
            Please fill in your JIRA account
            </Subtitle>
            <Field
              name="username"
              type="text"
              placeholder="Enter username"
              withRef
              ref={(el) => {
                this.usernameInput = el;
              }}
              disabled={authRequestInProcess}
              component={ReduxFormComponents.Input}
            />
            <Field
              name="password"
              type="password"
              placeholder="Enter password"
              disabled={authRequestInProcess}
              component={ReduxFormComponents.Input}
            />
            <Error>{authError}</Error>
          </ContentStep>
          <PrimaryButton type="submit">
            {authRequestInProcess
              ? <Spinner invertColor /> : 'Continue'
            }
          </PrimaryButton>
        </Form>
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

const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Requried';
  }
  if (!values.password) {
    errors.password = 'Requried';
  }
  return errors;
};

export default reduxForm({
  form: 'SelfHostLoginStep',
  validate,
})(SelfHostLoginStep);
