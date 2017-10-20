// @flow
import React from 'react';
import type { StatelessFunctionalComponent, Node } from 'react';
import { CheckboxStateless as Checkbox } from '@atlaskit/checkbox';

import { OptionContainer, OptionLabel, OptionImage } from './styled';

import type { FilterOption } from '../../../types';

type Props = {
  option: FilterOption,
  onChange: any,
  showIcons: boolean,
  isChecked: boolean,
}

const FilterItem: StatelessFunctionalComponent<Props> = ({
  option,
  onChange,
  showIcons,
  isChecked,
}: Props): Node => {
  const { id, iconUrl, name }: FilterOption = option;

  const label: Node = (
    <OptionLabel>
      {showIcons && iconUrl && iconUrl[iconUrl.length - 1] !== '/' &&
        <OptionImage alt="" src={iconUrl} />
      }
      {name}
    </OptionLabel>
  );

  return (
    <OptionContainer>
      <Checkbox
        isChecked={isChecked}
        value={isChecked ? 'true' : 'false'}
        name={name}
        label={label}
        onChange={() => onChange(id, isChecked)}
      />
    </OptionContainer>
  );
};

export default FilterItem;
