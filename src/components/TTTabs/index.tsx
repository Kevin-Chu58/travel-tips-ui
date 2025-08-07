import type { NavTab } from "@constants/Types";
import { Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router";
import "./index.scss";

type TTTabsProps = {
  navTabValue: any;
  navTabs: NavTab[];
  setNavTabValue: (newValue: any) => void;
};

const TTTabs = ({ navTabValue, navTabs, setNavTabValue }: TTTabsProps) => {
  const navigate = useNavigate();

  const handleChange = (newValue: number) => {
    setNavTabValue(newValue);
    let navigateTo = navTabs[newValue].to;
    if (navigateTo) navigate(navigateTo);
  };

  return (
    <Tabs
      className="TTTabs-tabs"
      value={navTabValue}
      onChange={(_, val) => handleChange(val)}
      variant="scrollable"
    >
      {navTabs.map(
        (navTab, i) =>
          (navTab.condition ?? true) && (
            <Tab
              className="TTTabs-tab"
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
