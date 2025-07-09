import Map from "@components/Map";
import { mild_box_shadow } from "@constants/Shadows";
import {
  Box,
  Checkbox,
  Dialog,
  Typography,
} from "@mui/material";
import type {
  Attraction,
  AttractionHighlights,
  Highlight,
} from "@services/attractions";
import { useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import TTIconButton from "@components/TTIconButton";

type TTHighlightCardProps = {
  attractionHighlights: AttractionHighlights;
  setHighlight: (state: Attraction) => void;
  selected: number[];
  addSelected: (state: number) => void;
  removeSelected: (state: number) => void;
};

const TTHighlightCard = ({
  attractionHighlights,
  setHighlight,
  selected,
  addSelected,
  removeSelected,
}: TTHighlightCardProps) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const markers = useMemo(
    () => [
      {
        lat: attractionHighlights.lat,
        lng: attractionHighlights.lng,
        osmId: attractionHighlights.osmId,
        osmType: attractionHighlights.osmType,
      },
    ],
    [
      attractionHighlights.lat,
      attractionHighlights.lng,
      attractionHighlights.osmId,
      attractionHighlights.osmType,
    ]
  );

  const getHighlightInfo = (highlight: Highlight) => {
    return {
      ...attractionHighlights,
      id: highlight.id,
      description: highlight.description,
      linkId: highlight.linkId,
    } as Attraction;
  };

  return (
    <>
      <Box
        key={`my-trip-${attractionHighlights.id}`}
        width={240}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => setIsOpen(true)}
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
            height="100%"
            readonly
            updateOnMarkerFocus
            markers={markers}
            correctionZoom={-3}
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
              {attractionHighlights.highlights.length}
            </Typography>
            <Typography fontSize={24} fontWeight="bold">
              {attractionHighlights.highlights.length > 1
                ? "Highlights"
                : "Highlight"}
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
            {attractionHighlights.name}
          </Typography>

          <Typography fontSize={14} color="dimgrey">
            {attractionHighlights.address}
          </Typography>
        </Box>
      </Box>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Box>
          {/* attraction info */}
          <Box m={2} mb={0}>
            <Typography
              textTransform="capitalize"
              display="flex"
              alignItems="center"
              fontSize={18}
            >
              {attractionHighlights.name}
            </Typography>

            <Typography fontSize={14} color="dimgrey">
              {attractionHighlights.address}
            </Typography>

            {/* indicator */}
            <Box
              display="flex"
              color="dimgrey"
              mt={1}
              py={0.5}
              sx={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box width={50} display="flex" justifyContent="center">
                <Typography fontSize={12}>select</Typography>
              </Box>
              <Box
                flex={1}
                display="flex"
                justifyContent="center"
                sx={{
                  borderWidth: "0 1px 0 1px",
                  borderStyle: "solid",
                  borderColor: "divider",
                }}
              >
                <Typography fontSize={12}>highlight</Typography>
              </Box>
              <Box width={50} display="flex" justifyContent="center">
                <Typography fontSize={12}>options</Typography>
              </Box>
            </Box>
          </Box>

          {/* highlight list */}
          <Box maxHeight="60vh" overflow="auto" p={2}>
            {attractionHighlights.highlights.map((highlight) => (
              <Box
                display="flex"
                key={`highlight-${highlight.id}`}
                onClick={() =>
                  selected.includes(highlight.id)
                    ? removeSelected(highlight.id)
                    : addSelected(highlight.id)
                }
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  py: 1,
                }}
              >
                {/* checkbox */}
                <Box width={50} display="flex" justifyContent="center">
                  <Box>
                    <Checkbox checked={selected.includes(highlight.id)} />
                  </Box>
                </Box>
                {/* content */}
                <Box
                  flex={1}
                  mt={1}
                  sx={{
                    overflowX: "auto",
                  }}
                >
                  <Typography whiteSpace="pre-wrap" bgcolor="white">
                    {highlight.description}
                  </Typography>
                </Box>
                {/* options */}
                <Box width={50} display="flex" justifyContent="center">
                  <Box>
                    <TTIconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setHighlight(getHighlightInfo(highlight));
                      }}
                      sx={{
                        mx: "auto",
                        color: "secondary.main",
                        bgcolor: "secondary.900",
                        ":hover": {
                          bgcolor: "secondary.dark",
                        },
                      }}
                    >
                      <EditIcon />
                    </TTIconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default TTHighlightCard;
