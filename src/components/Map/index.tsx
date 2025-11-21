import { MapPin } from "@constants/Maps";
import { Box, type SxProps } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, type ReactNode } from "react";
import type { GeoCoordinate, Marker, Route } from "@constants/Types";
import { decode } from "@here/flexpolyline";
import "./index.scss";

type MapConfigProps = {
  openUI?: boolean;
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
  focusMapShift?: boolean;
  focusOnGroup?: boolean;
  openPopUp?: boolean;
};

type MapCallbackProps = {
  setCurrentCoordinate?: (state: GeoCoordinate) => void;
};

type MapProps = MapConfigProps &
  MapMarkerRouteProps &
  MapInteractionProps &
  MapCallbackProps;

const Map = React.memo(
  ({
    openUI = true,
    readonly = false,
    lat = 38.79,
    lng = -106.53,
    currentCoordinate,
    setCurrentCoordinate,
    markers = [],
    mapRoutes,
    focusId = undefined,
    focusRoute = false,
    focusMapShift = true,
    focusOnGroup = false,
    openPopUp = false,
    children,
    sx,
  }: MapProps) => {
    // map refs
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const MyLocationRef = useRef<L.Marker[]>([]);
    const routesRef = useRef<L.Polyline[]>([]);

    const focusOnRoute = focusRoute;

    const apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

    /** useEffect */

    useEffect(() => {
      if (mapInstanceRef.current) {
        // delay slightly if you have a CSS transition for the UI sliding
        const timer = setTimeout(() => {
          mapInstanceRef.current!.invalidateSize();
        }, 0); // adjust to match your UI transition duration

        return () => clearTimeout(timer);
      }
    }, [openUI]);

    // update on markers, taoId, focusRoute and routeCoords to update the overall map
    useEffect(() => {
      if (mapInstanceRef.current) {
        setRoutes();
        setMarkers();
        setView();
      }
    }, [markers.toString(), mapRoutes, focusId, focusRoute]);

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

          const normalizedLng = ((((lng + 180) % 360) + 360) % 360) - 180;

          setCurrentCoordinate({ lat, lng: normalizedLng });

          // Instantly move the map to the new coordinate
          mapInstanceRef.current!.setView([lat, normalizedLng]);
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
          setView();
          setMyLocation();
        }

        L.tileLayer(
          `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}@2x.png?key=${apiKey}`,
          {
            // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            updateWhenIdle: true, // load tiles only after user stops moving
            updateWhenZooming: false, // don’t load intermediate zoom tiles
            keepBuffer: 1,
            attribution:
              '&copy; 2025 HERE | &copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
          }
        ).addTo(mapInstanceRef.current);
      }
    }, []);

    const setRoutes = () => {
      // remove old polyline routes
      routesRef.current.forEach((m) => mapInstanceRef.current!.removeLayer(m));
      routesRef.current = [];

      // Draw polyline
      let markerIndex =
        markers.findIndex((marker) => marker.id === focusId) - 1;

      let indexFocused = focusOnRoute && markerIndex;

      let routeCoords =
        mapRoutes?.map((r) => (!r ? [] : decode(r.polyline ?? "").polyline)) ??
        [];

      mapRoutes?.forEach((mapRoute, i) => {
        let coords = routeCoords[i];
        let isFocused = indexFocused === (mapRoute?.groupId ?? 0 + 1);

        // create polyline for each route coords array
        const polyline = L.polyline(coords as L.LatLngExpression[], {
          color: isFocused ? mapRoute?.color ?? "#1976d2" : "#bdbdbd",
          weight: 8,
          opacity: 1,
        });

        // add polyline route to routesRef
        routesRef.current.push(polyline);

        // show polyline route on the map
        polyline.addTo(mapInstanceRef.current!);

        // update the z-index
        if (!isFocused) polyline.bringToBack();
      });
    };

    const setMarkers = () => {
      let isFocusFound = false;

      // remove old markers
      markersRef.current.forEach((m) => mapInstanceRef.current!.removeLayer(m));
      markersRef.current = [];

      markers.forEach((marker, i) => {
        let isFocus = focusOnGroup
          ? marker.groupId == focusId
          : marker.id === focusId;
        isFocusFound = isFocusFound || isFocus;

        let nextMarker = i < markers.length ? markers[i + 1] : undefined;
        let isNextFocus =
          !focusOnGroup && focusOnRoute && nextMarker && nextMarker.id === focusId;

        let icon = isFocus
          ? MapPin("var(--success-main)")
          : isNextFocus
          ? MapPin("var(--info-main)")
          : MapPin();
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
          offset: [0, -20],
        });

        // add markers to the map
        leafletMarker.addTo(mapInstanceRef.current!);

        if (focusOnRoute && openPopUp && !focusOnGroup) {
          if (isFocus) {
            // open popup when focused
            leafletMarker.setPopupContent("Destination");
            leafletMarker.openPopup();
          }
        }
      });
    };

    const setView = () => {
      // Get the center from bounds (true center)
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      if (!bounds.isValid()) return;

      mapInstanceRef.current?.fitBounds(bounds, {
        padding: [20, 25],
        maxZoom: markers.length === 1 ? markers[0].zoom : 15,
      });

      if (focusId && !focusOnGroup && focusMapShift) {
        let marker = markers.find((m) => m.id === focusId);
        if (marker) mapInstanceRef.current?.panTo([marker.lat, marker.lng]);
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
            icon: MapPin("gold"),
          }
        );

        // add pin point to markerRef
        MyLocationRef.current.push(leafletMyLocation);

        // add pin point to map
        leafletMyLocation.addTo(mapInstanceRef.current!);
      }
    };

    return (
      <Box className="map-box" ref={mapRef} sx={sx}>
        {children}
      </Box>
    );
  }
);

export default React.memo(Map);
