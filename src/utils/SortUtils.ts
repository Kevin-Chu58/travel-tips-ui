const sortIdAsc = (items: any[]) => {
  return items.sort((a, b) => a!.id - b!.id);
};

const SortUtils = {
  sortIdAsc,
};

export default SortUtils;
