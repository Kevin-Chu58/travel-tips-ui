import http from "./http";

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

// user picture

const updateUserPicture = async (imageId: number): Promise<string> => {
  return await http.patch(
    http.apiBaseURLs.api,
    `users/me/picture/${imageId}`,
    undefined,
    undefined,
  );
};

export const usersService = {
  getUserBasicInfo,
  acceptUserAgreement,
  // user picture
  updateUserPicture,
};
