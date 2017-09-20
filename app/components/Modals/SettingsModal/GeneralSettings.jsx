import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { CheckboxStateless as Checkbox, CheckboxGroup } from '@atlaskit/checkbox';

import Flex from '../../../components/Base/Flex/Flex';
import { SettingsSectionContent, ContentLabel } from './styled';
import { H100 } from '../../../styles/typography';

const GeneralSettings = ({ settings, setTraySettings }) => {
  const isIconHidden = !!settings.get('trayShowTimer');
  const isTimerHidden = false;

  return (
    <SettingsSectionContent>
      <ContentLabel>
        General
      </ContentLabel>
      <Flex column>
        <H100 style={{ margin: '0 0 4px 6px' }}>
          Configure whether to show icon and timer in the menu bar when tracking
        </H100>
        <CheckboxGroup>
          <Checkbox
            isChecked={isIconHidden}
            name="trayShowTimer"
            label="Hide tray icon"
            onChange={setTraySettings(!isIconHidden)}
          />
          <Checkbox
            isChecked={isTimerHidden}
            name="trayShowTimer"
            label="Hide timer in tray (TODO)"
            onChange={() => alert('TODO')}
          />
        </CheckboxGroup>
      </Flex>
    </SettingsSectionContent>
  );
};

GeneralSettings.propTypes = {
  settings: ImmutablePropTypes.map.isRequired,
  setTraySettings: PropTypes.func.isRequired,
};

export default GeneralSettings;
