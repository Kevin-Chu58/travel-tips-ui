import TTButton from "@components/TTButton";
import { Box, Grid, Typography } from "@mui/material";
import { adsService, type Ad } from "@services/feed/ads";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { Link } from "react-router";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdCard from "@components/Cards/AdCard";

type AdReviewProps = {
  ad: Ad;
};

const AdReview = ({ ad }: AdReviewProps) => {
  // ad detail
  const [adDetail, setAdDetail] = useState<Ad | undefined>();
  // status
  const [status, setStatus] = useState<string>(ad.status);

  const approvePendingAd = async (adId: number) => {
    try {
      await adsService.updateAdStatus(adId, 1);
      setStatus("active");
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const rejectPendingAd = async (adId: number) => {
    try {
      await adsService.updateAdStatus(adId, 4);
      setStatus("denied");
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const handleViewAdClick = async () => {
    try {
      let adDetail = await adsService.getAdById(ad.id);
      setAdDetail(adDetail);
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  return (
    <Box>
      <Grid container columns={{ xs: 6, md: 12 }} spacing={1}>
        <Grid size={4}>
          <b>Title</b>
        </Grid>
        <Grid size={8}>{ad.title}</Grid>
        <Grid size={4}>
          <b>Link</b>
        </Grid>
        <Grid size={8}>
          {ad.link ? <Link to={ad.link}>{ad.link}</Link> : "N/A"}
        </Grid>
        {adDetail ? (
          <Box width="240px">
            <AdCard ad={adDetail} />
          </Box>
        ) : (
          <TTButton
            color="utility"
            startIcon={<VisibilityIcon />}
            onClick={handleViewAdClick}
          >
            View Ad Card
          </TTButton>
        )}
      </Grid>
      <Box className="row section gap-large">
        {status === "active" ? (
          <Typography color="success">You approved this ad.</Typography>
        ) : status === "denied" ? (
          <Typography color="error">You rejected this ad.</Typography>
        ) : (
          <React.Fragment>
            <TTButton
              onClick={() => approvePendingAd(ad.id)}
              color="success"
              variant="outlined"
              disabled={!adDetail}
            >
              Approve
            </TTButton>
            <TTButton
              onClick={() => rejectPendingAd(ad.id)}
              color="error"
              variant="outlined"
              disabled={!adDetail}
            >
              Reject
            </TTButton>
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};

export default AdReview;
