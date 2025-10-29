import type { SortType } from "@constants/Types";

// helper to clone before sorting
const clone = (items: any[]) => [...items];

const sortIdAsc = (items: any[]) =>
  clone(items).sort((a, b) => a.id - b.id);

const sortIdDesc = (items: any[]) =>
  clone(items).sort((a, b) => b.id - a.id);

const sortNameAsc = (items: any[]) =>
  clone(items).sort((a, b) =>
    (a.name ?? "").toLowerCase().localeCompare((b.name ?? "").toLowerCase())
  );

const sortNameDesc = (items: any[]) =>
  clone(items).sort((a, b) =>
    (b.name ?? "").toLowerCase().localeCompare((a.name ?? "").toLowerCase())
  );

const sortTitleAsc = (items: any[]) =>
  clone(items).sort((a, b) =>
    (a.title ?? "").toLowerCase().localeCompare((b.title ?? "").toLowerCase())
  );

const sortTitleDesc = (items: any[]) =>
  clone(items).sort((a, b) =>
    (b.title ?? "").toLowerCase().localeCompare((a.title ?? "").toLowerCase())
  );

const sortDayAsc = (items: any[]) =>
  clone(items).sort((a, b) => a.numDays - b.numDays);

const sortDayDesc = (items: any[]) =>
  clone(items).sort((a, b) => b.numDays - a.numDays);

const sortNumHighlightsAsc = (items: any[]) =>
  clone(items).sort((a, b) => a.numHighlights - b.numHighlights);

const sortNumHighlightsDesc = (items: any[]) =>
  clone(items).sort((a, b) => b.numHighlights - a.numHighlights);

// sort types (unchanged)
export const sortTypeIdAsc = {
  label: "Id ASC",
  function: sortIdAsc,
} as SortType;

export const sortTypeIdDesc = {
  label: "Id DESC",
  function: sortIdDesc,
} as SortType;

export const sortTypeNameAsc = {
  label: "Name ASC",
  function: sortNameAsc,
} as SortType;

export const sortTypeNameDesc = {
  label: "Name DESC",
  function: sortNameDesc,
} as SortType;

export const sortTypeTitleAsc = {
  label: "Title ASC",
  function: sortTitleAsc,
} as SortType;

export const sortTypeTitleDesc = {
  label: "Title DESC",
  function: sortTitleDesc,
} as SortType;

export const sortTypeDayAsc = {
  label: "Days ASC",
  function: sortDayAsc,
} as SortType;

export const sortTypeDayDesc = {
  label: "Days DESC",
  function: sortDayDesc,
} as SortType;

export const sortTypeNumHighlightsAsc = {
  label: "No. Highlights ASC",
  function: sortNumHighlightsAsc,
} as SortType;

export const sortTypeNumHighlightsDesc = {
  label: "No. Highlights DESC",
  function: sortNumHighlightsDesc,
} as SortType;

// IMPORTANT: also clone here in case function forgets to
const sortList = (list: any[], sortTypes: SortType[], sortTypeIndex: number) => {
  const func = sortTypes[sortTypeIndex]?.function;
  if (!func) return [...list];
  return func([...list]); // ensure new array
};

const SortUtils = {
  sortIdAsc,
  sortIdDesc,
  sortNameAsc,
  sortNameDesc,
  sortTitleAsc,
  sortTitleDesc,
  sortDayAsc,
  sortDayDesc,
  sortNumHighlightsAsc,
  sortNumHighlightsDesc,
  sortList,
};

export default SortUtils;
