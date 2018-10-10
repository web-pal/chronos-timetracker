// @flow
import React from 'react';

import {
  AkFieldRadioGroup as RadioButtonGroup,
} from '@atlaskit/field-radio-group';

import {
  stj,
} from 'utils/time-util';

import {
  path,
} from 'ramda';

import type {
  Issue,
} from 'types';

import {
  Flex,
  TextField,
} from 'components';

import {
  InputExample,
} from './styled';

type Props = {
  issue: Issue,
  value: 'auto' | 'new' | 'leave' | 'manual',
  onChange: Function,
  onReduceByChange: Function,
  onNewChange: Function,
  newValue: string,
  reduceByValue: string,
};

const RemainingEstimatePicker = ({
  issue,
  value,
  onChange,
  onReduceByChange,
  onNewChange,
  newValue,
  reduceByValue,
}: Props) => {
  const timeestimate = path(['fields', 'timeestimate'], issue);

  const remainingEstimateOptions = [
    {
      name: 'auto',
      value: 'auto',
      label: 'Adjust automatically',
      isSelected: value === 'auto',
    },
    {
      name: 'leave',
      value: 'leave',
      label: `Use existing estimate of ${stj((timeestimate || 0))}`,
      isSelected: value === 'leave',
    },
    {
      name: 'new',
      value: 'new',
      label: (
        <Flex alignCenter>
          Set to&nbsp;
          <TextField
            value={newValue}
            onChange={e => onNewChange(e.target.value)}
            isLabelHidden
            isDisabled={value !== 'new'}
          />
          <InputExample>(eg. 2h 10m)</InputExample>
        </Flex>
      ),
      isSelected: value === 'new',
    },
    {
      name: 'manual',
      value: 'manual',
      label: (
        <Flex alignCenter style={{ marginTop: 4 }}>
          Reduce by&nbsp;
          <TextField
            value={reduceByValue}
            onChange={e => onReduceByChange(e.target.value)}
            isLabelHidden
            isDisabled={value !== 'manual'}
          />
          <InputExample>(eg. 40m)</InputExample>
        </Flex>
      ),
      isSelected: value === 'manual',
    },
  ];

  return !!timeestimate &&
    (
      <Flex column>
        <RadioButtonGroup
          label="Remaining Estimate"
          items={remainingEstimateOptions}
          onRadioChange={e => onChange(e.target.value)}
        />
      </Flex>
    );
};

export default RemainingEstimatePicker;
