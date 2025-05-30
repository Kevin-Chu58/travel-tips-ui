import { getHex } from "@constants/Colors";
import { Grid, Typography } from "@mui/material";
import StyleUtils from "@utils/StyleUtils";
import type { ReactNode } from "react";

type TTCardProps = {
  color?: string;
  bgcolor: string;
  darkBg?: boolean;
  title: string;
  icon?: ReactNode;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  // creator?: UserInfo;  TODO - add creator later
  children?: ReactNode;
};

const TTCard = ({
  color = "white",
  bgcolor,
  darkBg = false,
  title,
  icon,
  direction = "column",
  children,
}: TTCardProps) => {
  return (
    <Grid
      container
      direction={direction}
      size={12}
      mt={2}
      p={1}
      borderRadius={2}
      sx={{
        background: darkBg
          ? StyleUtils.generateLinearGradientLighter(getHex(bgcolor)!)
          : StyleUtils.generateLinearGradientDarker(getHex(bgcolor)!),
        '& .MuiTypography-root': {
          color: color,
        },
      }}
    >
      {/* header */}
      <Grid container size={12} direction="row" alignItems="center">
        {icon}
        <Grid>
          <Typography variant="body1" fontWeight="bold">
            {title}
          </Typography>
        </Grid>
      </Grid>

      {children}
    </Grid>
  );
};

export default TTCard;
