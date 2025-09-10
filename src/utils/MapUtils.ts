import { GoogleMapLink, type Direction } from "@constants/Maps";
import type { GeoCoordinate } from "@constants/Types";
import type {
  Route,
  Section,
} from "@services/hereMap/hereMap";
import L from "leaflet";

const extractAddress = (address: any) => {
  let addressComponents = [
    address.city || address.town || address.village || address.county || null, // city
    address.state || address.province || address.region || null, // state
    address.country || null, // country
  ];

  return addressComponents.filter(Boolean).join(", ");
};

const getGoogleMapLink = (address: string) => {
  return GoogleMapLink + encodeURIComponent(address);
};

// calculation
// *credit to ChatGpt

/**
 * Calculate the latitude or lnggitude delta equivalent to cm on screen at the given lat and zoom level,
 * depending on the direction (N, E, S, W).
 */
const getLatLngDelta = (
  map: L.Map,
  lat: number,
  lng: number,
  cm: number,
  zoom: number,
  direction: Direction
): L.LatLng => {
  if (cm <= 0) return new L.LatLng(0, 0);

  // 1 cm in pixels (screen units) — assuming 96 DPI
  const pixels = (96 / 2.54) * cm; // ~37.8px per cm

  const originalPoint = map.project([lat, lng], zoom);

  let offsetPoint: L.Point;

  switch (direction) {
    case "N":
      offsetPoint = L.point(originalPoint.x, originalPoint.y - pixels);
      break;
    case "S":
      offsetPoint = L.point(originalPoint.x, originalPoint.y + pixels);
      break;
    case "E":
      offsetPoint = L.point(originalPoint.x + pixels, originalPoint.y);
      break;
    case "W":
      offsetPoint = L.point(originalPoint.x - pixels, originalPoint.y);
      break;
  }

  const newLatLng = map.unproject(offsetPoint, zoom);

  return new L.LatLng(newLatLng.lat - lat, newLatLng.lng - lng);
};

const resultTypeToZoom = (resultType: string) => {
  switch (resultType) {
    case "country":
    case "administrativeArea":
      return 4;
    case "state":
      return 6;
    case "county":
      return 8;
    case "locality":
      return 10;
    case "postalCode":
      return 11;
    case "street":
      return 15;
    case "intersection":
      return 16;
    case "houseNumber":
    case "place":
      return 17;
    default:
      return 12; // fallback
  }
};

const getCurrentLocation = (): Promise<GeoCoordinate> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

const mergeRoutingSections = (route: Route) => {
  const mergedSections: Section[] = [];
  let pedestrianBuffer: Section[] = [];

  function flushPedestrianBuffer() {
    if (pedestrianBuffer.length === 0) return;

    const merged: Section = {
      id: undefined,
      transport: {mode: "pedestrian"},
      travelSummary: { duration: 0, length: 0 },
      actions: [],
    };

    // Collect travelSummary and actions (also id)
    for (const sec of pedestrianBuffer) {
      merged.id = merged.id ?? sec.id;
      merged.travelSummary!.duration += sec.travelSummary?.duration ?? 0;
      merged.travelSummary!.length += sec.travelSummary?.length ?? 0;

      if (sec.actions) {
        merged.actions!.push(...sec.actions);
      }
    }

    mergedSections.push(merged);
    pedestrianBuffer = [];
  }

  for (const section of route.sections!) {
    if (section.type === "pedestrian") {
      pedestrianBuffer.push(section);
    } else {
      flushPedestrianBuffer();
      mergedSections.push(section);
    }
  }

  // flush remaining pedestrian sections at the end
  flushPedestrianBuffer();

  return mergedSections;
};

const MapUtils = {
  extractAddress,
  getGoogleMapLink,
  getLatLngDelta,
  resultTypeToZoom,
  getCurrentLocation,
  mergeRoutingSections,
};

export default MapUtils;
