import Map from "@components/Map";
import { mild_box_shadow } from "@constants/Shadows";
import { Box, Checkbox, Divider, Typography } from "@mui/material";
import type {
  Attraction,
  AttractionHighlights,
  Highlight,
} from "@services/attractions";
import React, { useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import type { IndicatorItem } from "@constants/Types";
import IndicatorBar from "@components/IndicatorBar";
import TTButton from "@components/TTButton";
import TTDialog from "@components/TTDialog";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

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

  const indicatorItems = [
    {
      label: "select",
      isIcon: true,
      sx: {
        width: 60,
      },
    },
    {
      label: "highlight",
      sx: {
        flex: 1,
        overflowX: "auto",
      },
    },
    {
      label: "option",
      isIcon: true,
      sx: {
        width: 100,
      },
    },
  ] as IndicatorItem[];

  return (
    <>
      <Box
        key={`my-trip-${attractionHighlights.id}`}
        width={240}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        // onClick={() => setIsOpen(true)}
        onClick={() => navigate(`/workshop/highlight/${attractionHighlights.id}`)}
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

      <TTDialog maxWidth="md" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box>
          {/* attraction info */}
          <Box m={2} mb={0}>
            <Typography
              textTransform="capitalize"
              display="flex"
              alignItems="center"
              fontSize={18}
              color="info"
            >
              {attractionHighlights.name}
            </Typography>

            <Typography fontSize={14} color="dimgrey">
              {attractionHighlights.address}
            </Typography>

            {/* indicator */}
            <IndicatorBar indicatorItems={indicatorItems} />
          </Box>

          {/* highlight list */}
          <Box maxHeight="60vh" overflow="auto" p={2}>
            {attractionHighlights.highlights.map((highlight, i) => {
              let checkbox = (
                <Checkbox color="info" checked={selected.includes(highlight.id)} />
              );
              let content = (
                <Typography whiteSpace="pre-wrap">
                  {highlight.description}
                </Typography>
              );
              let option = (
                <TTButton
                  label="edit"
                  size="small"
                  color="info"
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => 
                    setHighlight(getHighlightInfo(highlight))}
                  sx={{
                    "&.MuiButton-root": {
                      mt: 1,
                    },
                  }}
                />
              );
              let items = [checkbox, content, option];

              return (
                <React.Fragment key={`highlight-${highlight.id}`}>
                  <Box
                    display="flex"
                    onClick={() =>
                      selected.includes(highlight.id)
                        ? removeSelected(highlight.id)
                        : addSelected(highlight.id)
                    }
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      py: 1,
                      ":hover": {
                        bgcolor: "secondary.main",
                      }
                    }}
                  >
                    {items.map((item, item_i) => (
                      <Box
                        key={item_i}
                        display="flex"
                        justifyContent={
                          indicatorItems[item_i].isIcon ? "center" : "normal"
                        }
                        sx={indicatorItems[item_i].sx}
                      >
                        {indicatorItems[item_i].isIcon ? (
                          <Box>{item}</Box>
                        ) : (
                          <Box mt={1}>{item}</Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                  {i + 1 < attractionHighlights.highlights.length && 
                    <Divider flexItem/>
                  }
                </React.Fragment>
              );
            })}
          </Box>
        </Box>
      </TTDialog>
    </>
  );
};

export default TTHighlightCard;
