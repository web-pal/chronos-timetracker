import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { CheckboxStateless as Checkbox } from '@atlaskit/checkbox';

import { OptionContainer, OptionLabel, OptionImage } from './styled';
// StatusOptionLabel

const FilterOption = ({ option, handleCriteriaSet, showIcons }) => {
  const id = option.get('id');
  const iconUrl = option.get('iconUrl');
  const name = option.get('name');
  const isChecked = option.get('checked');

  const label = (
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
        label={name}
        onChange={() => handleCriteriaSet(id, isChecked)}
      />
    </OptionContainer>
  );
};

// {status ?
//   <StatusOptionLabel
//     htmlFor={name}
//     color={status.color}
//     bgColor={status.bgColor}
//   >
//     {label}
//   </StatusOptionLabel> :
//   <OptionLabel htmlFor={name}>
//     {label}
//   </OptionLabel>
// }

FilterOption.propTypes = {
  option: ImmutablePropTypes.map.isRequired,
  handleCriteriaSet: PropTypes.func.isRequired,
  showIcons: PropTypes.bool.isRequired,
};

export default FilterOption;
