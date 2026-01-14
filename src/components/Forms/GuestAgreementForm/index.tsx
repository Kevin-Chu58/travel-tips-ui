import TermsOfServiceProfile from "@components/Profile/UserAgreementProfile/TermsOfServiceProfile";
import { LS_GUEST_USER_AGREEMENT } from "@constants/localStorage";
import { enqueueSnackbar } from "notistack";
import { Dialog } from "@mui/material";
import "./index.scss";

type GuestAgreementFormProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const GuestAgreementForm = ({ open, setOpen }: GuestAgreementFormProps) => {
  const handleGuestUserAgreementClick = () => {
    localStorage.setItem(LS_GUEST_USER_AGREEMENT, "true");
    setOpen(false);

    enqueueSnackbar("Guest User Agreement Completed!", {variant: "success"});
  };

  return (
    <Dialog className="guest-agreement-form" open={open}>
      <TermsOfServiceProfile isGuest next={handleGuestUserAgreementClick} />
    </Dialog>
  );
};

export default GuestAgreementForm;
