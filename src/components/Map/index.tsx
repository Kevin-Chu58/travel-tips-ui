import {
  BlueIcon,
  GreenIcon,
  GreyIcon,
  GoldIcon,
  type Direction,
} from "@constants/Maps";
import { Box, type SxProps } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { getHex } from "@constants/Colors";
import type { GeoCoordinate, Marker, Route } from "@constants/Types";
import MapUtils from "@utils/MapUtils";

type MapConfigProps = {
  readonly?: boolean;
  lat?: number;
  lng?: number;
  sx?: SxProps;
  children?: ReactNode;
};

type MapMarkerRouteProps = {
  currentCoordinate?: GeoCoordinate;
  markers?: Marker[];
  mapRoutes?: Route[];
};

type MapInteractionProps = {
  focusId?: string;
  focusRoute?: boolean;
  updateOnMarkerFocus?: boolean;
  openPopUp?: boolean;
};

type MapCallbackProps = {
  setIsParentUpdated?: () => void;
  setCurrentCoordinate?: (state: GeoCoordinate) => void;
  setFocusId?: (state: string | undefined) => void;
  setMapView?: (state: string) => void;
};

type MapViewCorrectionProps = {
  correctionBias?: number;
  correctionDirection?: Direction;
  correctionZoom?: number;
};

type MapProps = MapConfigProps &
  MapMarkerRouteProps &
  MapInteractionProps &
  MapCallbackProps &
  MapViewCorrectionProps;

const Map = React.memo(
  ({
    readonly = false,
    lat = 38.79,
    lng = -106.53,
    currentCoordinate,
    setCurrentCoordinate,
    markers = [],
    mapRoutes,
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
    const MyLocationRef = useRef<L.Marker[]>([]);
    const routesRef = useRef<L.Polyline[]>([]);
    // map routes
    const [routeCoords, setRouteCoords] = useState<[number, number][][]>(); // days/taos/corodinates

    const focusOnMarker = updateOnMarkerFocus && !focusRoute;
    const focusOnRoute = focusRoute;

    //   const apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

    /** useEffect */

    // update on markers, taoId, focusRoute and routeCoords to update the overall map
    useEffect(() => {
      if (mapInstanceRef.current) {
        setRoutes();
        setMarkers();
      }
    }, [markers, focusId, focusRoute, routeCoords]);

    // rerender route coordinates on osrmRoute
    useEffect(() => {
      if (mapRoutes) {
        const routeCoords = mapRoutes.map((taoRoute) => taoRoute?.coords ?? []);
        setRouteCoords(routeCoords);
      }
    }, [mapRoutes]);

    // rerender my location on currentCoordinate
    useEffect(() => {
      if (mapInstanceRef.current) {
        setMyLocation();
      }
    }, [currentCoordinate]);

    // render the set coordinate event on mount
    useEffect(() => {
      if (mapInstanceRef.current && setCurrentCoordinate) {
        const handler = (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          setCurrentCoordinate({ lat, lng });
        };

        // right click
        mapInstanceRef.current.on("click", handler);

        return () => {
          if (mapInstanceRef.current)
            mapInstanceRef.current.off("click", handler);
        };
      }
    }, [setCurrentCoordinate]);

    // renrender the whole map on isUpdated
    useEffect(() => {
      if (mapRef.current && !mapInstanceRef.current) {
        let mapOptions: L.MapOptions = {
          maxZoom: 18,
          zoomControl: false, // hide zoom buttons
        };

        let mapOptionsReadonly: L.MapOptions = {
          ...mapOptions,
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

        if (!readonly) {
          L.control
            .zoom({
              position: "bottomright", // options: 'topleft', 'topright', 'bottomleft', 'bottomright'
            })
            .addTo(mapInstanceRef.current);
        }

        if (mapInstanceRef.current && markers.length > 0) {
          setRoutes();
          setMarkers();
          setMyLocation();
        }

        // https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}@2x.png?key=${apiKey}
        L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current);
      }
    }, []);

    const setRoutes = () => {
      // remove old polyline routes
      routesRef.current.forEach((m) => mapInstanceRef.current!.removeLayer(m));
      routesRef.current = [];

      // Draw polyline
      let markerIndex = markers.findIndex((marker) => marker.id === focusId);

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
      });

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
          focusOnRoute && prevMarker && prevMarker.id === focusId;

        let icon = isFocus ? GreenIcon : isPrevFocus ? BlueIcon : GreyIcon;
        let zIndexOffset = isFocus ? 100 : 0;

        const leafletMarker = L.marker([marker.lat, marker.lng], {
          icon: icon,
          zIndexOffset: zIndexOffset, // This makes the focused marker appear on top
          title: marker.label,
        });

        // add markers to markerRef
        markersRef.current.push(leafletMarker);

        // bind popup to markers
        leafletMarker.bindPopup(marker.label || "Attraction", {
          autoPan: false,
        });

        // add markers to the map
        leafletMarker.addTo(mapInstanceRef.current!).on("click", () => {
          setFocusId(marker?.id);
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
          const mappedZoom = (marker.zoom ?? zoom) + correctionZoom;
          // adjust map view position
          const markerBiased = MapUtils.getLatLonDelta(
            mapInstanceRef.current!,
            marker.lat,
            marker.lng,
            correctionBias,
            mappedZoom,
            correctionDirection
          );
          mapInstanceRef.current?.whenReady(() => {
            mapInstanceRef.current?.setView(
              [marker.lat + markerBiased.lat, marker.lng + markerBiased.lng],
              mappedZoom
            );
          });
        }
      });

      // Optionally fit bounds to markers
      // if (markers.length === 1) {
      //   const marker = markers[0];
      //   const zoomLevel = marker.zoom + correctionZoom;
      //   mapInstanceRef.current?.setView([marker.lat, marker.lng], zoomLevel, {
      //     animate: true,
      //   });
      // } else if (markers.length > 1 && !isFocusFound) {
      //   mapInstanceRef.current!.fitBounds(bounds, { padding: [20, 20] });
      // }

      if (markers.length > 0 && !isFocusFound) {
        // Get the true bounds (no bias)
        // const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
        
        // Fit bounds first (ensures zoom is correct & reset to actual center)
        mapInstanceRef.current?.fitBounds(bounds, { padding: [20, 20] });
        
        // Get the center from bounds (true center)
        const center = bounds.getCenter();
        const zoom = mapInstanceRef.current!.getZoom() + correctionZoom;

        // Apply bias from *true center*, not from already-biased view
        const biased = MapUtils.getLatLonDelta(
          mapInstanceRef.current!,
          center.lat,
          center.lng,
          correctionBias,
          zoom,
          correctionDirection
        );

        // Set view with same zoom but biased center
        mapInstanceRef.current?.setView(
          [center.lat + biased.lat, center.lng + biased.lng],
          zoom
        )
      }
    };

    const setMyLocation = () => {
      // remove old pin points
      MyLocationRef.current.forEach((m) =>
        mapInstanceRef.current!.removeLayer(m)
      );
      MyLocationRef.current = [];

      // add the current coordinate pin point if not null
      if (currentCoordinate) {
        const leafletMyLocation = L.marker(
          [currentCoordinate.lat, currentCoordinate.lng],
          {
            icon: GoldIcon,
          }
        );

        // add pin point to markerRef
        MyLocationRef.current.push(leafletMyLocation);

        // add pin point to map
        leafletMyLocation.addTo(mapInstanceRef.current!);
      }
    };

    return (
      <Box m={0} ref={mapRef} height="100%" width="100%" sx={sx}>
        {children}
      </Box>
    );
  }
);

export default React.memo(Map);
