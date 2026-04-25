import http from "@services/http";

export type BusinessPost = {
  name: string;
  website: string;
  address: string;
};

export type Business = BusinessPost & {
  id: number;
  status: string;
  imageId?: number;
  picture?: string;
};

export type BusinessPatch = {
  name?: string;
  website?: string;
  address?: string;
};

const getMyBusiness = async (): Promise<Business[]> => {
  return await http.get(http.apiBaseURLs.api, "businesses/my", undefined);
};

const getBusinessById = async (businessId: number): Promise<Business> => {
  return await http.get(
    http.apiBaseURLs.api,
    `businesses/${businessId}`,
    undefined,
  );
};

const getPendingBusinesses = async (): Promise<Business[]> => {
  return await http.get(http.apiBaseURLs.api, `businesses/pending`, undefined);
};

// const getBusinessByParams = async (
//   userId?: number,
//   status?: number,
// ): Promise<Business[]> => {
//   let params = new URLSearchParams();

//   if (userId) params.append("userId", userId.toString());
//   if (status) params.append("status", status.toString());

//   return await http.get(
//     http.apiBaseURLs.api,
//     `businesses?${params.toString()}`,
//     undefined,
//   );
// };

const postNewBusiness = async (
  newBusiness: BusinessPost,
): Promise<Business> => {
  let body = JSON.stringify(newBusiness);

  return await http.post(http.apiBaseURLs.api, "businesses", body, undefined);
};

const updateBusiness = async (
  id: number,
  businessPatch: BusinessPatch,
): Promise<Business> => {
  let body = JSON.stringify(businessPatch);

  return await http.patch(
    http.apiBaseURLs.api,
    `businesses/${id}`,
    body,
    undefined,
  );
};

const updateBusinessActiveStatus = async (
  id: number,
  isActive: boolean,
): Promise<string> => {
  let params = new URLSearchParams();
  params.append("isActive", isActive.toString());

  return await http.patch(
    http.apiBaseURLs.api,
    `businesses/${id}/active-status?${params.toString()}`,
    undefined,
    undefined,
  );
};

const updateBusinessStatus = async (
  id: number,
  status: number,
): Promise<string> => {
  let params = new URLSearchParams();
  params.append("status", status.toString());

  return await http.patch(
    http.apiBaseURLs.api,
    `businesses/${id}/status?${params.toString()}`,
    undefined,
    undefined,
  );
};

export const businessesService = {
  getMyBusiness,
  // getMyNonPendingBusiness,
  getBusinessById,
  getPendingBusinesses,
  postNewBusiness,
  updateBusiness,
  updateBusinessActiveStatus,
  updateBusinessStatus,
};
