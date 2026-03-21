import http, { type SearchResults } from "@services/http";

export type Subscription = {
  id: number;
  plan: string;
  start: Date;
  end: Date;
  totalAmountCent: number;
  currency: string;
  stripSubscriptionId: string;
  status: string;
  canceledAt?: Date;
};

const getMySubscriptionHistory = async (
  cursor?: string,
  limit?: number,
): Promise<SearchResults<Subscription>> => {
  const params = new URLSearchParams();

  if (cursor) params.append("cursor", cursor);
  if (limit) params.append("limit", limit.toString());

  return http.get(
    http.apiBaseURLs.api,
    `subscriptions?${params.toString}`,
    undefined,
  );
};

const getMyActiveSubscription = async (): Promise<Subscription> => {
  return http.get(http.apiBaseURLs.api, "subscriptions/active", undefined);
};

export const subscriptionsService = {
  getMySubscriptionHistory,
  getMyActiveSubscription,
};
