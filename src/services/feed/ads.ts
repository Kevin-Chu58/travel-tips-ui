import http from "@services/http";

export type AdPost = {
  title: string;
  text?: string;
  linkLabel?: string;
  link?: string;
  templateId: number;
  imageFile: Blob;
};

export type Ad = AdPost &
  BusinessExtend & {
    id: number;
    imageId: number;
    businessId: number;
    picture?: string;
    stripeSubscriptionId?: string;
    subStatus?: string;
    status: string;
  };

export type AdPatch = {
  title?: string;
  text?: string;
  linkLabel?: string;
  link?: string;
  templateId?: number;
  imageFile?: Blob;
};

export type BusinessExtend = {
  businessName?: string;
  businessLogo?: string; // picture
};

// ad sub logs

export type AdSubLog = {
  id: number;
  adId: number;
  time: Date;
  note: string;
  oldValue?: number;
  newValue?: number;
};

const getMyAdByBusinessId = async (businessId: number): Promise<Ad[]> => {
  return await http.get(
    http.apiBaseURLs.api,
    `ads/my/${businessId}`,
    undefined,
  );
};

const getAdsByParams = async (
  userId?: number,
  businessId?: number,
  status?: number,
): Promise<Ad[]> => {
  let params = new URLSearchParams();
  if (userId) params.append("userId", userId.toString());
  if (businessId) params.append("businessId", businessId.toString());
  if (status) params.append("status", status.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `ads?${params.toString()}`,
    undefined,
  );
};

const getAdById = async (id: number): Promise<Ad> => {
  return await http.get(http.apiBaseURLs.api, `ads/${id}`, undefined);
};

const postNewAd = async (id: number, newAd: AdPost): Promise<Ad> => {
  const formData = new FormData();

  formData.append("title", newAd.title);
  formData.append("text", newAd.text || "");
  formData.append("linkLabel", newAd.linkLabel || "");
  formData.append("link", newAd.link || "");
  formData.append("templateId", newAd.templateId.toString());
  formData.append("imageFile", newAd.imageFile || "");

  return await http.post(
    http.apiBaseURLs.api,
    `ads/${id}`,
    formData,
    undefined,
    false,
  );
};

const updateAd = async (id: number, adPatch: AdPatch): Promise<Ad> => {
  const formData = new FormData();

  formData.append("title", adPatch.title || "");
  formData.append("text", adPatch.text || "");
  formData.append("linkLabel", adPatch.linkLabel || "");
  formData.append("link", adPatch.link || "");
  formData.append("templateId", adPatch.templateId?.toString() || "");
  formData.append("imageFile", adPatch.imageFile || "");

  return await http.patch(
    http.apiBaseURLs.api,
    `ads/${id}`,
    formData,
    undefined,
    false,
  );
};

const updateAdActiveStatus = async (
  id: number,
  isActive: boolean,
): Promise<string> => {
  let params = new URLSearchParams();
  params.append("isActive", isActive.toString());

  return await http.patch(
    http.apiBaseURLs.api,
    `ads/${id}/active-status?${params.toString()}`,
    undefined,
    undefined,
  );
};

const updateAdStatus = async (
  id: number,
  status: number,
  reason?: string,
): Promise<string> => {
  let params = new URLSearchParams();
  params.append("status", status.toString());
  if (reason) params.append("reason", reason.toString());

  return await http.patch(
    http.apiBaseURLs.api,
    `ads/${id}/status?${params.toString()}`,
    undefined,
    undefined,
  );
};

// ad sub logs

const getAdSubLogs = async (id: number): Promise<AdSubLog[]> => {
  return await http.get(http.apiBaseURLs.api, `ads/${id}/logs`, undefined);
};

export const adsService = {
  getMyAdByBusinessId,
  getAdsByParams,
  getAdById,
  postNewAd,
  updateAd,
  updateAdActiveStatus,
  updateAdStatus,
  // ad sub logs
  getAdSubLogs,
};
