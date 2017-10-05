// @flow
import { createSelector } from 'reselect';
import type { SettingsState, LocalDesktopSettings } from '../types';

export const getDispersion =
  ({ settings }: { settings: SettingsState }): string => settings.dispersion;

export const getInterval =
  ({ settings }: { settings: SettingsState }): string => settings.interval;

export const getScreenshotsPeriod =
  ({ settings }: { settings: SettingsState }): number => settings.screenshotsPeriod;

export const getScreenshotsQuantity =
  ({ settings }: { settings: SettingsState }): number => settings.screenshotsQuantity;

export const getScreenshotsEnabled =
  ({ settings }: { settings: SettingsState }): string => settings.screenshotsEnabled;

export const getSettingsModalTab =
  ({ settings }: { settings: SettingsState }): string => settings.modalTab;

export const getScreenshotsEnabledUsers =
  ({ settings }: { settings: SettingsState }): Array<string> => settings.screenshotsEnabledUsers;

export const getLocalDesktopSettings = ({
  settings,
}: { settings: SettingsState }): LocalDesktopSettings => settings.localDesktopSettings;

export const getScreenshotsSettings = createSelector(
  [
    getScreenshotsEnabled,
    getScreenshotsEnabledUsers,
    getScreenshotsQuantity,
    getScreenshotsPeriod,
  ],
  (screenshotsEnabled, screenshotsEnabledUsers, screenshotsQuantity, screenshotPeriod) => ({
    screenshotsEnabled, screenshotsEnabledUsers, screenshotsQuantity, screenshotPeriod,
  }),
);

