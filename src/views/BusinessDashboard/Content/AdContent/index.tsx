import { Box, Chip, Divider, Grid, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { adsService, type AdSubLog, type Ad } from "@services/feed/ads";
import AdCard from "@components/Cards/AdCard";
import { useIsMobile } from "@hooks/useIsMobile";
import TTButton from "@components/TTButton";
import { FiEdit } from "react-icons/fi";
import { StyleUtils } from "@utils/StyleUtils";
import AdForm from "@components/Forms/AdForm";
import type { Business } from "@services/feed/businesses";
import { enqueueSnackbar } from "notistack";
import clsx from "clsx";
import "./index.scss";
import AdLog from "./AdLog";

type AdContentProps = {
  business: Business | undefined;
};

const AdContent = ({ business }: AdContentProps) => {
  // window
  const isMobile = useIsMobile();
  // params
  const { adId } = useParams();
  // ad
  const [ad, setAd] = useState<Ad | undefined>();
  // ad logs
  const [adLogs, setAdLogs] = useState<AdSubLog[]>([]);
  // open form status
  const [openAdForm, setOpenAdForm] = useState<boolean>(false);

  useEffect(() => {
    initAd();
    initAdLogs();
  }, [adId]);

  // init functions

  const initAd = async () => {
    if (!adId) return;

    try {
      let id = Number.parseInt(adId);

      let ad = await adsService.getAdById(id);
      setAd(ad);
    } catch (_) {}
  };

  const initAdLogs = async () => {
    if (!adId) return;

    try {
      let id = Number.parseInt(adId);

      let adLogs = await adsService.getAdSubLogs(id);
      setAdLogs(adLogs);
    } catch (_) {}
  };

  const asyncPatchAd = (ad: Ad) => {
    setAd((prev) => ({ ...ad, businessName: prev?.businessName }));
  };

  // handle functions

  const handleActiveStatusClick = async (isActive: boolean) => {
    if (!ad) return;

    try {
      let newStatus = await adsService.updateAdActiveStatus(ad.id, isActive);
      setAd((prev) => ({ ...prev!, status: newStatus }));

      enqueueSnackbar("Ad status is updated.", { variant: "success" });
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  // components

  const getActiveStatusButton = () => {
    switch (ad?.status) {
      case "active":
        return (
          <TTButton
            variant="outlined"
            onClick={() => handleActiveStatusClick(false)}
            disableRipple
          >
            set to inactive
          </TTButton>
        );

      case "inactive":
        return (
          <TTButton
            variant="outlined"
            onClick={() => handleActiveStatusClick(true)}
            disableRipple
          >
            set to active
          </TTButton>
        );
      default:
        return;
    }
  };

  return (
    <Box className="column full content-page business-dashboard-ad-content">
      {/* Section - Ad Detail */}
      <Box className="column">
        <Typography variant="h4" className="content-header">
          Ad Detail
        </Typography>
        <Divider />
        {/* ad detail buttons */}
        <Box
          className={clsx(
            "gap-large ad-detail-button-box",
            isMobile ? "column center" : "row right",
          )}
        >
          {getActiveStatusButton()}
          <TTButton
            color="utility"
            startIcon={<FiEdit />}
            onClick={() => setOpenAdForm(true)}
            disableRipple
          >
            Edit
          </TTButton>
        </Box>
        <Box
          className={clsx(
            isMobile ? "column center" : "row",
            "gap-large stretch ad-detail-box",
          )}
        >
          {/* ad card */}
          {ad ? (
            <Box className="ad-card-container">
              <AdCard ad={ad} />
            </Box>
          ) : undefined}
          {/* ad detail */}
          {ad ? (
            <Box className="column full">
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Typography className="params">
                    <b>Status</b>
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Chip
                    color={StyleUtils.getColorThemeByAdStatus(ad.status)}
                    label={ad.status}
                    size="small"
                  />
                </Grid>
                <Grid size={6}>
                  <Typography className="params">
                    <b>Stripe Subscription Id</b>
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography>{ad.stripeSubscriptionId ?? "N/A"}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography className="params">
                    <b>Stripe Subscription Status</b>
                  </Typography>
                </Grid>
                <Grid size={6}>
                  {ad.subStatus ? (
                    <Chip
                      color={StyleUtils.getColorThemeByAdStatus(ad.subStatus)}
                      label={ad.subStatus}
                      size="small"
                    />
                  ) : (
                    <Typography>N/A</Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          ) : undefined}
        </Box>
      </Box>

      {/* TODO - Section - ad targets */}
      <Box className="column">
        <Typography variant="h4" className="content-header">
          Ad Targets
        </Typography>
        <Divider />
      </Box>

      {/* Section - ad logs */}
      <Box className="column">
        <Typography variant="h4" className="content-header">
          Ad Logs
        </Typography>
        <Divider />
        <Box className="column ad-logs-container">
          {adLogs.map((log) => (
            <AdLog key={log.id} adLog={log} />
          ))}
        </Box>
      </Box>

      {/* forms */}
      <AdForm
        open={openAdForm}
        onClose={() => setOpenAdForm(false)}
        asyncAd={asyncPatchAd}
        business={business}
        ad={ad}
      />
    </Box>
  );
};

export default AdContent;
