import {
  Box,
  Chip,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
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
import ImageIcon from "@mui/icons-material/Image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteBannerForm from "@components/Forms/DeleteBannerForm";
import { useCursorScroll } from "@hooks/useCursorScroll";
import NavTopFab from "@components/Behavioral/NavTopFab";
import LibraryDialog from "@components/ImageSelector/LibraryDialog";
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
  const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false);

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
              <TTButton
                color="info"
                startIcon={<ImageIcon />}
                onClick={() => setImageDialogOpen(true)}
              >
                Image Gallery
              </TTButton>
            </Box>

            {/* banners */}
            {banners.length > 0 ? (
              <TableContainer component={Paper}>
                <Table className="banner-table" aria-label="banner-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell align="right">From</TableCell>
                      <TableCell align="right">To</TableCell>
                      <TableCell align="right">Label</TableCell>
                      <TableCell align="right">Sub-label</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {banners.map((banner) => (
                      <TableRow key={banner.id} onClick={() => handleBannerClick(banner.id)}>
                        <TableCell>{banner.title}</TableCell>
                        <TableCell align="right">{banner.from}</TableCell>
                        <TableCell align="right">
                          {banner.to ? banner.to : "-"}
                        </TableCell>
                        <TableCell align="right">
                          {banner.label ? (
                            <Chip
                              label={banner.label}
                              size="small"
                              color="utility"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {banner.subLabel ? (
                            <Chip
                              label={banner.subLabel}
                              size="small"
                              color="utility"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="error"
                            onClick={(e) => handleDeleteClick(e, banner.id)}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No banners available.</Typography>
            )}
          </React.Fragment>
        ) : (
          <Typography>Please view this on computer.</Typography>
        )}
      </Box>

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

      <LibraryDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        banner
        hasAction={false}
      />
    </Container>
  );
};

export default Banner;
