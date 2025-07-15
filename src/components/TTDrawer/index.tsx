import type { NavTab } from "@constants/Types";
import { Box, List, ListItem, Typography } from "@mui/material";
import { useNavigate } from "react-router";

type TTDrawerProps = {
  navTabs: NavTab[];
  navTabValue: number;
  setNavTabValue: (state: number) => void;
  isMobile?: boolean;
};

const TTDrawer = ({
  navTabs,
  navTabValue,
  setNavTabValue,
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
      <Box m={2} display="flex" justifyContent="center">
        <Typography variant="h4" fontWeight="bold">
          Workshop
        </Typography>
      </Box>
      <Box mt={4} ml={4} />
      {navTabs.map((navTab, i) => (
        <ListItem
          key={navTab.name}
          onClick={() => navTo(navTab.to, i)}
          sx={{
            ml: "10%",
            width: "90%",
            display: "flex",
            position: "relative",
            flexDirection: "row",
            cursor: "pointer",
            borderRadius: "2rem 0 0 2rem",
            ...(i === navTabValue
              ? {
                  zIndex: 5,
                  bgcolor: "white",
                  ...(!isMobile && {
                    "&::before, &::after": {
                      "--size": "16px",
                      position: "absolute",
                      content: '""',
                      width: "var(--size)",
                      height: "var(--size)",
                      right: 0,
                    },
                    "&::before": {
                      top: "calc(var(--size) * -1)",
                      borderRadius: "0 0 100vw 0",
                      boxShadow: "4px 4px white",
                    },
                    "&::after": {
                      bottom: "calc(var(--size) * -1)",
                      borderRadius: "0 100vw 0 0",
                      boxShadow: "4px -4px white",
                    },
                  }),
                }
              : {
                  zIndex: 0,
                  bgcolor: "secondary.main",
                  ":hover": {
                    bgcolor: "secondary.600",
                  },
                }),
          }}
        >
          <Typography variant="h6" ml="1rem">
            {navTab.label}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};

export default TTDrawer;
