import PdfPage from "@components/PdfPage";
import PdfPagePreview from "@components/PdfPagePreview";
import { Box, Chip, Typography } from "@mui/material";
import Map from "@components/Map";
import { type Tao } from "@services/taos";
import MapUtils from "@utils/MapUtils";
import type { HereRoutingResponse } from "@services/hereMap/hereMap";
import TimeUtils from "@utils/TimeUtils";
import NavButton from "@components/Button/NavButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ReplyIcon from "@mui/icons-material/Reply";
import DirectionAccordion from "@components/Accordions/DirectionAccordion";
import React from "react";

type DayPdfPageProps = {
  dayIndex: number;
  taos: Tao[] | undefined;
  routingResponses: HereRoutingResponse[] | undefined;
};

const DayPdfPage = ({ dayIndex, taos, routingResponses }: DayPdfPageProps) => {
  // map
  const taoMarkers = taos?.map((tao, i) => {
    return {
      id: String(tao.id),
      groupId: i + 1,
      label: tao.attraction.title,
      lat: tao.attraction.lat,
      lng: tao.attraction.lng,
      zoom: MapUtils.resultTypeToZoom(tao.attraction.resultType),
    };
  });
  const routes = MapUtils.routingResponses2Routes(routingResponses);

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
              <Map
                markers={taoMarkers}
                mapRoutes={routes}
                showMarkerLabel
                showRouteColor
                readonly
              />
            </Box>

            {taos?.map((tao, i) => {
              const startTime = TimeUtils.formatTimeHHmmssTohmmA(tao.start);
              const endTime = TimeUtils.formatTimeHHmmssTohmmA(tao.end);

              return (
                <Box key={tao.id}>
                  <Box className="row full">
                    <Typography className="tao-order-number">
                      {i + 1}
                    </Typography>
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

                  {/* attraction name */}
                  <NavButton
                    link={MapUtils.getGoogleMapLink(tao.attraction.address)}
                  >
                    <Typography className="attraction-name">
                      {tao.attraction.title}
                    </Typography>
                  </NavButton>
                  {/* attraction address */}
                  <Typography variant="caption">
                    {tao.attraction.address}
                  </Typography>
                </Box>
              );
            })}
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
              *Travel times are estimated. Please refer to <b>Google Map</b> for
              live data.
            </Typography>
            {taos?.map((tao, i) => {
              if (i === 0) return;

              const prevTao = taos[i - 1];
              const routingResponse = routingResponses?.at(i - 1);
              const formatedSections =
                routingResponse && routingResponse.routes?.at(0)
                  ? MapUtils.mergeRoutingSections(routingResponse.routes[0])
                  : undefined;

              return (
                <Box key={tao.id}>
                  <Box className="row routing">
                    <Typography variant="body2">
                      {prevTao.attraction.title}
                    </Typography>
                    <ArrowForwardIcon />
                    <Typography variant="body2">
                      {tao.attraction.title}
                    </Typography>

                    <Chip
                      label={tao.transportMode}
                      size="small"
                      color="warning"
                    />
                    {/* nav button - google map for routing */}
                    <NavButton
                      link={MapUtils.getGoogleRouteLink(
                        prevTao.attraction.address,
                        tao.attraction.address
                      )}
                    >
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
            })}
          </Box>
        </PdfPage>
      </PdfPagePreview>
    </React.Fragment>
  );
};

export default DayPdfPage;
