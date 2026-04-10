export const SubscriptionType = {
  MonthlyMember: 1,
  ThreeMonthMember: 2,
  SixMonthMember: 3,
  YearlyMember: 4,
} as const;

export type SubscriptionType =
  (typeof SubscriptionType)[keyof typeof SubscriptionType];

export const ImageType = {
  Banner: 1,
  Business: 2,
  Ad: 3,
} as const;

export type ImageType =
  (typeof ImageType)[keyof typeof ImageType];
