// @flow
import type {
  ProfileState,
} from 'types';


export const getUserData =
  ({
    profile,
  }: {
    profile: ProfileState,
  }) =>
    profile.userData;

export const getSelfKey =
  ({
    profile,
  }: {
    profile: ProfileState,
  }): string | null =>
    profile.userData && profile.userData.key;
