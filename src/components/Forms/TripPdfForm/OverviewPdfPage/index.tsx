import PdfPage from "@components/PdfPage";
import PdfPagePreview from "@components/PdfPagePreview";
import NameComponent from "@components/Profile/TripProfile/NameComponent";
import { Box, Typography } from "@mui/material";
import type { Trip } from "@services/trips";
import React, { Suspense } from "react";
import type { Marker } from "@constants/Types";
import Map from "@components/Map";

// lazy load
const MarkdownBox = React.lazy(() => import("@components/MarkdownBox"));


type OverviewPdfPageProps = {
  trip: Trip | undefined;
  markers: Marker[] | undefined;
};

const OverviewPdfPage = React.memo(
  ({ trip, markers }: OverviewPdfPageProps) => {
    return (
      <PdfPagePreview>
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
              <Map markers={markers} showMarkerLabel readonly />
            </Box>
          </Box>
        </PdfPage>
      </PdfPagePreview>
    );
  },
);

export default OverviewPdfPage;
