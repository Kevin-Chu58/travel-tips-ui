import { Box, Container } from "@mui/material";
import { Route, Routes, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
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
  // businesses
  const [businesses, setBusinesses] = useState<Business[]>([]);
  // ads
  const [ads, setAds] = useState<Ad[]>([]);
  // behavior
  // const [businessesLoadError, setBusinessesLoadError] =
  //   useState<boolean>(false);
  // others
  const navigate = useNavigate();

  // init business and businesses on business id in params
  useEffect(() => {
    initBusiness();
    initBusinesses();
    initAds();
  }, [businessId]);

  useEffect(() => {
    if (business) {
      let _businesses = [...businesses];
      let index = _businesses.findIndex((bs) => bs.id === business.id);
      if (index > -1) {
        _businesses[index].status = business.status;
        setBusinesses([..._businesses]);
      }
    }
  }, [business?.status]);

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

  const initBusinesses = async () => {
    try {
      var result = await businessesService.getMyBusiness();
      setBusinesses(result);
    } catch (_) {
      // setBusinessesLoadError(true);
    }
  };

  const initAds = async () => {
    if (!businessId) return;
    try {
      let id = Number.parseInt(businessId);

      var result = await adsService.getMyAdByBusinessId(id);
      setAds(result);
    } catch (_) {}
  };

  // components
  const getContent = () => {
    switch (contentType) {
      case "home":
        return (
          <HomeContent
            business={business}
            setBusiness={setBusiness}
            ads={ads}
          />
        );
      case "ads":
        return <AdsContent business={business} ads={ads} setAds={setAds} />;
      case "ad":
        return <AdContent business={business} />;
      default:
        return <></>;
    }
  };

  return (
    <Container className="business-dashboard" maxWidth={false} disableGutters>
      <Box className="row full">
        <Menu business={business} businesses={businesses} />
        <Box className="business-dashboard-content-box">{getContent()}</Box>
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
