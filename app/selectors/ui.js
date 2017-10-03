// @flow
import type { UiState, AuthFormStep, SidebarType } from '../types';

export const getAuthFormStep =
  ({ ui }: { ui: UiState }): AuthFormStep => ui.authFormStep;

export const getSidebarType =
  ({ ui }: { ui: UiState }): SidebarType => ui.sidebarType;

export const getSettingsModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.settingsModalOpen;

export const getSupportModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.supportModalOpen;

export const getAboutModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.aboutModalOpen;

export const getAlertModalOpen =
  ({ ui }: { ui: UiState }): boolean => ui.alertModalOpen;
