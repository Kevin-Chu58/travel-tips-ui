import { Box, Chip, Container, MenuItem, Typography } from "@mui/material";
import { useIsMobile } from "@hooks/useIsMobile";
import React, { useEffect, useRef, useState } from "react";
import {
  bannersService,
  type Banner,
  type BannerSimple,
} from "@services/feed/banners";
import TTButton from "@components/TTButton";
import AddIcon from "@mui/icons-material/Add";
import BannerForm from "@components/Forms/BannerForm";
import TTIconButton from "@components/TTIconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteBannerForm from "@components/Forms/DeleteBannerForm";
import { useCursorScroll } from "@hooks/useCursorScroll";
import NavTopFab from "@components/Behavioral/NavTopFab";
import clsx from "clsx";
import "./index.scss";

const Banner = () => {
  // window
  const isMobile = useIsMobile();
  // behavior
  const isLoadingRef = useRef<boolean>(false);
  // infinite scrolling
  const containerRef = useRef<HTMLDivElement | null>(null);
  // banners
  const [banners, setBanners] = useState<BannerSimple[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  // banner - selected
  const [bannerId, setBannerId] = useState<number | undefined>();
  // form open status
  const [bannerFormOpen, setBannerFormOpen] = useState<boolean>(false);
  const [deleteBannerFormOpen, setDeleteBannerFormOpen] = useState<
    number | undefined
  >();

  // use effects

  useEffect(() => {
    initiateBanners(true);
  }, []);

  const initiateBanners = async (isInit: boolean = false) => {
    if (!isInit && !cursor) return;

    let banners = await bannersService.getBanners(cursor);
    setBanners(banners.results);
    setCursor(banners.cursor);
  };

  // async functions

  const handleScroll = useCursorScroll(
    containerRef,
    isLoadingRef,
    cursor,
    initiateBanners,
  );

  const asyncAddBanner = (banner: Banner) => {
    setBanners((prev) => [banner, ...prev]);
  };

  const asyncUpdateBanner = (banner: Banner) => {
    let _banners = [...banners];
    let bannerIndex = _banners.findIndex((b) => b.id === banner.id);
    _banners[bannerIndex] = banner;

    setBanners([..._banners]);
  };

  const asyncDeleteBanner = (bannerId: number) => {
    let _banners = banners.filter((b) => b.id !== bannerId);
    setBanners([..._banners]);
  };

  // handle functions

  const handleBannerClick = (bannerId: number) => {
    setBannerId(bannerId);
    setBannerFormOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent, bannerId: number) => {
    e.stopPropagation();
    setDeleteBannerFormOpen(bannerId);
  };

  return (
    <Container
      className="banner-container"
      ref={containerRef}
      onScroll={handleScroll}
      maxWidth={false}
    >
      <Box className={clsx("banner-box", isMobile && "mobile")}>
        {!isMobile ? (
          <React.Fragment>
            {/* header */}
            <Typography variant="h4">Banners</Typography>

            {/* tool bar */}
            <Box className="row tool-bar">
              <TTButton
                color="utility"
                startIcon={<AddIcon />}
                onClick={() => setBannerFormOpen(true)}
              >
                New Banner
              </TTButton>
            </Box>

            {/* banners */}
            {banners.length > 0 ? (
              <Box className="banner-cards-box">
                {banners.map((banner) => (
                  <MenuItem
                    key={banner.id}
                    onClick={() => handleBannerClick(banner.id)}
                  >
                    <Typography fontWeight="bold">{banner.title}</Typography>
                    <Typography>From: {banner.from}</Typography>
                    <Typography>To: {banner.to ?? "No end date"}</Typography>
                    {banner.label ? (
                      <Chip label={banner.label} size="small" color="utility" />
                    ) : (
                      <Typography className="no-content">No Label</Typography>
                    )}
                    {banner.subLabel ? (
                      <Chip
                        label={banner.subLabel}
                        size="small"
                        color="utility"
                      />
                    ) : (
                      <Typography className="no-content">
                        No Sub-label
                      </Typography>
                    )}
                    <TTIconButton
                      onClick={(e) => handleDeleteClick(e, banner.id)}
                      noBorder
                    >
                      <DeleteForeverIcon />
                    </TTIconButton>
                  </MenuItem>
                ))}
              </Box>
            ) : (
              <Typography>No banners available.</Typography>
            )}
          </React.Fragment>
        ) : (
          <Typography>Please view this on computer.</Typography>
        )}
      </Box>

      <Box sx={{ height: "200vh" }} />

      {/* fabs */}
      <NavTopFab containerRef={containerRef} />

      {/* forms */}
      <BannerForm
        open={bannerFormOpen}
        onClose={() => {
          setBannerFormOpen(false);
          setBannerId(undefined);
        }}
        bannerId={bannerId}
        asyncAddBanner={asyncAddBanner}
        asyncUpdateBanner={asyncUpdateBanner}
      />

      <DeleteBannerForm
        open={deleteBannerFormOpen}
        onClose={() => setDeleteBannerFormOpen(undefined)}
        asyncDeleteBanner={asyncDeleteBanner}
      />
    </Container>
  );
};

export default Banner;
