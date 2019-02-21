// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  Checkbox,
} from '@atlaskit/checkbox';

import * as S from './styled';


type Props = {
  option: any,
  onChange: (id: string, isChecked: boolean) => void,
  showIcons: boolean,
  isChecked: boolean,
};

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
    <S.Option>
      <Checkbox
        isChecked={isChecked}
        value={isChecked ? 'true' : 'false'}
        name={name}
        label={(
          <S.OptionLabel>
            {showIcons && iconUrl && iconUrl[iconUrl.length - 1] !== '/'
              && <S.OptionImage alt="" src={iconUrl} />
            }
            {name}
          </S.OptionLabel>
        )}
        onChange={() => onChange(id, isChecked)}
      />
    </S.Option>
  );
};

export default FilterItem;
