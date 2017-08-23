import React from 'react';
import { loginBackground, logoShadowed } from 'data/assets';
import { accountBoxIcon, lockIcon, jiraIcon } from 'data/svg';

import Flex from '../../../components/Base/Flex/Flex';

import {
  ButtonsContainer,
  PrimaryButton,
  SecondaryButton,
  Hint,
  FormGroup,
  FormIcon,
  FormInput,
  Form,
  Container,
  Logo,
} from './styled';

export default () => (
  <Flex
    column
    style={{
      background: `url(${loginBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: '50% 50%',
      height: '100%',
    }}
  >
    <Container>
      <Flex row centered>
        <Logo src={logoShadowed} alt="Chronos" />
      </Flex>
      <Form>
        <FormGroup>
          <FormIcon alt="" src={accountBoxIcon} />
          <FormInput
            placeholder="Username"
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <FormIcon alt="" src={lockIcon} />
          <FormInput
            placeholder="••••••••"
            type="password"
          />
        </FormGroup>
        <FormGroup>
          <FormIcon alt="" src={jiraIcon} />
          <FormInput
            placeholder="jira.atlassin.com"
            type="text"
          />
        </FormGroup>
      </Form>
      <ButtonsContainer>
        <PrimaryButton>Login</PrimaryButton>
        <SecondaryButton>Oauth</SecondaryButton>
        <Hint>What is Chronos?</Hint>
      </ButtonsContainer>
    </Container>
  </Flex>
);
