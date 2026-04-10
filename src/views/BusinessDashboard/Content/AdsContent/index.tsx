import {
  Box,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FiBox, FiPlus } from "react-icons/fi";
import type { Ad } from "@services/feed/ads";
import { StyleUtils } from "@utils/StyleUtils";
import type { Business } from "@services/feed/businesses";
import AdForm from "@components/Forms/AdForm";
import { useNavigate } from "react-router";
import { useState } from "react";
import "./index.scss";

type AdsContentProps = {
  business: Business | undefined;
  ads: Ad[];
  setAds: (state: Ad[]) => void;
};

const AdsContent = ({ business, ads, setAds }: AdsContentProps) => {
  // ads
  // const [ad, setAd] = useState<Ad | undefined>();
  // open form status
  const [openAdForm, setOpenAdForm] = useState<boolean>(false);
  // others
  const navigate = useNavigate();

  // nav tab
  // const [navTabValue, setNavTabValue] = useState<number>(1);

  // const handleNavTabChange = (
  //   event: React.SyntheticEvent,
  //   newValue: number,
  // ) => {
  //   setNavTabValue(newValue);
  // };

  const asyncPostAd = (ad: Ad) => {
    setAds([...ads, ad]);
  };

  return (
    <Box className="column full content-page business-dashboard-ads-content">
      <Box className="column">
        <Typography variant="h4" className="content-header">
          Ads
        </Typography>
        <Box className="button-box">
          <Button
            className="create-button"
            variant="contained"
            color="success"
            startIcon={<FiPlus />}
            onClick={() => setOpenAdForm(true)}
            disableRipple
          >
            Create Ad
          </Button>
        </Box>
        <Divider />
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
                        color={StyleUtils.getColorThemeByAdStatus(ad.status)}
                        label={ad.status}
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2">not subscribed</Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
