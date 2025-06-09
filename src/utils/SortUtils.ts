const sortIdAsc = (items: any[]) => {
  return items.sort((a, b) => a!.id - b!.id);
};

const sortIdDesc = (items: any[]) => {
  return items.sort((a, b) => b!.id - a!.id);
};

const sortNameAsc = (items: any[]) => {
  return items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
};

const sortNameDesc = (items: any[]) => {
  return items.sort((a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()));
};

const sortDayAsc = (items: any[]) => {
  return items.sort((a, b) => a!.numDays - b!.numDays);
};

const sortDayDesc = (items: any[]) => {
  return items.sort((a, b) => b!.numDays - a!.numDays);
};

const sortLastUpdatedAsc = (items: any[]) => {
  return items.sort((a, b) => new Date(a!.lastUpdatedAt).getTime() - new Date(b!.lastUpdatedAt).getTime());
};

const sortLastUpdatedDesc = (items: any[]) => {
  return items.sort((a, b) => new Date(b!.lastUpdatedAt).getTime() - new Date(a!.lastUpdatedAt).getTime());
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
};

export default SortUtils;
