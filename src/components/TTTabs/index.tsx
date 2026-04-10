import type { NavTab } from "@constants/Types";
import { Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router";
import clsx from "clsx";
import "./index.scss";

type TTTabsProps = {
  navTabValue: any;
  navTabs: NavTab[];
  setNavTabValue: (newValue: any) => void;
  variant?: "switch";
};

const TTTabs = ({ navTabValue, navTabs, setNavTabValue, variant }: TTTabsProps) => {
  const navigate = useNavigate();

  const handleChange = (newValue: number) => {
    setNavTabValue(newValue);
    let navigateTo = navTabs[newValue].to;
    if (navigateTo) navigate(navigateTo);
  };

  const adjustedNavTabValue = navTabValue < navTabs.length ? navTabValue : 0;

  return (
    <Tabs
      className={clsx("TTTabs-tabs", variant)}
      value={adjustedNavTabValue}
      onChange={(_, val) => handleChange(val)}
      variant="scrollable"
    >
      {navTabs.map(
        (navTab, i) =>
          (navTab.condition ?? true) && (
            <Tab
              className={clsx("TTTabs-tab", variant)}
              key={navTab.name}
              label={navTab.label}
              value={i}
              disableRipple
            />
          )
      )}
    </Tabs>
  );
};

export default TTTabs;
