const containsSomeWords = (base: string, check: string) => {
  const baseLowercase = base.toLocaleLowerCase();
  const checkLowercase = check.toLocaleLowerCase();

  const words = checkLowercase.trim().split(/\s+/);
  return words.some((word) => baseLowercase.includes(word));
};

const getFirstTwoJoined = (input: string) => {
  const parts = input.split(",");
  const firstTwo = parts.slice(0, 2).map(part => part.trim());
  return firstTwo.join(", ");
}

// budget

const getBudgetStr = (budget?: number) => {
  if (!budget)
    return "None";

  return "$".repeat(budget);
};

export const StringUtils = {
  containsSomeWords,
  getFirstTwoJoined,
  // budget
  getBudgetStr,
};
