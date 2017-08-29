import React from 'react';
import { loginBackground, logoShadowed } from 'data/assets';
import { accountBoxIcon, lockIcon, jiraIcon } from 'data/svg';

import Flex from '../../../components/Base/Flex/Flex';

import {
  Hint,
  Form,
  Container,
  Logo,
  Input,
  Button,
  OauthButton,
} from './styled';

export default () => (
  <Container style={{ height: '100%' }}>
    <Flex row centered>
      <Logo src={logoShadowed} alt="Chronos" />
    </Flex>
    <span
      style={{
        color: 'white',
        fontSize: 24,
        marginBottom: 40,
      }}
    >Log in to your account</span>
    <Form>
      <OauthButton>
        <img src={jiraIcon} alt="" style={{ height: 20 }} />
        Log in with JIRA
      </OauthButton>
      <span
        style={{
          margin: '30px 0px',
          color: 'rgba(0, 0, 0, .5)',
          fontSize: 12,
        }}
      >OR</span>
      <Input
        placeholder="Enter email"
        type="text"
        autoFocus
      />
      <Button>
        Continue
      </Button>
    </Form>
    <Hint>{"Can't log in?"}</Hint>
  </Container>
);
