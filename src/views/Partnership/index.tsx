import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { useEffect, useState } from "react";
import { businessesService, type Business } from "@services/feed/businesses";
import { useNavigate } from "react-router";
import { enqueueSnackbar } from "notistack";
import {
  Alert,
  Box,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import NavButton from "@components/Button/NavButton";
import ShakyText from "src/stylings/text/ShakeText";
import TTButton from "@components/TTButton";
import TTIconButton from "@components/TTIconButton";
import HandshakeIcon from "@mui/icons-material/Handshake";
import StoreIcon from "@mui/icons-material/Store";
import CloseIcon from "@mui/icons-material/Close";
import clsx from "clsx";
import "./index.scss";

const Partnership = () => {
  // user
  const { userId, isLoading } = useSelector((state: RootState) => state.user);
  // my businesses
  const [businesses, setBusinesses] = useState<Business[]>([]);
  // behavior
  // const [isLoadingBusiness, setIsLoadingBusiness] = useState<boolean>(false);
  const [isLoadingBusinessForm, setIsLoadingBusinessForm] =
    useState<boolean>(false);
  // form
  const [name, setName] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  // open form status
  const [openBusinesses, setOpenBusinesses] = useState<boolean>(false);
  const [openBusinessForm, setOpenBusinessForm] = useState<boolean>(false);
  // others
  const isLogin = !isLoading && userId;
  const navigate = useNavigate();

  // initiate my business
  useEffect(() => {
    if (openBusinesses) {
      initBusinesses();
    }
  }, [openBusinesses]);

  const initBusinesses = async () => {
    // ask for user login if not
    if (!isLogin) {
      enqueueSnackbar("Please login first.", { variant: "info" });
      return;
    }

    if (businesses.length > 0) return;

    let myBusiness = await businessesService.getMyBusiness();
    setBusinesses(myBusiness);
  };

  const clearBusinessForm = () => {
    setName("");
    setWebsite("");
    setAddress("");
  };

  // handle functions

  const handleSubmitBusinessForm = async () => {
    if (!name || !website || !address) {
      enqueueSnackbar("Please fill out all 3 textfields.", { variant: "info" });
      return;
    }

    if (isLoadingBusinessForm) return;

    setIsLoadingBusinessForm(true);

    try {
      let newBusiness = {
        name: name,
        website: website,
        address: address,
      };

      let result = await businessesService.postNewBusiness(newBusiness);
      setBusinesses((prev) => [...prev, result]);

      enqueueSnackbar("Your request is in process.", { variant: "success" });
      handleCloseBusinessForm();
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }

    setIsLoadingBusinessForm(false);
  };

  const handleCloseBusinessForm = () => {
    setOpenBusinessForm(false);
    clearBusinessForm();
  };

  // components

  const newBusinessForm = (
    <Box className="column new-business-form">
      <TextField
        label="Business Name*"
        value={name}
        color="info"
        fullWidth
        onChange={(e) => setName(e.target.value)}
        slotProps={{
          input: {
            endAdornment: <span>{name.length}/100</span>,
          },
        }}
      />
      <TextField
        label="Website*"
        value={website}
        color="info"
        onChange={(e) => setWebsite(e.target.value)}
        slotProps={{
          input: {
            endAdornment: <span>{website.length}/100</span>,
          },
        }}
      />
      <Alert variant="standard" severity="info">
        If you do not have an official website, please find your business on{" "}
        <NavButton link="https://www.google.com/maps">Google Map</NavButton>,
        and paste the share link over here.
      </Alert>
      <TextField
        label="Physical Address*"
        value={address}
        color="info"
        onChange={(e) => setAddress(e.target.value)}
        slotProps={{
          input: {
            endAdornment: <span>{address.length}/200</span>,
          },
        }}
      />
    </Box>
  );

  return (
    <Container className="partnership-view" maxWidth={false} disableGutters>
      <Box className="row image-section">
        {/* direction panel */}
        <Box
          className={clsx("overlay-section", openBusinessForm && "open-form")}
        >
          <Box className="column gap slogan-box">
            <Box className="row center icon-box">
              <HandshakeIcon />
            </Box>
            <Typography variant="h4">Partner with us!</Typography>
            <Box className="column step-box">
              <Typography>1. Register your business</Typography>
              <Typography>2. Create your Ad blocks</Typography>
              <Typography>3. Purchase Ad Targets</Typography>
              <ShakyText text="Improve exposure!" />
            </Box>
            <TTButton
              className="new-button"
              variant="contained"
              color="success"
              circular
              onClick={() => setOpenBusinessForm(true)}
            >
              Register now
            </TTButton>
            <TTButton
              variant="outlined"
              color="utility"
              circular
              onClick={() => setOpenBusinesses(true)}
            >
              View Businesses
            </TTButton>
          </Box>
        </Box>

        {/* new business form */}
        <Box className="overlay-section">
          <Box className="column gap slogan-box">
            <Typography variant="h4">Enter Business Info</Typography>
            <Box className="row center icon-box">
              <StoreIcon />
            </Box>
            {newBusinessForm}
            <TTButton
              className="new-button"
              variant="contained"
              color="success"
              circular
              onClick={handleSubmitBusinessForm}
            >
              Request Approval
            </TTButton>
            <TTButton
              variant="outlined"
              color="utility"
              circular
              onClick={handleCloseBusinessForm}
            >
              Go back
            </TTButton>
          </Box>
        </Box>
      </Box>

      {/* my business form */}
      <Box
        className={clsx("column business-section", openBusinesses && "open")}
      >
        {/* header */}
        <Box className="row">
          <Typography variant="h4">My Business</Typography>
          {/* close button */}
          <TTIconButton
            className="close-button"
            onClick={() => setOpenBusinesses(false)}
            noBorder
          >
            <CloseIcon />
          </TTIconButton>
        </Box>
        <Grid container columns={{ xs: 6, md: 12 }} spacing={1}>
          {businesses.map((b) => (
            <Grid key={b.id} size={6}>
              <Box
                className="column business-card"
                onClick={() => navigate(`/business/${b.id}`)}
              >
                <Typography variant="h5">{b.name}</Typography>
                <Box className="row gap">
                  <Box className={clsx("status-box", `${b.status}-bg`)} />
                  <Typography>{b.status}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Partnership;
