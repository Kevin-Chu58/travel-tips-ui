import { Box, Typography } from "@mui/material";
import type { AdSubLog } from "@services/feed/ads";
import TimeUtils from "@utils/TimeUtils";
import { FiArrowRight } from "react-icons/fi";
import { useIsMobile } from "@hooks/useIsMobile";
import clsx from "clsx";
import "./index.scss";

type AdLogProps = {
  adLog: AdSubLog;
};

const AdLog = ({ adLog }: AdLogProps) => {
  // window
  const isMobile = useIsMobile();

  return (
    <Box className={clsx(isMobile ? "column" : "row start", "ad-log-box")}>
      <Typography>
        <b>{TimeUtils.toFullDateTimeNumericDisplay(adLog.time)}</b>
      </Typography>
      <Box className="column">
        <Typography className="auto-wrap">{adLog.note}</Typography>
        {adLog.oldValue && adLog.newValue ? (
          <Box className="row">
            {adLog.oldValue} <FiArrowRight /> {adLog.newValue}
          </Box>
        ) : undefined}
      </Box>
    </Box>
  );
};

export default AdLog;
