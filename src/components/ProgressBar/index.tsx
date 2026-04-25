import { Box, Typography } from "@mui/material";
import { Link } from "react-router";
import clsx from "clsx";
import "./index.scss";

type ProgressBarProps = {
  current: number;
  max: number;
  object: string;
};

const ProgressBar = ({ current, max, object }: ProgressBarProps) => {
  return (
    <Box className="progress-bar">
      <Box className="row count-box">
        <Box
          className={clsx("current-value", current >= max && "max")}
          flex={max === 0 ? 1 : current} // if max is 0, set current to 1 to display max bar
        />
        <Box className="max-value" flex={max - current} />
      </Box>
      <Box className="count-notice">
        <Typography>
          {current} / {max} {object}
        </Typography>
        <Typography>
          <Link to={"/membership"}>Subscribe</Link> for more
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;
