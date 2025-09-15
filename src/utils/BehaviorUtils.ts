const sleep = (ms?: number) => new Promise(resolve => setTimeout(resolve, ms ?? 600));

export const BehaviorUtils = {
  sleep,
};
