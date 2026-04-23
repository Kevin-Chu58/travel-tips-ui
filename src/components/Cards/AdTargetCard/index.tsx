import TTButton from "@components/TTButton";
import UserAvatar from "@components/UserAvatar";
import { Box, Chip, ListItemButton, Menu, Typography } from "@mui/material";
import {
  adTargetsService,
  type AdTarget,
  type AdTargetAnalytics,
} from "@services/feed/adTargets";
import { regionsService } from "@services/search/regions";
import { type UserSimple, usersService } from "@services/users";
import { RegionUtils } from "@utils/RegionUtils";
import { StringUtils } from "@utils/StringUtils";
import React, { useEffect, useState } from "react";
import type { NavTab } from "@constants/Types";
import { enqueueSnackbar } from "notistack";
import { stripesService } from "@services/stripe/stripe";
import { useIsMobile } from "@hooks/useIsMobile";
import clsx from "clsx";
import "./index.scss";

type AdTargetCardProps = {
  adId: number | undefined;
  adTarget: AdTarget;
  setAdTargetFocus: (state: AdTarget) => void; // to edit in Ad Target form
  adTargets: AdTarget[];
  setAdTargets: (state: AdTarget[]) => void;
};

const AdTargetCard = ({
  adId,
  adTarget,
  setAdTargetFocus,
  adTargets,
  setAdTargets,
}: AdTargetCardProps) => {
  // window
  const isMobile = useIsMobile();
  // display
  const [value, setValue] = useState<string>("");
  // analytics
  const [analytics, setAnalytics] = useState<AdTargetAnalytics | undefined>();
  // value data
  const [user, setUser] = useState<UserSimple | undefined>();
  // popover
  const [popoverAnchorEl, setPopoverAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  // initialie display value on ad target
  useEffect(() => {
    getTargetValue(adTarget.targetValue);
  }, [adTarget]);

  const getTargetValue = async (value: string) => {
    if (adTarget.targetType === "region") {
      const region = await regionsService.getRegionCompleteById(
        parseInt(value),
      );
      setValue(RegionUtils.getRegionAddress(region));
    } else if (adTarget.targetType === "budget") {
      setValue(StringUtils.getBudgetStr(parseInt(value)));
    } else if (adTarget.targetType === "createdBy") {
      const user = await usersService.getUserById(parseInt(value), false);
      setValue(`${user.username} #${user.id}`);
      setUser(user);
    } else {
      setValue(adTarget.targetValue);
    }
  };

  // handle functions

  const handleViewAnalyticsClick = async () => {
    if (!adId) return;

    try {
      let analytics = await adTargetsService.getAdTargetAnalytics(
        adId,
        adTarget.id,
      );
      setAnalytics(analytics);
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const handleCancelClick = async () => {
    if (!adId) return;
    try {
      await stripesService.cancelAdTarget(adId, adTarget.id);
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  // components

  const getValueComponent = () => {
    switch (adTarget.targetType) {
      case "region":
        return <Chip label={value} color="region" size="small" />;
      case "budget":
        return <Chip label={value} color="success" size="small" />;
      case "createdBy":
        return <Chip avatar={<UserAvatar user={user} />} label={value} />;
      default:
        return value;
    }
  };

  const options = [
    {
      name: "edit",
      label: "Edit",
      onClick: () => {
        setAdTargetFocus(adTarget);
        setPopoverAnchorEl(null);
      },
    },
    {
      name: "primary",
      label: "Set as Primary",
      condition: !adTarget.isPrimary,
      onClick: async () => {
        try {
          if (adId) {
            await adTargetsService.setAtTargetAsPrimary(adId, adTarget.id);
            let _adTargets = [...adTargets];
            let _prevPrimaryIndex = _adTargets.findIndex(
              (at) => at.isPrimary === true,
            );
            let _primaryIndex = _adTargets.findIndex(
              (at) => at.id === adTarget.id,
            );
            _adTargets[_prevPrimaryIndex].isPrimary = false;
            _adTargets[_primaryIndex].isPrimary = true;
            setAdTargets([..._adTargets]);
          }
        } catch (e) {
          if (e instanceof Error)
            enqueueSnackbar(e.message, { variant: "error" });
        }
        setPopoverAnchorEl(null);
      },
    },
    {
      name: "cancel",
      label: "Cancel Renew",
      onClick: async () => {
        if (adId) await handleCancelClick();
        setPopoverAnchorEl(null);
      },
    },
  ] as NavTab[];

  return (
    <Box
      key={adTarget.id}
      className={clsx("column full ad-target-card", !isMobile && "gap")}
    >
      <Box className={clsx(isMobile ? "column" : "row gap-large")}>
        <Box className="row gap-large">
          <Typography>
            <b>Type</b>
          </Typography>
          <Typography>{adTarget.targetType}</Typography>
        </Box>
        <Box className="row gap-large">
          <Typography>
            <b>Value</b>
          </Typography>
          {getValueComponent()}
        </Box>
      </Box>
      <Box className={clsx(isMobile ? "column" : "row gap-large")}>
        <Box className="row gap-large">
          <Typography>
            <b>Weight</b>
          </Typography>
          <Typography>{adTarget.weight}</Typography>
        </Box>
        <Box className="row gap-large">
          {analytics ? (
            <React.Fragment>
              <Typography>
                <b>Rank</b>
              </Typography>
              <Typography>{`${analytics.rank} (${analytics.percent}%)`}</Typography>
            </React.Fragment>
          ) : (
            <TTButton
              variant="contained"
              onClick={handleViewAnalyticsClick}
              disableRipple
            >
              View Rank
            </TTButton>
          )}
        </Box>
      </Box>
      <Box className="row gap-large">
        {adTarget.isPrimary ? (
          <Typography color="success">
            <b>Primary</b>
          </Typography>
        ) : undefined}
        <TTButton
          className="action-button"
          onClick={(e) => setPopoverAnchorEl(e.currentTarget)}
          variant="outlined"
          color="utility"
          disableRipple
        >
          options
        </TTButton>

        <Menu
          open={Boolean(popoverAnchorEl)}
          anchorEl={popoverAnchorEl}
          onClose={() => setPopoverAnchorEl(null)}
        >
          {options.map((option) =>
            option.condition !== false ? (
              <ListItemButton key={option.name} onClick={option.onClick}>
                {option.label}
              </ListItemButton>
            ) : undefined,
          )}
        </Menu>
      </Box>
    </Box>
  );
};

export default AdTargetCard;
