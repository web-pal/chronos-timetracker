// @flow
import React, { Component } from 'react';
import {
  Field,
} from 'redux-form';

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
  Form,
  Lock,
  ContentIconContainer,
  Title,
  Subtitle,
  ContentStep,
  Error,
} from '../styled';


type Props = {
  isActiveStep: boolean,
  accounts: Array<{| name: string, origin: string |}>,
  authError: string,
  dispatch: Function,
  onContinue: () => void,
}

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
        step={1}
      >
        <ContentIconContainer>
          <Lock src={peopleBlue} alt="" width="24" />
        </ContentIconContainer>
        <ContentStep>
          <Title>Enter your team</Title>
          <Subtitle>Please fill in your JIRA host</Subtitle>
          <Form>
            <Field
              autoFocus
              name="host"
              type="text"
              className="host"
              placeholder="example.atlassian.net"
              withRef
              ref={(el) => {
                this.hostInput = el;
              }}
              component={ReduxFormComponents.UnderlineInput}
            />
          </Form>
          <Error>{authError}</Error>
        </ContentStep>
        <PrimaryButton onClick={onContinue}>
          Continue
        </PrimaryButton>
        {accounts.length > 0 &&
          <DefaultButton onClick={() => dispatch(uiActions.setUiState('authFormStep', 0))}>
            Login to existing account
          </DefaultButton>
        }
      </ContentInner>
    );
  }
}

export default TeamStep;
