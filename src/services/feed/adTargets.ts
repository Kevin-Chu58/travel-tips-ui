import http from "@services/http";

export const AdTargetTypes = ["region", "budget", "createdBy", "keyword"];

export type AdTargetPost = {
  targetType: string;
  targetValue: string;
  weight: number;
};

export type AdTarget = AdTargetPost & {
  id: number;
  adId: number;
  isPrimary: boolean;
};

export type AdTargetAnalytics = {
  id: number;
  rank: string;
  percent: number;
};

const getAdTargetsByAdId = async (id: number): Promise<AdTarget[]> => {
  return await http.get(http.apiBaseURLs.api, `adTargets/${id}`, undefined);
};

const getAdTargetAnalytics = async (
  id: number,
  targetId: number,
): Promise<AdTargetAnalytics> => {
  return await http.get(
    http.apiBaseURLs.api,
    `adTargets/${id}/ad-target/${targetId}/analytics`,
    undefined,
  );
};

const setAtTargetAsPrimary = async (
  id: number,
  targetId: number,
): Promise<void> => {
  return await http.patch(
    http.apiBaseURLs.api,
    `adTargets/${id}/ad-target/${targetId}/primary`,
    undefined,
    undefined,
  );
};

export const adTargetsService = {
  getAdTargetsByAdId,
  getAdTargetAnalytics,
  setAtTargetAsPrimary,
};
