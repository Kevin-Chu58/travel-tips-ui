import { Box, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import FoundationProfile from "@components/Profile/UserAgreementProfile/FoundationProfile";
import { useIsMobile } from "@hooks/useIsMobile";
import TermsOfServiceProfile from "@components/Profile/UserAgreementProfile/TermsOfServiceProfile";
import PrivacyPolicyProfile from "@components/Profile/UserAgreementProfile/PrivacyPolicyProfile";
import TTStepper from "@components/TTStepper";
import { usersService } from "@services/users";
import { enqueueSnackbar } from "notistack";
import { setUserAgreement } from "@redux/userSlice";
import clsx from "clsx";
import "./index.scss";

const UserAgreement = () => {
  // window
  const mobile = useIsMobile();
  // user
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  // stepper
  const [activeStep, setActiveStep] = useState<number>(0);
  // others
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user.userAgreement) navigate("/");
  }, [user.userAgreement]);

  const changeStep = (change: number) => {
    setActiveStep(activeStep + change);
  };

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeStep]);

  const next = () => changeStep(1);
  const complete = async () => {
    try {
      const status = await usersService.acceptUserAgreement();
      if (status) {
        dispatch(setUserAgreement(true));
        enqueueSnackbar("Successfully completed User Agreement!", {
          variant: "success",
        });
        next();
      }
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };
  const back = () => changeStep(-1);

  const stepperSteps = ["Foundation", "Service", "Privacy"];

  const stepperContents = [
    <FoundationProfile next={next} />,
    <TermsOfServiceProfile next={next} back={back} />,
    <PrivacyPolicyProfile next={complete} back={back} />,
  ];

  const completedContent = <Box>Finished!</Box>;

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        ref={containerRef}
        className={clsx("user-agreement-container", mobile && "mobile")}
      >
        <Box className="user-agreement-content-container">
          <TTStepper
            activeStep={activeStep}
            steps={stepperSteps}
            contents={stepperContents}
            completeContent={completedContent}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default UserAgreement;
