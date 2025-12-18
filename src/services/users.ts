import http from "./http";

export type UserBasic = {
  id: number;
  username: string;
  userAgreement: boolean;
};

const getUserBasicInfo = async (): Promise<UserBasic> => {
  return await http.get(http.apiBaseURLs.api, "users/me", undefined);
};

const acceptUserAgreement = async (): Promise<boolean> => {
  return await http.patch(http.apiBaseURLs.api, "users/me/user-agreement", undefined);
};

export const usersService = {
  getUserBasicInfo,
  acceptUserAgreement,
};
