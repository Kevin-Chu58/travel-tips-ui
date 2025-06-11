import type { SortType } from "@constants/Types";

const sortIdAsc = (items: any[]) => {
  return items.sort((a, b) => a!.id - b!.id);
};

const sortIdDesc = (items: any[]) => {
  return items.sort((a, b) => b!.id - a!.id);
};

const sortNameAsc = (items: any[]) => {
  return items.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
};

const sortNameDesc = (items: any[]) => {
  return items.sort((a, b) =>
    b.name.toLowerCase().localeCompare(a.name.toLowerCase())
  );
};

const sortDayAsc = (items: any[]) => {
  return items.sort((a, b) => a!.numDays - b!.numDays);
};

const sortDayDesc = (items: any[]) => {
  return items.sort((a, b) => b!.numDays - a!.numDays);
};

const sortLastUpdatedAsc = (items: any[]) => {
  return items.sort(
    (a, b) =>
      new Date(a!.lastUpdatedAt).getTime() -
      new Date(b!.lastUpdatedAt).getTime()
  );
};

const sortLastUpdatedDesc = (items: any[]) => {
  return items.sort(
    (a, b) =>
      new Date(b!.lastUpdatedAt).getTime() -
      new Date(a!.lastUpdatedAt).getTime()
  );
};

// sort types
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

export const sortTypeDayAsc = {
  label: "Days ASC",
  function: sortDayAsc,
} as SortType;

export const sortTypeDayDesc = {
  label: "Days DESC",
  function: sortDayDesc,
} as SortType;

export const sortTypeUpdatedAsc = {
  label: "Last Updated ASC",
  function: sortLastUpdatedAsc,
} as SortType;

export const sortTypeUpdatedDesc = {
  label: "Last Updated DESC",
  function: sortLastUpdatedDesc,
} as SortType;

// sort list with a specific sorting function
const sortList = (
  list: any[],
  sortTypes: SortType[],
  sortTypeIndex: number
) => {
  let func = sortTypes[sortTypeIndex].function;
  return func(list);
};

const SortUtils = {
  sortIdAsc,
  sortIdDesc,
  sortNameAsc,
  sortNameDesc,
  sortDayAsc,
  sortDayDesc,
  sortLastUpdatedAsc,
  sortLastUpdatedDesc,
  sortList,
};

export default SortUtils;
