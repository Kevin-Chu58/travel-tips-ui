import type { NavTab } from "@constants/Types";
import { Box, List, ListItem, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import "./index.scss";
import clsx from "clsx";

type TTDrawerProps = {
  navTabs: NavTab[];
  navTabValue: number;
  setNavTabValue: (state: number) => void;
  subHeader?: string;
  isMobile?: boolean;
};

const TTDrawer = ({
  navTabs,
  navTabValue,
  setNavTabValue,
  subHeader,
  isMobile = false,
}: TTDrawerProps) => {
  const navigate = useNavigate();

  const navTo = (to: string | undefined, i: number) => {
    if (to) {
      navigate(to);
      setNavTabValue(i);
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
        <ListItem
          key={navTab.name}
          className={clsx(
            "TTDrawer-nav-tab",
            i === navTabValue && "active",
            isMobile && "mobile"
          )}
          onClick={() => navTo(navTab.to, i)}
        >
          <Typography className="TTDrawer-nav-tab-label">
            {navTab.label}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};

export default TTDrawer;
