import type { TripAttractionOrder } from "@services/days";
import type { OsmEntity } from "@services/nominatim/nominatim";

const getTaoTimelineItemId = (
  tao: TripAttractionOrder
) => {
  return `${tao.dayId}-${tao.order}`;
};

const getOsmItemId = (
  osm: OsmEntity
) => {
  return `${osm.osm_id}-${osm.osm_type}`
}

const IdentifierUtils = {
  getTaoTimelineItemId,
  getOsmItemId,
};

export default IdentifierUtils;
