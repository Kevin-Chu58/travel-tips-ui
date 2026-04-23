import FormBase from "@components/Forms/FormBases/FormBase";
import {
  Box,
  Chip,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { AdTargetTypes, type AdTarget } from "@services/feed/adTargets";
import { useEffect, useState } from "react";
import { type RegionComplete, regionsService } from "@services/search/regions";
import UserSearchAutoComplete from "@components/Search/UserSearchAutoComplete";
import { FaCcStripe } from "react-icons/fa6";
import {
  targetRulesService,
  type TargetRule,
} from "@services/feed/targetRules";
import { usersService, type UserSimple } from "@services/users";
import RegionForm from "../RegionForm";
import BudgetForm from "../BudgetForm";
import { RegionUtils } from "@utils/RegionUtils";
import { StringUtils } from "@utils/StringUtils";
import UserAvatar from "@components/UserAvatar";
import { useIsMobile } from "@hooks/useIsMobile";
import CheckboxContainer from "@components/CheckBoxContainer";
import { Link, useNavigate } from "react-router";
import {
  type StripePreviewInvoiceReponse,
  stripesService,
} from "@services/stripe/stripe";
import type { Ad } from "@services/feed/ads";
import { enqueueSnackbar } from "notistack";
import React from "react";
import clsx from "clsx";
import "./index.scss";

type AdTargetFormProps = {
  open: boolean;
  onClose: () => void;
  ad: Ad | undefined;
  adTargetFocus: AdTarget | undefined;
  setAdTargetFocus: (state: AdTarget | undefined) => void;
};

const AdTargetForm = ({
  open,
  onClose,
  ad,
  adTargetFocus,
  setAdTargetFocus,
}: AdTargetFormProps) => {
  // window
  const isMobile = useIsMobile();
  // pages
  const [page, setPage] = useState<number>(1);
  // inputs
  const [targetType, setTargetType] = useState<string>("");
  const [targetValue, setTargetValue] = useState<string>("");
  // region params
  const [regionComplete, setRegionComplete] = useState<RegionComplete>({});
  // budget params
  const [budget, setBudget] = useState<number | undefined>();
  // createdBy params
  const [createdBy, setCreatedBy] = useState<UserSimple | undefined>();
  // keyword params
  const [keyword, setKeyword] = useState<string>("");
  // target rule
  const [targetRule, setTargetRule] = useState<TargetRule | undefined>();
  // weight
  const [weight, setWeight] = useState<number>(0);
  // preview invoice
  const [invoice, setInvoice] = useState<
    StripePreviewInvoiceReponse | undefined
  >();
  // check
  const [isChecked, setIsChecked] = useState<boolean>(false);
  // behavior
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);
  // others
  const navigate = useNavigate();

  // initialize when has ad target selected
  useEffect(() => {
    if (!adTargetFocus) {
      reset();
      return;
    }

    setTargetType(adTargetFocus.targetType);
    setTargetValue(adTargetFocus.targetValue);
    setWeight(adTargetFocus.weight);

    if (adTargetFocus.targetType === "region") {
      initRegion(adTargetFocus.targetValue);
    } else if (adTargetFocus.targetType === "budget") {
      initBudget(adTargetFocus.targetValue);
    } else if (adTargetFocus.targetType === "createdBy") {
      initCreatedBy(adTargetFocus.targetValue);
    } else if (adTargetFocus.targetType === "keyword") {
      setKeyword(adTargetFocus.targetValue);
    }
  }, [adTargetFocus]);

  // update target value on region complete
  useEffect(() => {
    onRegionUpdate();
  }, [regionComplete.country?.id, regionComplete.state?.id]);

  // init functions

  const initRegion = async (regionIdStr: string) => {
    let regionId = parseInt(regionIdStr);

    const result = await regionsService.getRegionCompleteById(regionId);
    setRegionComplete(result);
  };

  const initBudget = async (budgetStr: string) => {
    let budget = parseInt(budgetStr);
    setBudget(budget);
  };

  const initCreatedBy = async (userIdStr: string) => {
    let userId = parseInt(userIdStr);

    const user = await usersService.getUserById(userId);
    setCreatedBy(user);
  };

  // handle functions

  const handleBack = () => {
    if (page > 1) setPage((prev) => prev - 1);

    setIsCreatingSession(false);
  };

  const handleNext = async () => {
    try {
      if (page === 1 && targetType !== "" && targetValue !== "") {
        const result = await targetRulesService.getTargetRule(
          AdTargetTypes.indexOf(targetType),
          targetValue,
        );
        setTargetRule(result);

        setPage(2);
      } else if (page === 2) {
        if (ad?.stripeSubscriptionId && adTargetFocus?.weight !== weight) {
          const invoice = await stripesService.PreviewUpcomingInvoiceOnAdWeight(
            ad.id,
            {
              targetType: targetType,
              targetValue: targetValue,
              weight: weight,
            },
            adTargetFocus?.id,
          );

          setInvoice(invoice);
        } else {
          setInvoice(undefined);
        }

        setPage(3);
      }
      if (page === 3 && !isCreatingSession && ad) {
        setIsCreatingSession(true);

        const stripeAdWeightRequest = {
          targetType: targetType,
          targetValue: targetValue,
          weight: weight,
        };

        if (!adTargetFocus && !invoice) {
          const url = await stripesService.createAdWeightCheckoutSession(
            ad.id,
            stripeAdWeightRequest,
          );

          navigate(url);
        } else {
          await stripesService.updateSubscriptionOnAdWeights(
            ad.id,
            stripeAdWeightRequest,
            adTargetFocus?.id,
          );

          handleClose();
        }

        setIsCreatingSession(false);
      }
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
        setIsCreatingSession(false);
      }
    }
  };

  const handleChecked = () => {
    setIsChecked((prev) => !prev);
  };

  const handleTargetTypeChange = async (event: SelectChangeEvent) => {
    setTargetType(event.target.value);
    setTargetValue("");
    setRegionComplete({});
    setBudget(undefined);
    setCreatedBy(undefined);
    setKeyword("");
    setIsChecked(false);
    setIsCreatingSession(false);
  };

  const onRegionUpdate = () => {
    let regionId = regionComplete.state?.id ?? regionComplete.country?.id;
    setTargetValue(regionId?.toString() ?? "");
  };

  const onBudgetUpdate = (budget: number | undefined) => {
    setBudget(budget);
    setTargetValue(budget?.toString() ?? "");
  };

  const onUserUpdate = (user: UserSimple | undefined) => {
    setCreatedBy(user);
    setTargetValue(user?.id?.toString() ?? "");
  };

  const onKeywordUpdate = (keyword: string) => {
    setKeyword(keyword);
    setTargetValue(keyword);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const reset = () => {
    setPage(1);
    setTargetType("");
    setTargetValue("");
    setRegionComplete({});
    setBudget(undefined);
    setCreatedBy(undefined);
    setKeyword("");
    setWeight(0);
    setIsChecked(false);
    setAdTargetFocus(undefined);
  };

  // validations

  const isNextValid = () => {
    switch (page) {
      case 1:
        return targetType !== "" && targetValue !== "";
      case 2:
        return weight >= (targetRule?.minWeight ?? 10);
      case 3:
        return isChecked;
    }
  };

  // components

  const getTargetValueInput = () => {
    switch (targetType) {
      case "region":
        return (
          <RegionForm
            open
            countrySlug={regionComplete?.country?.slug}
            stateSlug={regionComplete?.state?.slug}
            setCompleteRegion={setRegionComplete}
            content
          />
        );
      case "budget":
        return (
          <BudgetForm open budget={budget} onUpdate={onBudgetUpdate} content />
        );
      case "createdBy":
        return (
          <UserSearchAutoComplete
            open
            user={createdBy}
            setUser={onUserUpdate}
          />
        );
      case "keyword":
        return (
          <React.Fragment>
            <TextField
              label="Keyword"
              value={keyword}
              onChange={(e) => onKeywordUpdate(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: `${keyword.length}/50`,
                },
              }}
            />
            <Typography variant="caption">
              <em>
                *Keyword uses <b>StartWith</b> matching. <br /> e.g. if your
                keyword is "coffee shop", then when users search "coffee" your
                ad target will join the lottery. <br />
                <br />
                *User input (keywords) must be <b>at least 3 characters</b> to include
                ad targets with keyword types.
              </em>
            </Typography>
          </React.Fragment>
        );
      default:
        return (
          <Typography variant="caption">Choose a target type first</Typography>
        );
    }
  };

  const getTargetValueStr = () => {
    switch (targetType) {
      case "region":
        return RegionUtils.getRegionAddress(regionComplete);
      case "budget":
        return StringUtils.getBudgetStr(budget);
      case "createdBy":
        return (
          <Chip
            avatar={<UserAvatar user={createdBy} />}
            label={
              <Typography className={clsx("too-long", isMobile && "mobile")}>
                {createdBy?.username}
              </Typography>
            }
          />
        );
      case "keyword":
        return keyword;
    }
  };

  const page1 = (
    <Box className="column gap page">
      <Box className="row section center">
        <Typography variant="h5">
          <b>New Target</b>
        </Typography>
      </Box>

      {/* target type */}
      <FormControl fullWidth>
        <Typography variant="caption">
          <b>Target Type</b>
        </Typography>
        <Select
          color="info"
          value={targetType}
          onChange={handleTargetTypeChange}
        >
          <MenuItem className="selected-ad-target-type" value="">
            <em>None</em>
          </MenuItem>
          {AdTargetTypes.map((type: string) => (
            <MenuItem
              className="selected-ad-target-type"
              color="info"
              value={type}
            >
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* target value */}
      <Typography variant="caption">
        <b>Target Value</b>
      </Typography>
      {getTargetValueInput()}
    </Box>
  );

  const page2 = (
    <Box className="column gap-large page">
      <Box className="row section center">
        <Typography variant="h5">
          <b>Target Rule</b>
        </Typography>
      </Box>
      <Box className="notification-box">
        <Grid container columns={{ xs: 6, md: 12 }} spacing={1}>
          <Grid size={6}>
            <Typography>
              <b>Target Type</b>
            </Typography>
          </Grid>
          <Grid size={6}>
            {targetRule ? (
              <Typography>{targetRule.targetType}</Typography>
            ) : (
              <Skeleton />
            )}
          </Grid>
          <Grid size={6}>
            <Typography>
              <b>Target Value</b>
            </Typography>
          </Grid>
          <Grid size={6}>
            {targetRule ? (
              <Typography>{targetRule?.targetValue ?? "default"}</Typography>
            ) : (
              <Skeleton />
            )}
          </Grid>
          <Grid size={6}>
            <Typography>
              <b>Min. Weight</b>
            </Typography>
          </Grid>
          <Grid size={6}>
            {targetRule ? (
              <Typography>{targetRule?.minWeight}</Typography>
            ) : (
              <Skeleton />
            )}
          </Grid>
          <Grid size={6}>
            <Typography>
              <b>Weight Unit Price</b>
            </Typography>
          </Grid>
          <Grid size={6}>
            {targetRule ? (
              <Typography>
                $10 (U.S.) / Weight
                <br />
                <em>*May vary in countries</em>
              </Typography>
            ) : (
              <Skeleton />
            )}
          </Grid>
        </Grid>
      </Box>
      <TextField
        label="Number of Weights"
        type="number"
        color="info"
        value={weight ?? 0}
        onChange={(e) => setWeight(parseInt(e.target.value))}
      />
      <Typography variant="caption">
        *More weight you purchase, more chance your ad with be displayed.
      </Typography>
    </Box>
  );

  const page3 = (
    <Box className="column gap-large page">
      <Box className="row section center">
        <Typography variant="h5">
          <b>Target Preview</b>
        </Typography>
      </Box>
      <Box className="notification-box">
        <Grid container columns={{ xs: 6, md: 12 }} spacing={1}>
          <Grid size={6}>
            <Typography>
              <b>Target Type</b>
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography>{targetType}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography>
              <b>Target Value</b>
            </Typography>
          </Grid>
          <Grid size={6}>
            <Box>{getTargetValueStr()}</Box>
          </Grid>
          <Grid size={6}>
            <Typography>
              <b>Weight Units</b>
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography>{weight ?? 0}</Typography>
          </Grid>
        </Grid>
      </Box>

      {invoice ? (
        <Box className="column end price-box">
          <Box className="row">
            <Typography className="info">
              <b>Pay now:</b>
            </Typography>
            <Typography className="price-text">
              {StringUtils.formatCurrency(
                invoice.amountToPayNow,
                invoice.currency,
              )}
            </Typography>
          </Box>
          <Box className="row">
            <Typography>
              <b>Next Billing Cycle:</b>
            </Typography>
            <Typography className="price-text">
              {StringUtils.formatCurrency(
                invoice.nextCycleTotal,
                invoice.currency,
              )}
            </Typography>
          </Box>
        </Box>
      ) : undefined}
      <Divider />

      <Box className="column full">
        <CheckboxContainer checked={isChecked} onClick={handleChecked}>
          <Typography>
            By subscribing, you agree to our Terms of Service and irrevocably
            waive any right to a refund if your content is deleted or your
            account is terminated for violating our User Content standards{" "}
            <Link to="/doc/terms-of-service" target="_blank" rel="noopener">
              Section 7
            </Link>
            .
          </Typography>
        </CheckboxContainer>
      </Box>
    </Box>
  );

  const pages = [page1, page2, page3];

  return (
    <FormBase
      className="ad-target-form"
      open={open}
      onClose={page > 1 ? handleBack : handleClose}
      minWidth={300}
      width="40vw"
      closeButtonLabel={page > 1 ? "back" : "cancel"}
      actionButtonLabel={
        page === 3
          ? !ad?.stripeSubscriptionId
            ? "Checkout"
            : "Pay Now"
          : "next"
      }
      actionButtonStartIcon={page === 3 ? <FaCcStripe /> : undefined}
      actionButtonOnClick={handleNext}
      disableActionButton={!isNextValid()}
      isLoading={isCreatingSession}
    >
      <Box className={clsx("row start no-gap page-container", `page-${page}`)}>
        {pages.map((page, i) => (
          <React.Fragment key={i}>{page}</React.Fragment>
        ))}
      </Box>
    </FormBase>
  );
};

export default AdTargetForm;
