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
import * as S from '../styled';


type Props = {
  isActiveStep: boolean,
  accounts: Array<Account>,
  authError: string,
  dispatch: Function,
  onContinue: () => void,
} & FormProps;

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
      <S.ContentInner
        isActiveStep={isActiveStep}
        step={1}
      >
        <S.Form onSubmit={handleSubmit(onContinue)}>
          <S.ContentIcon>
            <S.Lock src={peopleBlue} alt="" width="24" />
          </S.ContentIcon>
          <S.ContentStep>
            <S.Title>Enter your team</S.Title>
            <S.Subtitle>Please fill in your JIRA host</S.Subtitle>
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
            <S.Error>{authError}</S.Error>
          </S.ContentStep>
          <S.PrimaryButton style={{ marginTop: 40, marginBottom: 10 }} type="submit">
            Continue
          </S.PrimaryButton>
          {accounts.length > 0
          && (
            <S.DefaultButton
              type="button"
              onClick={() => {
                dispatch(uiActions.setUiState({
                  authFormStep: 0,
                }));
              }}
            >
              Login to existing account
            </S.DefaultButton>
          )
        }
        </S.Form>
      </S.ContentInner>
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
