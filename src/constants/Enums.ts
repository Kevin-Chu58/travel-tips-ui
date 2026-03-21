export const SubscriptionType = {
  MonthlyMember: 1,
  ThreeMonthMember: 2,
  SixMonthMember: 3,
  YearlyMember: 4,
} as const;

export type SubscriptionType =
  (typeof SubscriptionType)[keyof typeof SubscriptionType];
