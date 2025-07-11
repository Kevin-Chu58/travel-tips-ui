import http from "./http";

export type UserBasic = {
  id: number;
  name: string;
  email: string;
};

const getUserBasicInfo = async (token: string): Promise<UserBasic> => {
  return await http.get(http.apiBaseURLs.api, "users/me", undefined, token);
};

export const usersService = {
  getUserBasicInfo,
};
