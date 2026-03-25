import { useIsMobile } from "@hooks/useIsMobile";
import { Box, Container, Grid, Link, Typography } from "@mui/material";
import {
  MdKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import {
  IoIosLock,
  IoMdPeople,
  IoMdEye,
  IoIosArrowForward,
} from "react-icons/io";
import NavButton from "@components/Button/NavButton";
import TTButton from "@components/TTButton";
import { useNavigate } from "react-router";
import { useRef } from "react";
import clsx from "clsx";
import "./index.scss";

const Membership = () => {
  // window
  const isMobile = useIsMobile();
  // ref
  const overviewRef = useRef<HTMLDivElement | null>(null);
  // others
  const navigate = useNavigate();

  const handleScrollToOverview = () => {
    if (overviewRef.current) {
      overviewRef.current.scrollIntoView({
        behavior: "smooth", // Animates the scroll
        block: "start", // Aligns element to the top of the view
      });
    }
  };

  return (
    <Container className="membership-view" maxWidth={false} disableGutters>
      <Box className="section sec-1">
        <Box className="sec-1-overlay">
          <Box className={clsx("sec-1-content", isMobile && "mobile")}>
            <Typography className={clsx("sec-1-text", isMobile && "mobile")}>
              for travelers
            </Typography>
            <Typography className={clsx("sec-1-text", isMobile && "mobile")}>
              by travelers
            </Typography>
          </Box>

          <Link
            className="subscribe-link"
            onClick={() => navigate("/subscription")}
          >
            Subscribe Now
          </Link>

          <Box className="column center sec-1-footer">
            <TTButton
              className="scroll-button"
              variant="outlined"
              color="inherit"
              onClick={handleScrollToOverview}
            >
              Membership Overview
            </TTButton>
            <Typography>scroll down for details</Typography>
            <MdKeyboardDoubleArrowDown className="sec-1-footer-arrow-down" />
          </Box>
        </Box>
      </Box>

      <Box className="section sec-2">
        <Typography className="sec-header">Privacy Boost</Typography>
        <Box className="row center full sec-2-content">
          <Box className="column center">
            <IoIosLock className="sec-2-icon" />
            <Typography>Lock an Event</Typography>
          </Box>
          <Box className="column center">
            <IoMdPeople className="sec-2-icon" />
            <Typography>Share Trips With Others</Typography>
          </Box>
          <Box className="column center">
            <IoMdEye className="sec-2-icon" />
            <Typography>Details Only Shared Sees</Typography>
          </Box>
        </Box>
      </Box>

      <Box className="section sec-3">
        <Typography className="sec-header">Generate PDF</Typography>
        <Box className="row">
          <Typography variant="h4">1</Typography>
          <Typography className="sec-3-text">
            Convert trip overview, daily events, <br /> and routings into one
            single PDF.
          </Typography>
        </Box>
        <Box className="row">
          <Typography variant="h4">2</Typography>
          <Typography className="sec-3-text">
            Save it somewhere in your device.
          </Typography>
        </Box>
        <Box className="row">
          <Typography variant="h4">3</Typography>
          <Typography className="sec-3-text">
            Send it to your friends!
          </Typography>
        </Box>
        <NavButton link="https://drive.google.com/file/d/1VlCHAg-Gg3eHIyfPypwSlbnrw5wjUqqo/view?usp=sharing">
          <TTButton endIcon={<IoIosArrowForward />} color="utility" circular>
            Example
          </TTButton>
        </NavButton>
      </Box>

      <Box className="section sec-2">
        <Typography className="sec-header">More Trips!</Typography>
        <Box className="column center sec-4-content">
          <Box className="row">
            <Typography variant="h2">3</Typography>
            <MdOutlineKeyboardDoubleArrowRight className="sec-4-arrow-icon" />
            <Typography className="focus" variant="h2">
              50
            </Typography>
          </Box>
          <Typography variant="h5">Max Number of Trips</Typography>
        </Box>
      </Box>

      <Box className="section sec-3" ref={overviewRef}>
        <Typography className="sec-header">Membership Overview</Typography>
        <TTButton
          className="subscribe-button"
          color="primary"
          onClick={() => navigate("/subscription")}
        >
          Subscribe Now
        </TTButton>

        <Grid container className="overview-table">
          <Grid container size={12} className="head">
            <Grid size={6}></Grid>
            <Grid size={3}>Free</Grid>
            <Grid size={3}>Member</Grid>
          </Grid>
          <Grid container size={12} className="grid-row">
            <Grid size={6}>Max Number of Trips</Grid>
            <Grid size={3}>3</Grid>
            <Grid size={3}>50</Grid>
          </Grid>
          <Grid container size={12} className="grid-row">
            <Grid size={6}>Search Public Trips</Grid>
            <Grid size={3} className="true">
              ✔
            </Grid>
            <Grid size={3} className="true">
              ✔
            </Grid>
          </Grid>
          <Grid container size={12} className="grid-row">
            <Grid size={6}>View Shared Trips</Grid>
            <Grid size={3} className="true">
              ✔
            </Grid>
            <Grid size={3} className="true">
              ✔
            </Grid>
          </Grid>
          <Grid container size={12} className="grid-row">
            <Grid size={6}>Share Trips with Others</Grid>
            <Grid size={3} className="false">
              ✘
            </Grid>
            <Grid size={3} className="true">
              ✔
            </Grid>
          </Grid>
          <Grid container size={12} className="grid-row">
            <Grid size={6}>Lock Events as Private</Grid>
            <Grid size={3} className="false">
              ✘
            </Grid>
            <Grid size={3} className="true">
              ✔
            </Grid>
          </Grid>
          <Grid container size={12} className="grid-row">
            <Grid size={6}>Generate Trip PDF</Grid>
            <Grid size={3} className="false">
              ✘
            </Grid>
            <Grid size={3} className="true">
              ✔
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Membership;
