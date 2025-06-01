import type { OsmType } from "@constants/Maps";

const getTaoTimelineItemId = (
  osmId: number | undefined,
  osmType: OsmType | undefined
) => {
  return `${osmId}/${osmType}`;
};

const IdentifierUtils = {
  getTaoTimelineItemId,
};

export default IdentifierUtils;
