import Map from "@components/Map";
import { mild_box_shadow } from "@constants/Shadows";
import { Box, Typography } from "@mui/material";
import type { AttractionV2 } from "@services/attractions";
import { useState } from "react";
import { useNavigate } from "react-router";

type AttractionCardProps = {
  attraction: AttractionV2;
};

const AttractionCard = ({ attraction }: AttractionCardProps) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const navigate = useNavigate();

  const markers = [
    {
      lat: attraction.lat,
      lng: attraction.lng,
      osmId: attraction.osmId,
      osmType: attraction.osmType,
    },
  ];

  return (
    <Box
      key={`my-trip-${attraction.id}`}
      width={240}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => navigate(`/workshop/highlight/${attraction.id}`)}
      sx={{
        cursor: "pointer",
      }}
    >
      {/* attraction location on map (read-only) */}
      <Box
        width={240}
        height={200}
        position="relative"
        sx={{
          borderLeft: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
          boxShadow: mild_box_shadow,
          overflow: "hidden",
        }}
      >
        <Map
          readonly
          updateOnMarkerFocus
          markers={markers}
          correctionZoom={3}
        />

        <Box
          width={240}
          height={200}
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            top: isHover ? 0 : 240,
            transition: ".2s all linear",
            bgcolor: "rgba(0, 0, 0, .6)",
            color: "lightgrey",
            zIndex: 1100,
            backdropFilter: "blur(2px)",
          }}
        >
          <Typography fontSize={72} mb={-1}>
            {attraction.numHighlights}
          </Typography>
          <Typography fontSize={24} fontWeight="bold">
            {(attraction.numHighlights ?? 0) > 1 ? "Highlights" : "Highlight"}
          </Typography>
          <Typography>Click to view</Typography>
        </Box>
      </Box>

      {/* attraction info */}
      <Box mt={2}>
        <Typography
          textTransform="capitalize"
          display="flex"
          alignItems="center"
          fontSize={18}
        >
          {attraction.name}
        </Typography>

        <Typography fontSize={14} color="dimgrey">
          {attraction.address}
        </Typography>
      </Box>
    </Box>
  );
};

export default AttractionCard;
