const containsSomeWords = (base: string, check: string) => {
  const baseLowercase = base.toLocaleLowerCase();
  const checkLowercase = check.toLocaleLowerCase();

  const words = checkLowercase.trim().split(/\s+/);
  return words.some((word) => baseLowercase.includes(word));
};

export const CompareUtils = {
  containsSomeWords,
};
