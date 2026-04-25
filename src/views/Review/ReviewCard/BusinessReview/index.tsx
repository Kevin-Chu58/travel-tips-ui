import TTButton from "@components/TTButton";
import { Box, Grid, Typography } from "@mui/material";
import { businessesService, type Business } from "@services/feed/businesses";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { Link } from "react-router";

type BusinessReviewProps = {
  business: Business;
};

const BusinessReview = ({ business }: BusinessReviewProps) => {
  // status
  const [status, setStatus] = useState<string>(business.status);

  const approvePendingBusiness = async (businessId: number) => {
    try {
      await businessesService.updateBusinessStatus(businessId, 1);
      setStatus("active");
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const rejectPendingBusiness = async (businessId: number) => {
    try {
      await businessesService.updateBusinessStatus(businessId, 4);
      setStatus("denied");
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  return (
    <Box>
      <Grid container columns={{ xs: 6, md: 12 }} spacing={1}>
        <Grid size={4}>
          <b>Name</b>
        </Grid>
        <Grid size={8}>{business.name}</Grid>
        <Grid size={4}>
          <b>Website</b>
        </Grid>
        <Grid size={8}>
          <Link to={business.website} target="_blank" rel="noopener">
            {business.website}
          </Link>
        </Grid>
        <Grid size={4}>
          <b>Address</b>
        </Grid>
        <Grid size={8}>{business.address}</Grid>
      </Grid>
      <Box className="row section gap-large">
        {status === "active" ? (
          <Typography color="success">You approved this business.</Typography>
        ) : status === "denied" ? (
          <Typography color="error">You rejected this business.</Typography>
        ) : (
          <React.Fragment>
            <TTButton
              onClick={() => approvePendingBusiness(business.id)}
              color="success"
              variant="outlined"
            >
              Approve
            </TTButton>
            <TTButton
              onClick={() => rejectPendingBusiness(business.id)}
              color="error"
              variant="outlined"
            >
              Reject
            </TTButton>
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};

export default BusinessReview;
