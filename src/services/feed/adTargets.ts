import http from "@services/http";

export type AdTargetPost = {
  targetType: string;
  targetValue: string;
  stripeItemId: string;
  weight: number;
};

export type AdTarget = AdTargetPost & {
  id: number;
  adId: number;
  futureWeight?: number;
  isPrimary: boolean;
};

const getAdTargetsByAdId = async (id: number): Promise<AdTarget> => {
  return await http.get(http.apiBaseURLs.api, `adTargets/${id}`, undefined);
};

const decreaseAdTargetWeight = async (
  id: number,
  targetId: number,
  decrement: number,
): Promise<void> => {
  let body = JSON.stringify(decrement);
  return await http.patch(
    http.apiBaseURLs.api,
    `adTargets/${id}/ad-target/${targetId}`,
    body,
    undefined,
  );
};

const cancelAdTarget = async (
  id: number,
  targetId: number,
  cancel: boolean,
): Promise<void> => {
  let body = JSON.stringify(cancel);
  return await http.patch(
    http.apiBaseURLs.api,
    `adTargets/${id}/ad-target/${targetId}/cancel`,
    body,
    undefined,
  );
};

export const adTargetsService = {
  getAdTargetsByAdId,
  decreaseAdTargetWeight,
  cancelAdTarget,
};
