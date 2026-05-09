import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { businessesService, type Business } from "@services/feed/businesses";
import { useIsMobile } from "@hooks/useIsMobile";
import { type Ad } from "@services/feed/ads";
import { Link } from "react-router";
import TTButton from "@components/TTButton";
import React from "react";
import { imagesService, type Image } from "@services/images";
import { ImageType } from "@constants/Enums";
import { enqueueSnackbar } from "notistack";
import MenuIcon from "@mui/icons-material/Menu";
import clsx from "clsx";
import "./index.scss";

// lazy load
const ImageSelector = React.lazy(() => import("@components/ImageSelector"));

type HomeContentProps = {
  business: Business | undefined;
  setBusiness: React.Dispatch<React.SetStateAction<Business | undefined>>;
  ads: Ad[];
  openDrawer: () => void;
};

const HomeContent = ({
  business,
  setBusiness,
  ads,
  openDrawer,
}: HomeContentProps) => {
  // window
  const isMobile = useIsMobile();

  const setImage = (image: Image) => {
    if (!business) return;

    setBusiness((prev) => ({
      ...prev!,
      imageId: image.id,
      picture: image.url,
    }));
  };

  // handle functions

  const handleRemoveImage = async () => {
    if (!business) return;

    try {
      await imagesService.deleteBusinessImage(business.id);
      setBusiness((prev) => ({
        ...prev!,
        imageId: undefined,
        picture: undefined,
      }));
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const handleSetActiveStatus = async (isActive: boolean) => {
    if (!business) return;

    let newStatus = await businessesService.updateBusinessActiveStatus(
      business.id,
      isActive,
    );
    setBusiness((prev) => ({ ...prev!, status: newStatus }));
  };

  const uploadLogoButton = (overwrite: boolean = false) => {
    return (
      <ImageSelector
        setImage={setImage}
        imageType={ImageType.Business}
        identifier={business?.id}
      >
        <TTButton color="utility" stopPropagation={false} fakeButton>
          upload {overwrite ? "new" : ""}
        </TTButton>
      </ImageSelector>
    );
  };

  return business ? (
    <Box className="column full content-page business-dashboard-home-content">
      {/* business section */}
      <Box className="column">
        <Box className="row">
          {isMobile && (
            <Box>
              <IconButton onClick={openDrawer}>
                <MenuIcon fontSize="large" />
              </IconButton>
            </Box>
          )}
          <Typography variant="h4" className="content-header">
            Business
          </Typography>
        </Box>
        <Divider />
        <Grid
          className="business-grid"
          container
          columns={{ xs: 5, md: 6 }}
          spacing={1}
        >
          <Grid size={1}>
            <Typography className="params">Name</Typography>
          </Grid>
          <Grid size={5}>
            <Typography>{business.name}</Typography>
          </Grid>
          <Grid size={1}>
            <Typography className="params">Website</Typography>
          </Grid>
          <Grid size={5}>
            <Link to={business.website} target="_blank" rel="noopener">
              <Typography>{business.website}</Typography>
            </Link>
          </Grid>
          <Grid size={1}>
            <Typography className="params">Address</Typography>
          </Grid>
          <Grid size={5}>
            <Typography>{business.address}</Typography>
          </Grid>
          <Grid size={1}>
            <Typography className="params">Status</Typography>
          </Grid>
          <Grid size={5}>
            <Box className="row">
              <Box className={clsx("status-box", `${business.status}-bg`)} />
              <Typography>{business.status}</Typography>
            </Box>
            {/* update active status */}
            {business.status === "active" ? (
              <Typography
                className="active-status-text"
                onClick={() => handleSetActiveStatus(false)}
              >
                set to inactive (also inactives all active ads)
              </Typography>
            ) : undefined}
            {business.status === "inactive" ? (
              <Typography
                className="active-status-text"
                onClick={() => handleSetActiveStatus(true)}
              >
                set to active
              </Typography>
            ) : undefined}
          </Grid>
          <Grid size={1}>
            <Typography className="params">Icon</Typography>
          </Grid>
          <Grid size={5}>
            <Box className="row">
              {business.picture ? (
                <React.Fragment>
                  <Avatar className="business-icon" src={business.picture} />
                  <Box className="column center gap">
                    {uploadLogoButton(true)}
                    <TTButton onClick={handleRemoveImage}>Remove</TTButton>
                  </Box>
                </React.Fragment>
              ) : (
                uploadLogoButton()
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* overview section */}
      <Box className="column">
        <Typography variant="h4" className="content-header">
          Overview
        </Typography>
        <Divider />
        <Box
          className={clsx(
            "wrap overview-container",
            isMobile ? "column" : "row",
          )}
        >
          <Box className={clsx("column overview-box", isMobile && "mobile")}>
            <Box className="row space-between">
              <Typography className="overview-title">Total Ads</Typography>
              <Link to="ads">
                <Typography>View All</Typography>
              </Link>
            </Box>
            <Typography className="overview-title" variant="h3">
              {ads.length}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  ) : (
    <Box className="column center v-center flex">
      <CircularProgress color="success" aria-label="Loading…" />
    </Box>
  );
};

export default HomeContent;
