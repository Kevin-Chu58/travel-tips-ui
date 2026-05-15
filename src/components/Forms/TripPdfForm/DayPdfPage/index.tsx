import PdfPage from "@components/PdfPage";
import PdfPagePreview from "@components/PdfPagePreview";
import { Box, Chip, Typography } from "@mui/material";
import { type Tao } from "@services/taos";
import MapUtils from "@utils/MapUtils";
import type { HereRoutingResponse } from "@services/hereMap/hereMap";
import TimeUtils from "@utils/TimeUtils";
import NavButton from "@components/Button/NavButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReplyIcon from "@mui/icons-material/Reply";
import DirectionAccordion from "@components/Accordions/DirectionAccordion";
import React, { useMemo } from "react";
import Map from "@components/Map";

type DayPdfPageProps = {
  dayIndex: number;
  taos: Tao[] | undefined;
  routingResponses: HereRoutingResponse[] | undefined;
};

const DayPdfPage = React.memo(
  ({ dayIndex, taos, routingResponses }: DayPdfPageProps) => {
    const taoMarkers = useMemo(
      () =>
        taos?.map((tao, i) => ({
          id: String(tao.id),
          groupId: i + 1,
          label: tao.attraction.title,
          lat: tao.attraction.lat,
          lng: tao.attraction.lng,
          zoom: MapUtils.resultTypeToZoom(tao.attraction.resultType),
        })),
      [taos],
    );

    const routes = useMemo(
      () => MapUtils.routingResponses2Routes(routingResponses),
      [routingResponses],
    );

    const eventItems = useMemo(
      () =>
        taos?.map((tao, i) => {
          const startTime = TimeUtils.formatTimeHHmmssTohmmA(tao.start);
          const endTime = TimeUtils.formatTimeHHmmssTohmmA(tao.end);
          const googleMapLink = MapUtils.getGoogleMapLink(
            tao.attraction.address,
          );

          return (
            <Box key={tao.id}>
              <Box className="row full">
                <Typography className="tao-order-number">{i + 1}</Typography>
                <Typography whiteSpace="nowrap" fontWeight="bold">
                  {startTime} - {endTime}
                </Typography>
                {tao.attraction.category ? (
                  <Box>
                    <Chip
                      className="event-category"
                      size="small"
                      label={
                        <Typography variant="caption">
                          {tao.attraction.category}
                        </Typography>
                      }
                    />
                  </Box>
                ) : undefined}
              </Box>
              <NavButton link={googleMapLink}>
                <Typography className="attraction-name">
                  {tao.attraction.title}
                </Typography>
              </NavButton>
              <Typography variant="caption">
                {tao.attraction.address}
              </Typography>
            </Box>
          );
        }),
      [taos],
    );

    const routingItems = useMemo(
      () =>
        taos?.map((tao, i) => {
          if (i === 0) return null;

          const prevTao = taos[i - 1];
          const routingResponse = routingResponses?.at(i - 1);
          const formatedSections =
            routingResponse && routingResponse.routes?.at(0)
              ? MapUtils.mergeRoutingSections(routingResponse.routes[0])
              : undefined;
          const googleRouteLink = MapUtils.getGoogleRouteLink(
            prevTao.attraction.address,
            tao.attraction.address,
          );

          return (
            <Box key={tao.id}>
              <Box className="row routing">
                <Typography variant="body2">
                  {prevTao.attraction.title}
                </Typography>
                <ArrowForwardIcon />
                <Typography variant="body2">{tao.attraction.title}</Typography>
                <Chip label={tao.transportMode ?? "car"} size="small" color="warning" />
                <NavButton link={googleRouteLink}>
                  <ReplyIcon className="jump-to-icon" />
                </NavButton>
              </Box>
              {(formatedSections ?? []).map((section) => (
                <DirectionAccordion
                  key={section.id}
                  section={section}
                  taoId={tao?.id}
                  simple
                />
              ))}
            </Box>
          );
        }),
      [taos, routingResponses],
    );

    return (
      <React.Fragment>
        {/* day overview */}
        <PdfPagePreview>
          <PdfPage>
            <Box className="page-box max-content">
              <Typography color="primary" fontWeight="bold" variant="h6">
                Day {dayIndex + 1} - Events
              </Typography>
              <Box className="map-box" sx={{ maxHeight: 400 }}>
                {taoMarkers && taoMarkers.length > 0 ? (
                  <Map
                    markers={taoMarkers}
                    mapRoutes={routes}
                    showMarkerLabel
                    showRouteColor
                    readonly
                  />
                ) : (
                  <Typography>No Events Today.</Typography>
                )}
              </Box>
              {eventItems}
            </Box>
          </PdfPage>
        </PdfPagePreview>

        {/* day routing */}
        <PdfPagePreview>
          <PdfPage>
            <Box className="page-box max-content">
              <Typography color="primary" fontWeight="bold" variant="h6">
                Day {dayIndex + 1} - Routing
              </Typography>
              <Typography variant="caption">
                *Travel times are estimated. Please refer to <b>Google Map</b>{" "}
                for live data.
              </Typography>
              {routingItems}
            </Box>
          </PdfPage>
        </PdfPagePreview>
      </React.Fragment>
    );
  },
);

export default DayPdfPage;
