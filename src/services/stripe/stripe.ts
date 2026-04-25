import type { SubscriptionType } from "@constants/Enums";
import http from "@services/http";

export type StripeSessionRequest = {
  subscription: SubscriptionType;
};

export type StripeAdWeightRequest = {
  targetType: string;
  targetValue: string;
  weight: number;
};

export type StripePreviewInvoiceReponse = {
  currency: string;
  amountToPayNow: number;
  nextCycleTotal: number;
  startDate: Date;
};

export type StripeBillingCyclePreviewInvoiceResponse = {
  currency: string;
  nextBillingAmount: number;
  nextBillingDate: Date;
};

// create checkout sessions

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

const createAdWeightCheckoutSession = async (
  id: number,
  request: StripeAdWeightRequest,
): Promise<string> => {
  const body = JSON.stringify(request);
  return await http.post(
    http.apiBaseURLs.api,
    `stripe/create-session/${id}/ad-weight`,
    body,
    undefined,
  );
};

// preview invoices

const PreviewUpcomingBillingCycleInvoiceOnAdWeight = async (
  id: number
): Promise<StripeBillingCyclePreviewInvoiceResponse> => {
  return await http.post(
    http.apiBaseURLs.api,
    `stripe/preview-invoice/${id}/ad-weight/billing-cycle`,
    undefined,
    undefined,
  );
};

const PreviewUpcomingInvoiceOnAdWeight = async (
  id: number,
  request: StripeAdWeightRequest,
  adTargetId?: number,
): Promise<StripePreviewInvoiceReponse> => {
  const body = JSON.stringify(request);

  const params = new URLSearchParams();
  if (adTargetId) params.append("adTargetId", adTargetId.toString());

  return await http.post(
    http.apiBaseURLs.api,
    `stripe/preview-invoice/${id}/ad-weight?${params.toString()}`,
    body,
    undefined,
  );
};

// update subscription

const updateSubscriptionOnAdWeights = async (
  id: number,
  request: StripeAdWeightRequest,
  adTargetId?: number,
): Promise<void> => {
  const body = JSON.stringify(request);

  const params = new URLSearchParams();
  if (adTargetId) params.append("adTargetId", adTargetId.toString());

  return await http.post(
    http.apiBaseURLs.api,
    `stripe/update-subscription/${id}/ad-weight?${params.toString()}`,
    body,
    undefined,
  );
};

const cancelAdTarget = async (
  id: number,
  adTargetId: number,
): Promise<void> => {
  const params = new URLSearchParams();
  params.append("adTargetId", adTargetId.toString());

  return await http.post(
    http.apiBaseURLs.api,
    `stripe/update-subscription/${id}/cancel-ad-target?${params.toString()}`,
    undefined,
    undefined,
  );
};

export const stripesService = {
  // create checkout sessions
  createCheckoutSession,
  createAdWeightCheckoutSession,
  // preview invoices
  PreviewUpcomingBillingCycleInvoiceOnAdWeight,
  PreviewUpcomingInvoiceOnAdWeight,
  // update subscription
  updateSubscriptionOnAdWeights,
  cancelAdTarget,
};
