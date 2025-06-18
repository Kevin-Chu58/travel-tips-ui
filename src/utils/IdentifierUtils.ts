import type { TripAttractionOrder } from "@services/days";
import type { OsmEntity } from "@services/geoMap/osm";

const getTaoTimelineItemId = (
  tao: TripAttractionOrder
) => {
  return `${tao.dayId}-${tao.order}`;
};

const getOsmItemId = (
  osm: OsmEntity
) => {
  return `${osm.osm_id}-${osm.type}`
}

const IdentifierUtils = {
  getTaoTimelineItemId,
  getOsmItemId,
};

export default IdentifierUtils;
