import http from "./http";

export type UserBasic = {
  id: number;
  username: string;
};

const getUserBasicInfo = async (): Promise<UserBasic> => {
  return await http.get(http.apiBaseURLs.api, "users/me", undefined);
};

export const usersService = {
  getUserBasicInfo,
};
