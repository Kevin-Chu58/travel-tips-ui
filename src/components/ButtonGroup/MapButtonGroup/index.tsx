import TTIconButton from "@components/TTIconButton";
import type { MapView } from "@constants/Types";
import { Box, Tooltip } from "@mui/material";

type MapButtonGroup = {
  mapViews: MapView[];
  mapView: string;
  setMapView: (state: string) => void;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

const MapButtonGroup = ({
  mapViews,
  mapView,
  setMapView,
  top,
  bottom,
  left,
  right,
}: MapButtonGroup) => {
  const isMapView = (routeType: string) => {
    return mapView === routeType;
  };

  return (
    <Box
      aria-label="map view"
      sx={{
        ml: "auto",
        mr: 1,
        position: "absolute",
        zIndex: 1200,
        top: top,
        bottom: bottom,
        left: left,
        right: right,
      }}
    >
      {mapViews.map((view) => (
        <Tooltip
          key={view.viewType}
          title={`highlight ${view.viewType}s on map`}
          arrow
        >
          <TTIconButton
            onClick={() => setMapView(view.viewType)}
            aria-label={`${view.viewType} view`}
            size="small"
            sx={{
              scale: isMapView(view.viewType) ? 0.9 : 0.7,
              color: "secondary.main",
              bgcolor: isMapView(view.viewType)
                ? "primary.main"
                : "secondary.900",
              boxShadow:
                "5px 5px 5px rgba(0, 0, 0, .2), 10px 10px 10px rgba(0, 0, 0, .2)",
              transition: ".2s ease-in-out all",
              ":hover": { bgcolor: "secondary.dark" },
            }}
          >
            <view.icon
              fontSize={isMapView(view.viewType) ? "large" : "small"}
            />
          </TTIconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default MapButtonGroup;
