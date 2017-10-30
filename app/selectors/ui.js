// @flow
import type { UiState, AuthFormStep, SidebarType, TabLabel, UpdateInfo } from '../types';

export const getAuthFormStep =
  ({ ui }: { ui: UiState }): AuthFormStep => ui.authFormStep;

export const getSidebarType =
  ({ ui }: { ui: UiState }): SidebarType => ui.sidebarType;

export const getIssueViewTab =
  ({ ui }: { ui: UiState }): TabLabel => ui.issueViewTab;

export const getUpdateCheckRunning =
  ({ ui }: { ui: UiState }): boolean => ui.updateCheckRunning;

export const getUpdateAvailable =
  ({ ui }: { ui: UiState }): UpdateInfo | null => ui.updateAvailable;

export const getUpdateFetching =
  ({ ui }: { ui: UiState }): boolean => ui.updateFetching;

export const getSettingsModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.settingsModalOpen;

export const getSupportModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.supportModalOpen;

export const getAboutModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.aboutModalOpen;

export const getAlertModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.alertModalOpen;

export const getConfirmDeleteWorklogModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.confirmDeleteWorklogModalOpen;

export const getWorklogModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.worklogModalOpen;

export const getSidebarFiltersOpen =
  ({ ui }: { ui: UiState }): boolean => ui.sidebarFiltersOpen;

export const getScreenshotsAllowed =
  ({ ui }: { ui: UiState }): boolean => ui.screenshotsAllowed;
