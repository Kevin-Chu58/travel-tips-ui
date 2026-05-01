import PdfPage from "@components/PdfPage";
import PdfPagePreview from "@components/PdfPagePreview";
import NameComponent from "@components/Profile/TripProfile/NameComponent";
import { Box, Typography } from "@mui/material";
import type { Trip } from "@services/trips";
import React from "react";
import MarkdownBox from "@components/MarkdownBox";
import type { Marker } from "@constants/Types";

// lazy load
const Map = React.lazy(() => import("@components/Map"));

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
              <MarkdownBox text={trip?.description} disableGap />
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
