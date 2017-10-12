// @flow
import React from 'react';
import type{ StatelessFunctionalComponent, Node } from 'react';
import { CheckboxStateless as Checkbox, CheckboxGroup } from '@atlaskit/checkbox';
import { H100 } from 'styles/typography';
import { Flex } from 'components';

import { SettingsSectionContent, ContentLabel } from './styled';
import type { LocalDesktopSettings } from '../../../types';

type Props = {
  settings: LocalDesktopSettings,
  setTraySettings: {
    (value: boolean): any,
  }
}

const GeneralSettings: StatelessFunctionalComponent<Props> = ({
  settings,
  setTraySettings,
}: Props): Node => {
  const isIconHidden = !!settings.trayShowTimer;
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
            value={isIconHidden}
            name="trayShowTimer"
            label="Hide tray icon"
            onChange={() => setTraySettings(!isIconHidden)}
          />
          <Checkbox
            isChecked={isTimerHidden}
            value={isTimerHidden}
            name="trayShowTimer"
            label="Hide timer in tray (TODO)"
            onChange={() => alert('TODO')}
          />
        </CheckboxGroup>
      </Flex>
    </SettingsSectionContent>
  );
};

export default GeneralSettings;
