import type { NavTab } from "@constants/Types";
import { Box, List, ListItem, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import ToolTip from "@components/ToolTip";
import React from "react";
import clsx from "clsx";
import "./index.scss";

type TTDrawerProps = {
  navTabs: NavTab[];
  navTabValue: number;
  setNavTabValue: (state: number) => void;
  subNavTabValue?: number;
  setSubNavTabValue?: (state: number | undefined) => void;
  subHeader?: string;
  isMobile?: boolean;
};

const TTDrawer = ({
  navTabs,
  navTabValue,
  setNavTabValue,
  subNavTabValue,
  setSubNavTabValue,
  subHeader,
  isMobile = false,
}: TTDrawerProps) => {
  const navigate = useNavigate();

  const navTo = (
    to: string | undefined,
    navTabIndex: number,
    subNavTabIndex: number | undefined
  ) => {
    if (to) {
      navigate(to);
      setNavTabValue(navTabIndex);
      if (setSubNavTabValue) setSubNavTabValue(subNavTabIndex);
    }
  };

  return (
    <List>
      <Box className="TTDrawer-box">
        <Typography className="TTDrawer-header">Workshop</Typography>
        {Boolean(subHeader) && (
          <Typography className="TTDrawer-sub-header">{subHeader}</Typography>
        )}
      </Box>

      {/* nav tabs */}
      <Box className="TTDrawer-nav-tab-box" />
      {navTabs.map((navTab, i) => (
        <React.Fragment key={navTab.name}>
          <ListItem
            className={clsx(
              "TTDrawer-nav-tab",
              i === navTabValue && subNavTabValue === undefined && "active",
              isMobile && "mobile"
            )}
            onClick={() => navTo(navTab.to, i, undefined)}
          >
            <Typography className="TTDrawer-nav-tab-label">
              {navTab.label}
            </Typography>
          </ListItem>
          {navTab.subs?.map((subNavTab, j) => {
            const subNavTabItem = (
              <ListItem
                className={clsx(
                  "TTDrawer-nav-tab sub",
                  i === navTabValue && j === subNavTabValue && "active",
                  isMobile && "mobile"
                )}
                onClick={() => navTo(subNavTab.to, i, j)}
              >
                <Typography
                  className="TTDrawer-nav-tab-label sub"
                  variant="body2"
                >
                  {subNavTab.label}
                </Typography>
                {subNavTab.icon}
              </ListItem>
            );

            return (
              <React.Fragment key={subNavTab.name}>
                {subNavTab.note ? (
                  <ToolTip title={subNavTab.note} placement="right">
                    {subNavTabItem}
                  </ToolTip>
                ) : (
                  subNavTabItem
                )}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
    </List>
  );
};

export default TTDrawer;
