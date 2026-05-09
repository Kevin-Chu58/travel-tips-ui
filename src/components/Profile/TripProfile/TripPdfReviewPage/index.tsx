import PdfPage from "@components/PdfPage";
// import PdfPagePreview from "@components/PdfPagePreview";
import type { Marker } from "@constants/Types";
import { Box, Typography } from "@mui/material";
import type { Trip } from "@services/trips";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import NameComponent from "../NameComponent";
import MarkdownBox from "@components/MarkdownBox";
import Map from "@components/Map";
import type { Day } from "@services/days";
import type { Tao } from "@services/taos";
import type { HereRoutingResponse } from "@services/hereMap/hereMap";
import DayPdfPage from "@components/Forms/TripPdfForm/DayPdfPage";
import "./index.scss";

type TripPdfReviewPageProps = {
  trip: Trip | undefined;
  days: Day[];
  taosMapRef: React.RefObject<Map<number, Tao[]>>;
  routeResponsesMapRef: React.RefObject<Map<number, HereRoutingResponse[]>>;
  geoMarkers: Marker[] | undefined;
  fetchAllDays: () => Promise<void>;
};

const TripPdfReviewPage = ({
  trip,
  days,
  taosMapRef,
  routeResponsesMapRef,
  geoMarkers,
  fetchAllDays,
}: TripPdfReviewPageProps) => {
  const [allDaysFetched, setAllDaysFetched] = useState(false);

  useEffect(() => {
    setAllDaysFetched(false);
    fetchAllDays().then(() => setAllDaysFetched(true));
  }, []);

  const dayPages = useMemo(
    () =>
      days.map((day, i) => (
        <DayPdfPage
          key={`day-pdf-${day.id}`}
          dayIndex={i}
          taos={taosMapRef.current.get(day.id)}
          routingResponses={routeResponsesMapRef.current.get(day.id)}
        />
      )),
    [days, allDaysFetched],
  );

  return (
    <Box className="trip-pdf-preview-page">
      <Box className="pdf-pages-box">
        {/* overview page */}
        {/* <PdfPagePreview> */}
          <PdfPage>
            <Box className="page-box max-content">
              <NameComponent trip={trip} readonly />

              <Box>
                <Typography color="primary" fontWeight="bold" variant="h6">
                  Summary
                </Typography>
                <Suspense fallback={<Box>{trip?.description}</Box>}>
                  <MarkdownBox text={trip?.description} disableGap />
                </Suspense>
              </Box>

              <Box className="map-box">
                <Map markers={geoMarkers} showMarkerLabel readonly />
              </Box>
            </Box>
          </PdfPage>
        {/* </PdfPagePreview> */}

        {/* day pages */}
        {dayPages}
      </Box>
    </Box>
  );
};

export default TripPdfReviewPage;
