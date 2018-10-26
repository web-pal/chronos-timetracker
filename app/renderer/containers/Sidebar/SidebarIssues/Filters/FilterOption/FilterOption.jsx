// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  Checkbox,
} from '@atlaskit/checkbox';

import {
  OptionContainer,
  OptionLabel,
  OptionImage,
} from './styled';


type Props = {
  option: any,
  onChange: (id: string, isChecked: boolean) => void,
  showIcons: boolean,
  isChecked: boolean,
}

const FilterItem: StatelessFunctionalComponent<Props> = ({
  option,
  onChange,
  showIcons,
  isChecked,
}: Props): Node => {
  const {
    id,
    iconUrl,
    name,
  } = option;
  return (
    <OptionContainer>
      <Checkbox
        isChecked={isChecked}
        value={isChecked ? 'true' : 'false'}
        name={name}
        label={(
          <OptionLabel>
            {showIcons && iconUrl && iconUrl[iconUrl.length - 1] !== '/' &&
              <OptionImage alt="" src={iconUrl} />
            }
            {name}
          </OptionLabel>
        )}
        onChange={() => onChange(id, isChecked)}
      />
    </OptionContainer>
  );
};

export default FilterItem;
