import type { Direction } from "@constants/Maps";
import { Box, type SxProps } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import markerIconGrey from "@assets/map/marker-icon-grey.png";
import markerIconBlue from "@assets/map/marker-icon-blue.png";
import markerIconGreen from "@assets/map/marker-icon-green.png";
import markerShadow from "@assets/map/marker-shadow.png";
import { getHex } from "@constants/Colors";
import type { Marker, Route } from "@constants/Types";

type MapProps = {
  readonly?: boolean;
  height?: number | string;
  lat?: number;
  lng?: number;
  markers?: Marker[];
  mapRoutes?: Route[];
  setIsParentUpdated?: () => void;
  focusId?: string;
  focusRoute?: boolean;
  setFocusId?: (state: string | undefined) => void;
  setMapView?: (state: string) => void;
  openPopUp?: boolean;
  updateOnMarkerFocus?: boolean;
  correctionBias?: number;
  correctionDirection?: Direction;
  correctionZoom?: number;
  children?: ReactNode;
  sx?: SxProps;
};

const Map = React.memo(({
  readonly = false,
  height = 200,
  lat = 38.79,
  lng = -106.53,
  markers = [],
  mapRoutes = [],
  setIsParentUpdated = () => {},
  focusId = undefined,
  focusRoute = false,
  setFocusId = () => {},
  setMapView = () => {},
  openPopUp = false,
  updateOnMarkerFocus = false,
  correctionBias = 0,
  correctionDirection = "S",
  correctionZoom = 0,
  children,
  sx,
}: MapProps) => {
  // map refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routesRef = useRef<L.Polyline[]>([]);
  // map routes
  const [routeCoords, setRouteCoords] = useState<[number, number][][]>(); // days/taos/corodinates
  // enfore updates
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const focusOnMarker = updateOnMarkerFocus && !focusRoute;
  const focusOnRoute = focusRoute;

  //   const apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

  /** useEffect */

  // update on markers to update the overall map
  useEffect(() => {
    // if (markers.length > 0) {
    setIsUpdated((prev) => !prev);
    // }
  }, [markers]);

  // update on id, type, route to update the overall map
  useEffect(() => {
    if (mapInstanceRef.current) {
      setRoutes();
      setMarkers();
    } else {
      setIsUpdated((prev) => !prev);
    }
  }, [focusId, focusRoute]);

  // rerender route coordinates on osrmRoute
  useEffect(() => {
    if (mapRoutes.length > 0) {
      const routeCoords = mapRoutes.map((taoRoute) => taoRoute?.coords ?? []);
      setRouteCoords(routeCoords);
    }
  }, [mapRoutes]);

  // rerender route display on routes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setRoutes();
    }
  }, [routeCoords]);

  // renrender the whole map on isUpdated
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      let mapOptions: L.MapOptions = {
        maxZoom: 18,
      };

      let mapOptionsReadonly: L.MapOptions = {
        ...mapOptions,
        zoomControl: false, // hide zoom buttons
        dragging: false, // disable dragging
        scrollWheelZoom: false, // disable wheel zoom
        doubleClickZoom: false, // disable double-click
        boxZoom: false, // disable shift-drag zoom
        keyboard: false, // disable keyboard navigation
        touchZoom: false, // disable pinch zoom on mobile
      };

      mapInstanceRef.current = L.map(
        mapRef.current,
        readonly ? mapOptionsReadonly : mapOptions
      ).setView([lat, lng], 4);

      if (mapInstanceRef.current && markers.length > 0) {
        setRoutes();
        setMarkers();
      }

      // https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}@2x.png?key=${apiKey}
      L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isUpdated]);

  const setRoutes = () => {
    // if (markers.length === 0) return;

    // remove old polyline routes
    routesRef.current.forEach((m) => mapInstanceRef.current!.removeLayer(m));
    routesRef.current = [];

    // Draw polyline
    let markerIndex = markers.findIndex(
      (marker) => marker.id === focusId
    );
    // if (markerIndex + 1 === markers.length) return;

    let indexFocused = focusOnRoute && markerIndex;

    let polyBound: L.LatLngBounds | undefined = undefined;

    routeCoords?.forEach((coords, i) => {
        let marker = markers.at(i);

        // create polyline for each route coords array
        const polyline = L.polyline(coords, {
          color: indexFocused === i ? getHex("dimgray") : getHex("darkgray"),
          weight: 8,
          opacity: 1,
        });

        // add polyline route to routesRef
        routesRef.current.push(polyline);

        // show polyline route on the map
        polyline.addTo(mapInstanceRef.current!).on("click", () => {
          setFocusId(marker?.id);
          setMapView("route");
          setIsParentUpdated();
        });

        // update the z-index
        if (indexFocused !== i) polyline.bringToBack();
        else {
          polyBound = polyline.getBounds();
        }
      }
    );

    if (focusOnRoute) {
      let isPolyBoundInvalid =
        polyBound === undefined || !(polyBound as L.LatLngBounds).isValid();

      let bounds = !isPolyBoundInvalid
        ? (polyBound! as L.LatLngBounds)
        : L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      if (bounds.isValid()) {
        mapInstanceRef.current?.fitBounds(bounds, { padding: [70, 70] });
      }
    }
  };

  const setMarkers = () => {
    let isFocusFound = false;

    // remove old markers
    markersRef.current.forEach((m) => mapInstanceRef.current!.removeLayer(m));
    markersRef.current = [];

    // calculate the fitting zoom level according to the bounds
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    const boundsZoom =
      markers.length > 0
        ? mapInstanceRef.current?.getBoundsZoom(bounds)
        : mapInstanceRef.current?.getZoom();

    markers.forEach((marker, i) => {
      let zoom = boundsZoom!;
      let isFocus = marker.id === focusId;
      isFocusFound = isFocusFound || isFocus;

      let prevMarker = i > 0 ? markers[i - 1] : undefined;
      let isPrevFocus =
        focusOnRoute &&
        prevMarker &&
        prevMarker.id === focusId;

      let icon = isFocus ? greenIcon : isPrevFocus ? blueIcon : greyIcon;
      let zIndexOffset = isFocus ? 1000 : 0;

      const leafletMarker = L.marker([marker.lat, marker.lng], {
        icon: icon,
        zIndexOffset: zIndexOffset, // This makes the focused marker appear on top
        title: marker.label,
      });

      // add markers to markerRef
      markersRef.current.push(leafletMarker);

      // bind popup to markers
      leafletMarker.bindPopup(marker.label || "Attraction", { autoPan: false });

      // add markers to the map
      leafletMarker.addTo(mapInstanceRef.current!).on("click", () => {
        setFocusId(marker.id);
        setMapView("location");
        setIsParentUpdated();
      });

      if (focusOnRoute && openPopUp) {
        if (isPrevFocus) {
          // open popup when focused
          leafletMarker.setPopupContent("Destination");
          leafletMarker.openPopup();
        }
      }

      // set map zoom level
      if (focusOnMarker && isFocus) {
        // adjust map view position
        const markerBiased = getLatLonDelta(
          mapInstanceRef.current!,
          marker.lat,
          marker.lng,
          correctionBias,
          zoom + correctionZoom,
          correctionDirection
        );
        mapInstanceRef.current?.whenReady(() => {
          mapInstanceRef.current?.setView(
            [marker.lat + markerBiased.lat, marker.lng + markerBiased.lng],
            zoom + correctionZoom
          );
        });
      }
    });

    // Optionally fit bounds to markers
    if (!isFocusFound && markers.length > 0) {
      mapInstanceRef.current?.fitBounds(bounds, { padding: [20, 20] });
    }
  };

  // different color markers
  // ref: https://github.com/pointhi/leaflet-color-markers

  const greyIcon = new L.Icon({
    iconUrl: markerIconGrey,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const blueIcon = new L.Icon({
    iconUrl: markerIconBlue,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const greenIcon = new L.Icon({
    iconUrl: markerIconGreen,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // calculation
  // *credit to ChatGpt

  /**
   * Calculate the latitude or lnggitude delta equivalent to cm on screen at the given lat and zoom level,
   * depending on the direction (N, E, S, W).
   */
  const getLatLonDelta = (
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

  return (
    <Box m={0} ref={mapRef} height={height} width="100%" sx={sx}>
      {children}
    </Box>
  );
});

export default Map;
