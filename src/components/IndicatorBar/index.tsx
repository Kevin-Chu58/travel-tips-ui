import type { IndicatorItem } from "@constants/Types";
import { Box, Divider, Typography } from "@mui/material";
import React from "react";

type IndicatorBarProps = {
  indicatorItems: IndicatorItem[];
};

const IndicatorBar = ({ indicatorItems }: IndicatorBarProps) => {
  return (
    <Box
      display="flex"
      color="dimgrey"
      mt={1}
      py={0.5}
      sx={{
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: "divider",
        textTransform: "uppercase",
      }}
    >
      {indicatorItems.map((indicator, i) => (
        <React.Fragment key={indicator.label}>
          <Box display="flex" justifyContent="center" sx={indicator.sx}>
            <Typography fontSize={12}>{indicator.label}</Typography>
          </Box>
          {i + 1 < indicatorItems.length && (
            <Divider orientation="vertical" flexItem />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default IndicatorBar;
