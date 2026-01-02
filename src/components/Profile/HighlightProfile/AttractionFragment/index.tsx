import { Box, Chip, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";
import Map from "@components/Map";
import MapUtils from "@utils/MapUtils";
import type { HerePlace } from "@services/hereMap/hereMap";
import NavButton from "@components/Button/NavButton";
import { SiTripadvisor, SiYelp, SiGooglemaps } from "react-icons/si";
import TimeUtils from "@utils/TimeUtils";
import { useIsMobile } from "@hooks/useIsMobile";
import OpeningHours from "@components/OpeningHours";
import { UrlUtils } from "@utils/UrlUtils";
import TTButton from "@components/TTButton";
import clsx from "clsx";
import "./index.scss";

type AttractionFragmentProps = {
  herePlace: HerePlace | undefined;
};

const AttractionFragment = ({ herePlace }: AttractionFragmentProps) => {
  // window
  const isMobile = useIsMobile();
  // opening hours
  const openingHours = TimeUtils.parseWeeklyHours(
    herePlace?.openingHours?.at(0)?.text
  );
  const isOpened = TimeUtils.isOpenNow(openingHours);
  const surroundingDates = TimeUtils.getSurroundingDates(
    new Date(),
    isMobile ? 2 : 3
  );
  // websites
  const websites = herePlace?.contacts
    ?.at(0)
    ?.www?.map((url) => url.value)
    .filter((url) => url.includes("https"));
  const siteNames = websites?.map((site) => UrlUtils.getSiteName(site));
  // references
  const tripadvisor = herePlace?.references
    ?.filter((ref) => ref.supplier?.id === "tripadvisor")
    .map((ref) => ref.id);
  const yelp = herePlace?.references
    ?.filter((ref) => ref.supplier?.id === "yelp")
    .map((ref) => ref.id);
  const hasWebsite = websites !== undefined && websites.length > 0;
  const hasTripAdvisor = tripadvisor !== undefined && tripadvisor.length > 0;
  const hasYelp = yelp !== undefined && yelp.length > 0;
  // menu open status
  const [anchorElOfficial, setAnchorElOfficial] =
    useState<HTMLElement | null>(); // official menu
  const [anchorElTripAdvisor, setAnchorElTripAdvisor] =
    useState<HTMLElement | null>(); // tripadvisor menu
  const [anchorElYelp, setAnchorElYelp] = useState<HTMLElement | null>(); // yelp menu

  const markers = herePlace
    ? [
        {
          id: herePlace.id,
          label: herePlace.title,
          lat: herePlace.position.lat,
          lng: herePlace.position.lng,
          zoom: MapUtils.resultTypeToZoom(herePlace.resultType),
        },
      ]
    : [];

  // anchoring menu

  const handleOpenOfficialMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElOfficial(e.currentTarget);
  };

  const handleCloseOfficialMenu = () => {
    setAnchorElOfficial(null);
  };
  const handleOpenTripAdvisorMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElTripAdvisor(e.currentTarget);
  };

  const handleCloseTripAdvisorMenu = () => {
    setAnchorElTripAdvisor(null);
  };
  const handleOpenYelpMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElYelp(e.currentTarget);
  };

  const handleCloseYelpMenu = () => {
    setAnchorElYelp(null);
  };

  // reusable components

  const getGoogleMapNavButton = (className?: string) => {
    return (
      <React.Fragment>
        {herePlace ? (
          <NavButton
            className={className}
            link={MapUtils.getGoogleMapLink(herePlace.address.label)}
            icon={<SiGooglemaps size={24} />}
            label="Google Map"
            color="success"
            hovered
          />
        ) : undefined}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {herePlace ? (
        <React.Fragment>
          <Box className="highlight-profile-attraction-fragment-container">
            {/* title */}
            <Typography
              variant="h4"
              className="highlight-profile-attraction-fragment-title"
            >
              {herePlace.title}
            </Typography>

            {/* address */}
            <Typography className="highlight-profile-attraction-fragment-address">
              {herePlace.address.label}
            </Typography>

            {/* categories */}
            <Box className="highlight-profile-attraction-fragment-chip-container">
              {herePlace.categories?.map((category) => (
                <Chip
                  key={category.name}
                  className={clsx(
                    "highlight-profile-attraction-fragment-chip",
                    category.primary && "primary"
                  )}
                  label={category.name}
                />
              ))}
            </Box>

            {/* map */}
            <Box className="highlight-profile-attraction-fragment-map-container">
              <Map readonly markers={markers} focusId={herePlace.id} />
              {getGoogleMapNavButton(
                "highlight-profile-attraction-fragment-google-map-link"
              )}
            </Box>

            {/* opening hours */}
            {herePlace.openingHours ? (
              <Box className="highlight-profile-attraction-fragment-opening-hours-container">
                {/* header */}
                <Box className="highlight-profile-attraction-fragment-opening-hours-header-container">
                  <Typography variant="h6">Opening Hours</Typography>
                  <Typography variant="h6" color="error">
                    {isOpened ? "Opening Now" : "Closed Today"}
                  </Typography>
                </Box>
                {/* content */}
                <OpeningHours
                  surroundingDates={surroundingDates}
                  openingHours={openingHours}
                />
                <Box className="highlight-profile-attraction-fragment-opening-hours-content-container">
                  <Typography className="theme-typography" variant="caption">
                    *For holiday schedules or real-time opening hours, please
                    visit{" "}
                  </Typography>

                  {getGoogleMapNavButton()}
                </Box>
              </Box>
            ) : undefined}

            {/* food types */}
            {herePlace.foodTypes ? (
              <React.Fragment>
                <Box>
                  <Typography variant="h6">Cuisine</Typography>
                </Box>
                <Box className="highlight-profile-attraction-fragment-section-container">
                  {herePlace.foodTypes.map((type) => (
                    <Chip
                      className={clsx(
                        "highlight-profile-attraction-fragment-chip",
                        type.primary && "primary"
                      )}
                      key={type.id}
                      label={type.name}
                    />
                  ))}
                </Box>
              </React.Fragment>
            ) : undefined}
          </Box>

          {/* relevant websites */}
          {hasWebsite || hasTripAdvisor || hasYelp ? (
            <Box>
              <Typography variant="h6">Relevant Websites</Typography>
              <Box className="highlight-profile-attraction-fragment-section-container">
                {/* official */}
                {hasWebsite ? (
                  <React.Fragment>
                    <TTButton
                      className="highlight-profile-button"
                      endIcon={websites.length}
                      onClick={(e) => handleOpenOfficialMenu(e)}
                      circular
                    >
                      Official ·
                    </TTButton>
                    <Menu
                      anchorEl={anchorElOfficial}
                      open={Boolean(anchorElOfficial)}
                      onClose={handleCloseOfficialMenu}
                    >
                      {websites?.map((url, i) => (
                        <NavButton key={url} link={url}>
                          <MenuItem>
                            {UrlUtils.getSiteLogo(siteNames?.at(i))}
                            <Typography className="highlight-profile-limit-text">
                              {url}
                            </Typography>
                          </MenuItem>
                        </NavButton>
                      ))}
                    </Menu>
                  </React.Fragment>
                ) : undefined}

                {/* tripadvisor */}
                {hasTripAdvisor ? (
                  <React.Fragment>
                    <TTButton
                      className="highlight-profile-button"
                      startIcon={<SiTripadvisor size={24} />}
                      endIcon={tripadvisor.length}
                      onClick={(e) => handleOpenTripAdvisorMenu(e)}
                      circular
                    >
                      TripAdvisor ·
                    </TTButton>
                    <Menu
                      anchorEl={anchorElTripAdvisor}
                      open={Boolean(anchorElTripAdvisor)}
                      onClose={handleCloseTripAdvisorMenu}
                    >
                      {tripadvisor?.map((id) => (
                        <NavButton
                          key={id}
                          link={`https://www.tripadvisor.com/${id}`}
                        >
                          <MenuItem>
                            <SiTripadvisor size={24} />
                            <Typography className="highlight-profile-limit-text">
                              {`https://www.tripadvisor.com/${id}`}
                            </Typography>
                          </MenuItem>
                        </NavButton>
                      ))}
                    </Menu>
                  </React.Fragment>
                ) : undefined}

                {/* yelp */}
                {hasYelp ? (
                  <React.Fragment>
                    <TTButton
                      className="highlight-profile-button"
                      startIcon={<SiYelp size={24} />}
                      endIcon={yelp.length}
                      onClick={(e) => handleOpenYelpMenu(e)}
                      circular
                    >
                      Yelp ·
                    </TTButton>
                    <Menu
                      anchorEl={anchorElYelp}
                      open={Boolean(anchorElYelp)}
                      onClose={handleCloseYelpMenu}
                    >
                      {tripadvisor?.map((id) => (
                        <NavButton
                          key={id}
                          link={`https://www.yelp.com/biz/${id}`}
                        >
                          <MenuItem>
                            <SiYelp size={24} />
                            <Typography className="highlight-profile-limit-text">
                              {`https://www.yelp.com/biz/${id}`}
                            </Typography>
                          </MenuItem>
                        </NavButton>
                      ))}
                    </Menu>
                  </React.Fragment>
                ) : undefined}
              </Box>

              <Typography className="theme-typography" variant="caption">
                *External sources for reviews, photos, and details
              </Typography>
            </Box>
          ) : undefined}
        </React.Fragment>
      ) : undefined}
    </React.Fragment>
  );
};

export default AttractionFragment;
