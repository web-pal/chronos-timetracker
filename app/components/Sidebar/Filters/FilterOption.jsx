import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { CheckboxStateless as Checkbox } from '@atlaskit/checkbox';

import { OptionContainer, OptionLabel, OptionImage } from './styled';
// StatusOptionLabel

const FilterOption = ({ option, handleCriteriaSet, showIcons }) => {
  const iconUrl = option.get('iconUrl');
  const name = option.get('name');
  const isChecked = option.get('checked');

  const label = (
    <OptionLabel>
      {showIcons && iconUrl && iconUrl[iconUrl.length - 1] !== '/' &&
        <OptionImage alt="" src={iconUrl} />
      }
      {option.get('name')}
    </OptionLabel>
  );

  return (
    <OptionContainer>
      <Checkbox
        isChecked={isChecked}
        name={name}
        label={label}
        onChange={() => handleCriteriaSet(option.get('id'), option.get('checked'))}
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
