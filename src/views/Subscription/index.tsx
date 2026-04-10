import {
  Box,
  Checkbox,
  Container,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  subscriptionsService,
  type Subscription,
} from "@services/plan/subscriptions";
import { stripesService } from "@services/stripe/stripe";
import SubscriptionHistoryForm from "@components/Forms/SubscriptionHistoryForm";
import SubscriptionCard from "@components/Cards/SubscriptionCard";
import { SubscriptionType } from "@constants/Enums";
import TTButton from "@components/TTButton";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { usersService } from "@services/users";
import { enqueueSnackbar } from "notistack";
import { clearUser, setUser } from "@redux/userSlice";
import { useNavigate } from "react-router";
import clsx from "clsx";
import "./index.scss";

const SubscriptionView = () => {
  // user
  const { userId, renewSubscription, isLoading } = useSelector(
    (state: RootState) => state.user,
  );
  // redux
  const dispatch = useDispatch();
  // subscriptions
  const [activeSub, setActiveSub] = useState<Subscription | undefined>();
  // subscription
  const [planId, setPlanId] = useState<SubscriptionType | undefined>();
  // behavior
  const [step, setStep] = useState<number>(0);
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(false);
  // disclaimer agreement
  const [checked, setChecked] = useState<boolean>(false);
  // open form status
  const [openSubHistory, setOpenSubHistory] = useState<boolean>(false);
  // others
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const nextStep = (currentStep: number) => {
    if (currentStep === step) {
      setStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    if (userId) {
      initActiveSub();
    } else {
      navigate("/");
    }
  }, [userId, isLoading]);

  const initActiveSub = async () => {
    const subscription = await subscriptionsService.getMyActiveSubscription();
    setActiveSub(subscription);

    setIsInit(true);
  };

  const tableRows = [
    {
      name: "1 Month",
      price: 9,
      plan_id: SubscriptionType.MonthlyMember,
    },
    {
      name: "3 Months",
      old_price: 27,
      price: 25,
      plan_id: SubscriptionType.ThreeMonthMember,
    },
    {
      name: "6 Months",
      old_price: 54,
      price: 48,
      plan_id: SubscriptionType.SixMonthMember,
    },
    {
      name: "1 Year",
      tag: "most valuable",
      old_price: 108,
      price: 92,
      plan_id: SubscriptionType.YearlyMember,
    },
  ];

  // handle functions

  const handleCreateSession = async () => {
    if (!planId || renewSubscription === null) return;
    try {
      setIsCreatingSession(true);

      const url = await stripesService.createCheckoutSession({
        subscription: planId,
      });
      window.location.href = url;

      setIsCreatingSession(false);

      dispatch(clearUser());
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
        setIsCreatingSession(false);
      }
    }
  };

  const handleSelectPlan = (planId: SubscriptionType) => {
    setPlanId(planId);
    nextStep(0);
  };

  const handleUpdateRenewSubscription = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      let newStatus = event.target.checked;

      await usersService.updateRenewSubscription(newStatus);

      dispatch(setUser({ renewSubscription: newStatus }));
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

  const renewSection = (
    <React.Fragment>
      <Typography>Renewing?</Typography>
      <Box className="row">
        <Typography>No</Typography>
        <Switch
          className="renewing-switch"
          checked={renewSubscription === true}
          onChange={handleUpdateRenewSubscription}
        />
        <Typography>Yes</Typography>
      </Box>
    </React.Fragment>
  );

  const subscriptionPlan = (
    <Box className="column center gap-large">
      <Typography>Choose a Plan</Typography>
      <Grid className="grid" container columns={{ xs: 6, md: 12 }} spacing={2}>
        {tableRows.map((row) => (
          <Grid key={row.name} size={6}>
            <Box
              className={clsx(
                "row start plan-card",
                planId === row.plan_id && "focus",
              )}
              onClick={() => handleSelectPlan(row.plan_id)}
            >
              <Box className="column start">
                <Typography>{row.name}</Typography>
                <Typography className="tag">{row.tag}</Typography>
              </Box>
              <Box className="column end price-box">
                {row.old_price ? (
                  <Typography className="old-price">
                    ${row.old_price}
                  </Typography>
                ) : undefined}
                <Typography>${row.price}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renewPlan = (
    <Box className="column center gap">
      {renewSection}
      <Box className="row cetner disclaimer-box">
        <Checkbox checked={checked} onChange={handleChange} />
        <Typography>
          By subscribing, you agree to our <u>Terms of Service</u> and{" "}
          <u>irrevocably waive any right to a refund</u> if your content is
          deleted or your account is terminated for violating our{" "}
          <u>User Content standards (Section 7)</u>.
        </Typography>
      </Box>
      <TTButton
        className="primary-button proceed"
        variant="outlined"
        color="inherit"
        onClick={handleCreateSession}
        loading={isCreatingSession}
        disabled={!checked}
      >
        Proceed
      </TTButton>
    </Box>
  );

  const steps = [subscriptionPlan, renewPlan];

  return (
    <Container className="subscription-view" maxWidth={false} disableGutters>
      <Box className="section main-section">
        <Box className="overlay">
          {isInit ? (
            <Box>
              {/* header */}
              <Box className="column center header-box">
                <Typography className="header">Subscription</Typography>
                <TTButton
                  className="primary-button"
                  variant="outlined"
                  color="inherit"
                  onClick={() => setOpenSubHistory(true)}
                >
                  View History
                </TTButton>
              </Box>

              {activeSub ? (
                <Box className="column center gap-large">
                  <SubscriptionCard subscription={activeSub} />

                  {renewSection}
                </Box>
              ) : (
                <Box className="column gap-large">
                  {/* steps */}
                  {steps.map((_step, i) =>
                    step >= i ? <Box key={i}>{_step}</Box> : undefined,
                  )}
                </Box>
              )}
            </Box>
          ) : undefined}
        </Box>
      </Box>

      {/* forms */}
      <SubscriptionHistoryForm
        open={openSubHistory}
        onClose={() => setOpenSubHistory(false)}
      />
    </Container>
  );
};

export default SubscriptionView;
