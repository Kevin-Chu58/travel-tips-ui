import { Container, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import TTButton from "@components/TTButton";
import { useNavigate } from "react-router";
import { reauth } from "@services/tokens";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { useEffect } from "react";
import "./index.scss";
import { enqueueSnackbar } from "notistack";

const EmailUnverified = () => {
  // user
  const user = useSelector((state: RootState) => state.user);
  // navigate
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.id || (user.id && user.emailVerified)) {
      navigate("/");
    }
  });

  const handleConfirm = async () => {
    await reauth().then(() => {
      navigate("/");
      enqueueSnackbar("Enjoy exploring!", { variant: "success" });
    });
  };

  return (
    <Container className="email-unverified-page" maxWidth="md">
      <EmailIcon className="email-icon" />
      <Typography variant="h5">
        Please verify your email.
        <br />
        Press <strong>Confirm</strong> afterward.
      </Typography>
      <TTButton color="primary" variant="contained" onClick={handleConfirm}>
        Confirm
      </TTButton>
    </Container>
  );
};

export default EmailUnverified;
