import { Box, Chip, Divider, Grid, Typography } from "@mui/material";
import { Link, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import { adsService, type AdSubLog, type Ad } from "@services/feed/ads";
import AdCard from "@components/Cards/AdCard";
import { useIsMobile } from "@hooks/useIsMobile";
import TTButton from "@components/TTButton";
import { FiChevronsDown, FiEdit, FiPlus, FiRefreshCw } from "react-icons/fi";
import { StyleUtils } from "@utils/StyleUtils";
import type { Business } from "@services/feed/businesses";
import { adTargetsService, type AdTarget } from "@services/feed/adTargets";
import { enqueueSnackbar } from "notistack";
import TTIconButton from "@components/TTIconButton";
import AdTargetCard from "@components/Cards/AdTargetCard";
import {
  type StripeBillingCyclePreviewInvoiceResponse,
  stripesService,
} from "@services/stripe/stripe";
import { StringUtils } from "@utils/StringUtils";
import TimeUtils from "@utils/TimeUtils";
import TTSWitch from "@components/TTSwitch";
import AdLog from "./AdLog";
import clsx from "clsx";
import "./index.scss";

// lazy load
const AdForm = React.lazy(() => import("@components/Forms/AdForm"));
const AdTargetForm = React.lazy(() => import("@components/Forms/AdTargetForm"));

type AdContentProps = {
  business: Business | undefined;
};

const AdContent = ({ business }: AdContentProps) => {
  // window
  const isMobile = useIsMobile();
  // params
  const { adId } = useParams();
  let _adId = adId ? Number.parseInt(adId) : undefined;
  // ad
  const [ad, setAd] = useState<Ad | undefined>();
  // ad targets
  const [adTargets, setAdTargets] = useState<AdTarget[]>([]);
  const [isAdTargetsLoading, setIsAdTargetsLoading] = useState<boolean>(true);
  // ad logs
  const [adLogs, setAdLogs] = useState<AdSubLog[]>([]);
  const [adLogCursor, setAdLogCursor] = useState<string>();
  const [isAdLogsLoading, setIsAdLogsLoading] = useState<boolean>(true);
  // next billing cycle invoice
  const [invoice, setInvoice] = useState<
    StripeBillingCyclePreviewInvoiceResponse | undefined
  >();
  // open form status
  const [openAdForm, setOpenAdForm] = useState<boolean>(false);
  // open flat form status
  const [openAdTargetForm, setOpenAdTargetForm] = useState<boolean>(false);
  const [adTargetFocus, setAdTargetFocus] = useState<AdTarget | undefined>(
    undefined,
  );

  // init on url params
  useEffect(() => {
    initNextBillingCycle();
    initAd();
    initAdTargets();
    initAdLogs();
  }, [adId]);

  // init functions

  const initNextBillingCycle = async () => {
    if (!_adId) return;

    try {
      let invoice =
        await stripesService.PreviewUpcomingBillingCycleInvoiceOnAdWeight(
          _adId,
        );
      setInvoice(invoice);
    } catch (_) {}
  };

  const initAd = async () => {
    if (!_adId) return;

    try {
      let ad = await adsService.getAdById(_adId);
      setAd(ad);
    } catch (_) {}
  };

  const initAdTargets = async () => {
    if (!_adId) return;

    try {
      let adTargets = await adTargetsService.getAdTargetsByAdId(_adId);
      setAdTargets(adTargets);
    } catch (_) {}

    setIsAdTargetsLoading(false);
  };

  const initAdLogs = async () => {
    if (!_adId) return;

    try {
      let adLogs = await adsService.getAdSubLogs(_adId, adLogCursor, 3);

      setAdLogs(adLogs.results);
      setAdLogCursor(adLogs.cursor);
    } catch (_) {}

    setIsAdLogsLoading(false);
  };

  // async functions

  const asyncPatchAd = (ad: Ad) => {
    setAd((prev) => ({ ...ad, businessName: prev?.businessName }));
  };

  // handle functions

  const handleAdTargetFocusClick = (adTargetFocus: AdTarget) => {
    setAdTargetFocus(adTargetFocus);
    setOpenAdTargetForm(true);
  };

  const handleActiveStatusClick = async (isActive: boolean) => {
    if (!_adId) return;

    try {
      let newStatus = await adsService.updateAdActiveStatus(_adId, isActive);
      setAd((prev) => ({ ...prev!, status: newStatus }));

      enqueueSnackbar("Ad status is updated.", { variant: "success" });
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const handleMoreAdLogsClick = async () => {
    if (!adId || !adLogCursor) return;

    try {
      let id = Number.parseInt(adId);
      let adLogs = await adsService.getAdSubLogs(id, adLogCursor, undefined);

      setAdLogs((prev) => [...prev, ...adLogs.results]);
      setAdLogCursor(adLogs.cursor);
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const handleUpdateRenewSubscription = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!ad) return;

    try {
      let newStatus = event.target.checked;

      await adsService.updateRenewSubscription(ad.id, newStatus);

      setAd((prev) => ({ ...prev!, renewSub: newStatus }));

      enqueueSnackbar(
        `${newStatus ? "Enabled" : "Disabled"} subscription auto renew.`,
        { variant: "success" },
      );
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
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
            "gap-large ad-content-button-box",
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
                {invoice ? (
                  <React.Fragment>
                    <Grid size={6}>
                      <Typography className="params">
                        <b>Next Billing Amount</b>
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <b>
                        {StringUtils.formatCurrency(
                          invoice.nextBillingAmount,
                          invoice.currency,
                        )}
                      </b>
                    </Grid>
                    <Grid size={6}>
                      <Typography className="params">
                        <b>Next Billing Date</b>
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <b>{TimeUtils.getDate(invoice.nextBillingDate)}</b>
                    </Grid>
                  </React.Fragment>
                ) : undefined}

                {/* auto renew */}
                {ad.stripeSubscriptionId ? (
                  <Box className="row">
                    <Typography className="params">
                      <b>Auto Renew?</b>
                    </Typography>
                    <TTSWitch
                      checked={ad.renewSub}
                      onChange={handleUpdateRenewSubscription}
                    />
                    <Typography>{ad.renewSub ? "Yes" : "No"}</Typography>
                  </Box>
                ) : undefined}

                <Grid size={12}>
                  <Box className="notification-box">
                    <b>Important:</b> Deactivating an ad does not stop your
                    subscription. To avoid future charges, you must manually
                    cancel your monthly renewal or ad targets.
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : undefined}
        </Box>
      </Box>

      {/* Section - ad targets */}
      <Box className="column">
        <Typography variant="h4" className="content-header">
          Ad Targets
        </Typography>
        <Divider />
        <Box className="column section gap">
          <Box className={clsx("gap", isMobile ? "column" : "row stretch")}>
            <Box className="notification-box">
              <b>For Weight Ranking:</b> Only the top 1000 ad targets in weight
              ranking will enter the feed lottery for specific target types and
              values.{" "}
              <small>
                <em>
                  *Note - the ranking on keyword is expected to be lower than it
                  displays due to the StartWith match.
                </em>
              </small>
            </Box>
            <Box className="notification-box">
              <b>For Ad Target Upgrades:</b> Increases to ad target weights
              constitute a subscription upgrade. Corresponding fees for the
              incremental capacity will be processed immediately upon
              confirmation, often on a{" "}
              <Link
                to="https://recurly.com/blog/prorated-billing-101-what-it-is-and-how-it-works/"
                target="_blank"
                rel="noopener"
              >
                pro rata basis
              </Link>{" "}
              for the remainder of the current billing cycle.
            </Box>
            <Box className="notification-box">
              <b>For Downgrades or Cancellations:</b> Reducing your ad weight
              won't generate a refund. The lower quantity takes effect
              immediately, and you'll simply be charged less on your next
              billing cycle.
            </Box>
          </Box>

          <Box className="row right">
            <TTIconButton onClick={initAdTargets} noBorder>
              <FiRefreshCw />
            </TTIconButton>
            <TTButton
              color="utility"
              startIcon={<FiPlus />}
              onClick={() => setOpenAdTargetForm(true)}
              disableRipple
            >
              New Target
            </TTButton>
          </Box>

          <Divider />
        </Box>
        {!isAdTargetsLoading ? (
          adTargets.length > 0 ? (
            <Box className="column gap">
              {adTargets.map((target) => (
                <AdTargetCard
                  key={target.id}
                  adId={ad?.id}
                  adTarget={target}
                  setAdTargetFocus={handleAdTargetFocusClick}
                  adTargets={adTargets}
                  setAdTargets={setAdTargets}
                />
              ))}
            </Box>
          ) : (
            <Box className="row center section">No target created.</Box>
          )
        ) : undefined}
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
          <Box className="row center section">
            {!isAdLogsLoading ? (
              adLogCursor ? (
                <TTButton
                  color="utility"
                  variant="outlined"
                  startIcon={<FiChevronsDown />}
                  onClick={handleMoreAdLogsClick}
                  disableRipple
                >
                  View More
                </TTButton>
              ) : (
                <Typography variant="caption">-- End --</Typography>
              )
            ) : undefined}
          </Box>
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

      <AdTargetForm
        open={openAdTargetForm}
        onClose={() => setOpenAdTargetForm(false)}
        ad={ad}
        adTargetFocus={adTargetFocus}
        setAdTargetFocus={setAdTargetFocus}
      />
    </Box>
  );
};

export default AdContent;
