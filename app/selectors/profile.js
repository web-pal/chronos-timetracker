// @flow
import type { ProfileState, User } from '../types';

export const getAuthorized =
  ({ profile }: { profile: ProfileState }): boolean => profile.authorized;

export const getHost =
  ({ profile }: { profile: ProfileState }): string | null => profile.host;

export const getUserData =
  ({ profile }: { profile: ProfileState }): User | null => profile.userData;

export const getSelfKey =
  ({ profile }: { profile: ProfileState }): string | null =>
    profile.userData && profile.userData.key;

export const getLoginError =
  ({ profile }: { profile: ProfileState }): string => profile.loginError;

export const getLoginFetching =
  ({ profile }: { profile: ProfileState }): boolean => profile.loginFetching;

export const getIsPaidUser =
  ({ profile }: { profile: ProfileState }): boolean => profile.isPaidUser;
