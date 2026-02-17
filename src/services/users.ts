import http, { type SearchResults } from "./http";

export type UserSimple = {
  id: number;
  userId: string;
  username: string;
  picture?: string;
};

export type UserBasic = UserSimple & {
  email: string;
  userAgreement: boolean;
  isAdmin?: boolean;
  isWriter?: boolean;
};

export type UserProfileBasic = UserSimple & {
  isAdmin?: boolean;
  isWriter?: boolean;
  followerCount: number;
  followingCount: number;
  numTrips: number;
  numBookmarks: number;
  isFollowing?: boolean;
};

export type UserSearchParams = {
  userId: number;
  cursor?: string;
  limit?: number;
};

const getUserBasicInfo = async (): Promise<UserBasic> => {
  return await http.get(http.apiBaseURLs.api, "users/me", undefined);
};

const acceptUserAgreement = async (): Promise<boolean> => {
  return await http.patch(
    http.apiBaseURLs.api,
    "users/me/user-agreement",
    undefined,
    undefined,
  );
};

// user profile

const getUserProfile = async (auth0Id: string): Promise<UserProfileBasic> => {
  return await http.get(
    http.apiBaseURLs.api,
    `users/${auth0Id}/profile`,
    undefined,
  );
};

// user picture

const updateUserPicture = async (imageId: number): Promise<string> => {
  return await http.patch(
    http.apiBaseURLs.api,
    `users/me/picture/${imageId}`,
    undefined,
    undefined,
  );
};

// user follower

const getFollowers = async (
  params: UserSearchParams,
): Promise<SearchResults<UserSimple>> => {
  const _params = new URLSearchParams();

  _params.append("userId", params.userId.toString());
  if (params.cursor) _params.append("cursor", params.cursor);
  if (params.limit) _params.append("limit", params.limit.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `users/followers?${_params.toString()}`,
    undefined,
  );
};

const getFollowings = async (
  params: UserSearchParams,
): Promise<SearchResults<UserSimple>> => {
  const _params = new URLSearchParams();

  _params.append("userId", params.userId.toString());
  if (params.cursor) _params.append("cursor", params.cursor);
  if (params.limit) _params.append("limit", params.limit.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `users/followings?${_params.toString()}`,
    undefined,
  );
};

const followUser = async (id: number): Promise<void> => {
  return await http.post(
    http.apiBaseURLs.api,
    `users/${id}/follow`,
    undefined,
    undefined,
  );
};

const unfollowUser = async (id: number): Promise<void> => {
  return await http.del(
    http.apiBaseURLs.api,
    `users/${id}/unfollow`,
    undefined,
    undefined,
  );
};

export const usersService = {
  getUserBasicInfo,
  acceptUserAgreement,
  // user profile
  getUserProfile,
  // user picture
  updateUserPicture,
  // user follower
  getFollowers,
  getFollowings,
  followUser,
  unfollowUser,
};
