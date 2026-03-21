import type { SubscriptionType } from "@constants/Enums";
import http from "@services/http";

export type StripeSessionRequest = {
  subscription: SubscriptionType;
  // isSubscription: boolean;
};

const createCheckoutSession = async (
  request: StripeSessionRequest,
): Promise<string> => {
  const body = JSON.stringify(request);
  return await http.post(
    http.apiBaseURLs.api,
    "stripe/create-session",
    body,
    undefined,
  );
};

export const stripesService = {
  createCheckoutSession,
};
