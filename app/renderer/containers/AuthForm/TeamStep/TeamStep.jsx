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
import type {
  Account,
} from 'types';

import {
  ReduxFormComponents,
} from 'components';
import {
  uiActions,
} from 'actions';
import {
  peopleBlue,
} from 'utils/data/svg';
import {
  ContentInner,
  PrimaryButton,
  DefaultButton,
  Lock,
  ContentIconContainer,
  Title,
  Subtitle,
  ContentStep,
  Form,
  Error,
} from '../styled';


type Props = {
  isActiveStep: boolean,
  accounts: Array<Account>,
  authError: string,
  dispatch: Function,
  onContinue: () => void,
} & FormProps

class TeamStep extends Component<Props> {
  // Need it because of animation between steps
  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isActiveStep && nextProps.isActiveStep) {
      setTimeout(() => {
        if (this.hostInput && this.hostInput.getRenderedComponent) {
          try {
            this.hostInput.getRenderedComponent().input.focus();
          } catch (err) {
            console.log(err);
          }
        }
      }, 500);
    }
  }

  hostInput: any;

  render() {
    const {
      isActiveStep,
      authError,
      onContinue,
      dispatch,
      accounts,
      handleSubmit,
    } = this.props;
    return (
      <ContentInner
        isActiveStep={isActiveStep}
        step={1}
      >
        <Form onSubmit={handleSubmit(onContinue)}>
          <ContentIconContainer>
            <Lock src={peopleBlue} alt="" width="24" />
          </ContentIconContainer>
          <ContentStep>
            <Title>Enter your team</Title>
            <Subtitle>Please fill in your JIRA host</Subtitle>
            <Field
              autoFocus
              name="team"
              type="text"
              placeholder="example.atlassian.net"
              withRef
              innerRef={(el) => {
                this.hostInput = el;
              }}
              component={ReduxFormComponents.UnderlineInput}
            />
            <Error>{authError}</Error>
          </ContentStep>
          <PrimaryButton style={{ marginTop: 40, marginBottom: 10 }} type="submit">
            Continue
          </PrimaryButton>
          {accounts.length > 0
          && (
          <DefaultButton onClick={() => dispatch(uiActions.setUiState('authFormStep', 0))}>
            Login to existing account
          </DefaultButton>
          )
        }
        </Form>
      </ContentInner>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.team) {
    errors.team = 'Requried';
  }
  return errors;
};

export default reduxForm({
  form: 'TeamStep',
  validate,
})(TeamStep);
