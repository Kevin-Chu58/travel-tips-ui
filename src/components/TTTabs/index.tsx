import type { NavTab } from "@constants/Types";
import { Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router";

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
    if (navigateTo)
      navigate(navigateTo);
  };

  return (
    <Tabs value={navTabValue} onChange={(_, val) => handleChange(val)}>
      {navTabs.map((navTab, i) => ((navTab.condition ?? true) &&
        <Tab
          key={navTab.name}
          label={navTab.label}
          value={i}
          disableRipple
          sx={{
            "&.MuiTab-root": {
              borderRadius: 40,
              minHeight: 0,
              py: 1,
              mt: 1,
              mx: 0.5,
              mb: -1,
              ":hover": {
                bgcolor: "divider",
              },
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                ":hover": {},
              },
            },
          }}
        />
      ))}
    </Tabs>
  );
};

export default TTTabs;
