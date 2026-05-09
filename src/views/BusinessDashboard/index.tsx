import { Box, Container } from "@mui/material";
import { Route, Routes, useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { businessesService, type Business } from "@services/feed/businesses";
import { enqueueSnackbar } from "notistack";
import HomeContent from "./Content/HomeContent";
import { type Ad, adsService } from "@services/feed/ads";
import AdsContent from "./Content/AdsContent";
import AdContent from "./Content/AdContent";
import Menu from "./Menu";
import "./index.scss";

type BusinessDashboardMainProps = {
  contentType: string;
};

const BusinessDashboardMain = ({ contentType }: BusinessDashboardMainProps) => {
  // params
  const { businessId } = useParams();
  // business
  const [business, setBusiness] = useState<Business | undefined>();
  // ads
  const [ads, setAds] = useState<Ad[]>([]);
  // behavior
  const [isLoadingAds, setIsLoadingAds] = useState<boolean>(true);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  // const [businessesLoadError, setBusinessesLoadError] =
  //   useState<boolean>(false);
  // others
  const navigate = useNavigate();

  // init business on business id in params
  useEffect(() => {
    initBusiness();
    initAds();
  }, [businessId]);

  // init functions

  const initBusiness = async () => {
    if (!businessId) {
      navigate("/partnership");
      return;
    }

    let id = Number.parseInt(businessId);

    try {
      var result = await businessesService.getBusinessById(id);
      setBusiness(result);
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
      navigate("/partnership");
    }
  };

  const initAds = async () => {
    if (!businessId) return;

    setIsLoadingAds(true);
    try {
      let id = Number.parseInt(businessId);

      var result = await adsService.getMyAdByBusinessId(id);
      setAds(result);
    } catch (_) {}
    setIsLoadingAds(false);
  };

  // handle functions
  const handleOpenDrawer = useCallback(() => {
    setOpenDrawer(true);
  }, []);

  // components
  const getContent = () => {
    switch (contentType) {
      case "home":
        return (
          <HomeContent
            business={business}
            setBusiness={setBusiness}
            ads={ads}
            openDrawer={handleOpenDrawer}
          />
        );
      case "ads":
        return (
          <AdsContent
            business={business}
            ads={ads}
            setAds={setAds}
            initAds={initAds}
            openDrawer={handleOpenDrawer}
            isLoading={isLoadingAds}
          />
        );
      case "ad":
        return <AdContent business={business} openDrawer={handleOpenDrawer} />;
      default:
        return <></>;
    }
  };

  return (
    <Container className="business-dashboard" maxWidth={false} disableGutters>
      <Box className="row full">
        <Menu business={business} open={openDrawer} setOpen={setOpenDrawer} />
        <Box className="column flex business-dashboard-content-box">
          {getContent()}
        </Box>
      </Box>
    </Container>
  );
};

const BusinessDashboard = () => {
  // business

  return (
    <Routes>
      <Route
        path="/:businessId"
        element={<BusinessDashboardMain contentType="home" />}
      />
      <Route
        path="/:businessId/ads"
        element={<BusinessDashboardMain contentType="ads" />}
      />
      <Route
        path="/:businessId/ads/:adId"
        element={<BusinessDashboardMain contentType="ad" />}
      />
    </Routes>
  );
};

export default BusinessDashboard;
