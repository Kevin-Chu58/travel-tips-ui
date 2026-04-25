const containsSomeWords = (base: string, check: string) => {
  const baseLowercase = base.toLocaleLowerCase();
  const checkLowercase = check.toLocaleLowerCase();

  const words = checkLowercase.trim().split(/\s+/);
  return words.some((word) => baseLowercase.includes(word));
};

const getFirstTwoJoined = (input: string) => {
  const parts = input.split(",");
  const firstTwo = parts.slice(0, 2).map((part) => part.trim());
  return firstTwo.join(", ");
};

const slugify = (input: string) => {
  return (
    input
      .toLowerCase()
      .trim()
      // normalize accented characters (é → e, ü → u)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // replace non-alphanumeric with hyphens
      .replace(/[^a-z0-9]+/g, "-")
      // remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
};

// budget

const getBudgetStr = (budget?: number) => {
  if (!budget) return "None";

  return "$".repeat(budget);
};

// cost display

const formatCurrency = (
  amountInSmallestUnit: number,
  currencyCode: string,
  locale: string = "en-US",
) => {
  const amount = amountInSmallestUnit / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};

// markdown identifier
const BOLD_IDENT = "**";
const ITALIC_IDENT = "_";
const STRIKE_THROUGH_IDENT = "~";
const HEADER1_IDENT = "# ";
const HEADER2_IDENT = "## ";
const HEADER3_IDENT = "### ";
const LIST_IDENT = "- ";
const LIST_ORDERED_IDENT = "1. ";
const LINK_IDENT = "[text](url)";
const IMAGE_IDENT = "![text](url)";

// markdown utils
const isStylingMet = (
  text: string,
  identifier: string,
  prefix: boolean = false,
) => {
  if (prefix) {
    return text.length >= identifier.length && text.startsWith(identifier);
  }

  return (
    text.length >= identifier.length * 2 &&
    text.startsWith(identifier) &&
    text.endsWith(identifier)
  );
};

export const StringUtils = {
  containsSomeWords,
  getFirstTwoJoined,
  slugify,
  // budget
  getBudgetStr,
  // price display
  formatCurrency,
  // markdown identifier
  BOLD_IDENT,
  ITALIC_IDENT,
  STRIKE_THROUGH_IDENT,
  HEADER1_IDENT,
  HEADER2_IDENT,
  HEADER3_IDENT,
  LIST_IDENT,
  LIST_ORDERED_IDENT,
  LINK_IDENT,
  IMAGE_IDENT,
  // markdown utils
  isStylingMet,
};
