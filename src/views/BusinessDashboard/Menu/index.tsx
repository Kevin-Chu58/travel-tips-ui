import { useIsMobile } from "@hooks/useIsMobile";
import {
  Badge,
  Box,
  Menu as MuiMenu,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
  Drawer,
} from "@mui/material";
import { businessesService, type Business } from "@services/feed/businesses";
import React, { useCallback, useEffect, useState } from "react";
import type { NavTab } from "@constants/Types";
import { FiHome, FiBox, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { StyleUtils } from "@utils/StyleUtils";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import "./index.scss";

type MenuProps = {
  business: Business | undefined;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // businesses: Business[];
  // businessesLoadError: boolean;
};

const Menu = ({
  business,
  open,
  setOpen,
  // businesses,
  // businessesLoadError,
}: MenuProps) => {
  // window
  const isMobile = useIsMobile();
  // params
  const { businessId } = useParams();
  // businesses
  const [businesses, setBusinesses] = useState<Business[]>([]);
  // popover
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLDivElement | null>(
    null,
  );
  // others
  const navigate = useNavigate();

  useEffect(() => {
    if (business) {
      let _businesses = [...businesses];
      let index = _businesses.findIndex((bs) => bs.id === business.id);
      if (index > -1) {
        _businesses[index].status = business.status;
        setBusinesses([..._businesses]);
      }
    }
  }, [business?.status]);

  // init business on business id in params
  useEffect(() => {
    if (businessId && popoverAnchorEl) {
      initBusinesses();
    }
  }, [businessId, popoverAnchorEl]);

  const initBusinesses = async () => {
    if (businesses.length > 0) return;

    try {
      var result = await businessesService.getMyBusiness();
      setBusinesses(result);
    } catch (_) {
      // setBusinessesLoadError(true);
    }
  };

  // handle functions

  const handleOpenPopover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    setPopoverAnchorEl(e.currentTarget);
  };

  const handleClosePopover = (e: unknown) => {
    if (e && typeof e === "object" && "stopPropagation" in e) {
      (e as React.MouseEvent<HTMLElement>).stopPropagation();
    }

    setPopoverAnchorEl(null);
  };

  const handleBusinessClick = (businessId: number) => {
    navigate(`/business/${businessId}`);
    setPopoverAnchorEl(null);
    setOpen(false);
  };

  const handleNavTabClick = useCallback((to: string) => {
    navigate(to);
    setOpen(false);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  // components

  const headerListButton = (bs: Business) => {
    return (
      <ListItemButton
        key={bs.id}
        className={clsx(
          "header-list-button",
          bs.id === business?.id && "focus",
        )}
        onClick={() => handleBusinessClick(bs.id)}
        disableRipple
      >
        <ListItemIcon className="start-icon">
          <Badge
            color={StyleUtils.getColorThemeByAdStatus(bs.status)}
            variant="dot"
          >
            <Box className="row center indicator">{bs.name[0]}</Box>
          </Badge>
        </ListItemIcon>
        <ListItemText>
          <Box className="column start">
            <Typography variant="body2" className="business-name">
              {bs.name}
            </Typography>
          </Box>
        </ListItemText>
      </ListItemButton>
    );
  };

  const menuNavTabs = [
    {
      name: "home",
      label: "Home",
      to: `/business/${business?.id}`,
      element: <FiHome />,
    },
    {
      name: "ads",
      label: "Ads",
      to: `/business/${business?.id}/ads`,
      element: <FiBox />,
    },
  ] as NavTab[];

  const getActiveTab = (tabs: NavTab[], currentPath: string) => {
    return [...tabs]
      .sort((a, b) => b.to!.length - a.to!.length) // Longest path first
      .find((tab) => currentPath.startsWith(tab.to!));
  };
  const activeTab = getActiveTab(menuNavTabs, location.pathname);

  const menuContent = (
    <React.Fragment>
      {/* menu header */}
      <Box className="row full gap header">
        {business ? (
          <ListItemButton
            className="header-list-button"
            onClick={(e) => handleOpenPopover(e)}
            disableRipple
          >
            <ListItemIcon className="start-icon">
              <Badge
                color={StyleUtils.getColorThemeByAdStatus(business.status)}
                variant="dot"
              >
                <Box className="row center indicator">
                  {business.name?.charAt(0) ?? ""}
                </Box>
              </Badge>
            </ListItemIcon>
            <ListItemText>
              <Box className="column start">
                <Typography variant="subtitle2">Business</Typography>
                <Typography variant="body2" className="business-name">
                  {business.name}
                </Typography>
              </Box>
            </ListItemText>
            <ListItemIcon className="end-icon">
              {Boolean(popoverAnchorEl) ? <FiChevronUp /> : <FiChevronDown />}
            </ListItemIcon>
          </ListItemButton>
        ) : (
          <Box className="column center flex">
            <CircularProgress color="success" aria-label="Loading…" />
          </Box>
        )}
      </Box>

      {/* nav tabs */}
      <Box className="column menu">
        {menuNavTabs.map((tab) => (
          <ListItemButton
            key={tab.name}
            className={clsx(tab.name === activeTab?.name && "focus")}
            onClick={() => handleNavTabClick(tab.to!)}
            disableRipple
          >
            <ListItemIcon>{tab.element}</ListItemIcon>
            <ListItemText>{tab.label}</ListItemText>
          </ListItemButton>
        ))}
      </Box>

      <MuiMenu
        className="business-dashboard-menu-popover"
        open={Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        onClose={handleClosePopover}
      >
        <Typography variant="caption">Switch Business</Typography>
        {businesses.map((bs) => headerListButton(bs))}
      </MuiMenu>
    </React.Fragment>
  );

  if (isMobile)
    return (
      <Drawer open={open} onClose={handleCloseDrawer}>
        <Box className="column business-dashboard-menu">{menuContent}</Box>
      </Drawer>
    );

  return <Box className="column business-dashboard-menu">{menuContent}</Box>;
};

export default Menu;
