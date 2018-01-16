// @flow
import React, { Component } from 'react';
import {
  Field,
} from 'redux-form';

import {
  ReduxFormComponents,
} from 'components';
import {
  peopleBlue,
} from 'data/svg';
import {
  ContentInner,
  PrimaryButton,
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
  loginError: string,
  onContinue: () => void,
}

class TeamStep extends Component<Props> {
  // Need it because of animation between steps
  componentWillReceiveProps(nextProps) {
    if (!this.props.isActiveStep && nextProps.isActiveStep) {
      setTimeout(() => {
        if (this.hostInput && this.hostInput.getRenderedComponent()) {
          try {
            this.hostInput.getRenderedComponent().input.focus();
          } catch (err) {
            console.log(err);
          }
        }
      }, 500);
    }
  }

  render() {
    const {
      isActiveStep,
      loginError,
      onContinue,
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
          <Error>{loginError}</Error>
        </ContentStep>
        <PrimaryButton onClick={onContinue}>
          Continue
        </PrimaryButton>
      </ContentInner>
    );
  }
}

export default TeamStep;
