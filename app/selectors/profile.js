// @flow
import type {
  ProfileState,
  User,
} from 'types';


export const getUserData =
  ({
    profile,
  }: {
    profile: ProfileState,
  }): User | null =>
    profile.userData;

export const getSelfKey =
  ({
    profile,
  }: {
    profile: ProfileState,
  }): string | null =>
    profile.userData && profile.userData.key;
