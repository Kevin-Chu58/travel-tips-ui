import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FiBox, FiPlus, FiRefreshCw } from "react-icons/fi";
import type { Ad } from "@services/feed/ads";
import { StyleUtils } from "@utils/StyleUtils";
import type { Business } from "@services/feed/businesses";
import TTIconButton from "@components/TTIconButton";
import { useNavigate } from "react-router";
import { useIsMobile } from "@hooks/useIsMobile";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import React from "react";
import clsx from "clsx";
import "./index.scss";

// lazy load
const AdForm = React.lazy(() => import("@components/Forms/AdForm"));

type AdsContentProps = {
  business: Business | undefined;
  ads: Ad[];
  setAds: (state: Ad[]) => void;
  initAds: () => void;
  openDrawer: () => void;
  isLoading: boolean;
};

const AdsContent = ({
  business,
  ads,
  setAds,
  initAds,
  openDrawer,
  isLoading,
}: AdsContentProps) => {
  // window
  const isMobile = useIsMobile();
  // open form status
  const [openAdForm, setOpenAdForm] = useState<boolean>(false);
  // others
  const navigate = useNavigate();

  const asyncPostAd = (ad: Ad) => {
    setAds([...ads, ad]);
  };

  return (
    <Box className="column full flex content-page business-dashboard-ads-content">
      <Box className="column flex">
        <Box className="row">
          {isMobile && (
            <Box>
              <IconButton onClick={openDrawer}>
                <MenuIcon fontSize="large" />
              </IconButton>
            </Box>
          )}
          <Typography variant="h4" className="content-header">
            Ads
          </Typography>
        </Box>
        <Box
          className={clsx("section gap stretch", isMobile ? "column" : "row")}
        >
          <Box className="notification-box">
            <b>Metric Monitoring:</b> Please be advised that{" "}
            <u>
              we do not track or report on advertisement impressions or
              click-through rates
            </u>
            . We recommend monitoring your advertising expenditure closely to
            ensure it aligns with your budget.
          </Box>
          <Box className="notification-box">
            <b>Ad Frequency:</b> Advertisements are displayed at an interval of
            one per every eight published trips. To ensure your purchase is
            fully utilized and cost-effective,{" "}
            <u>
              please verify that your target includes a minimum of eight trips.
            </u>
          </Box>
        </Box>
        <Box className="row gap button-box">
          <TTIconButton onClick={initAds} noBorder>
            <FiRefreshCw />
          </TTIconButton>
          <Button
            variant="contained"
            color="utility"
            startIcon={<FiPlus />}
            onClick={() => setOpenAdForm(true)}
            disableRipple
          >
            Create Ad
          </Button>
        </Box>
        <Divider />
        {!isLoading ? (
          isMobile ? (
            ads.map((ad) => (
              <React.Fragment key={ad.id}>
                <Box
                  className="column section"
                  onClick={() => navigate(`${ad.id}`)}
                >
                  <Box className="row">
                    <Typography className="params">Title</Typography>
                    <Typography>{ad.title}</Typography>
                  </Box>
                  <Box className="row">
                    <Typography className="params">Status</Typography>
                    <Chip
                      color={StyleUtils.getColorThemeByAdStatus(ad.status)}
                      label={ad.status}
                      size="small"
                    />
                  </Box>
                  <Box className="row">
                    <Typography className="params">
                      Stripe Subscription Status
                    </Typography>
                    {ad.subStatus ? (
                      <Chip
                        color={StyleUtils.getColorThemeByAdStatus(ad.subStatus)}
                        label={ad.subStatus}
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2">not subscribed</Typography>
                    )}
                  </Box>
                </Box>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Strip Subscription Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ads.map((ad) => (
                  <TableRow key={ad.id} onClick={() => navigate(`${ad.id}`)}>
                    <TableCell align="right">
                      <Box className="row center indicator">
                        <FiBox />
                      </Box>
                    </TableCell>
                    <TableCell>{ad.title}</TableCell>
                    <TableCell>
                      <Chip
                        color={StyleUtils.getColorThemeByAdStatus(ad.status)}
                        label={ad.status}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box className="column start">
                        {ad.subStatus ? (
                          <Chip
                            color={StyleUtils.getColorThemeByAdStatus(
                              ad.subStatus,
                            )}
                            label={ad.subStatus}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2">
                            not subscribed
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        ) : (
          <Box className="column center v-center flex">
            <CircularProgress color="success" aria-label="Loading…" />
          </Box>
        )}

        {/* forms */}
        <AdForm
          open={openAdForm}
          onClose={() => setOpenAdForm(false)}
          asyncAd={asyncPostAd}
          ad={undefined}
          business={business}
        />

        {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            className="tabs"
            value={navTabValue}
            onChange={handleNavTabChange}
          >
            <Tab label="all ads" value={1} disableRipple />
            <Tab label="subscription logs" value={2} disableRipple />
          </Tabs>
        </Box> */}
      </Box>
    </Box>
  );
};

export default AdsContent;
