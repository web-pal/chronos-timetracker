// @flow
import type { ProfileState, UserData } from '../types';

export const getAuthorized =
  ({ profile }: { profile: ProfileState }): boolean => profile.authorized;

export const getHost =
  ({ profile }: { profile: ProfileState }): string | null => profile.host;

export const getUserData =
  ({ profile }: { profile: ProfileState }): UserData | null => profile.userData;

export const getLoginError =
  ({ profile }: { profile: ProfileState }): string => profile.loginError;
