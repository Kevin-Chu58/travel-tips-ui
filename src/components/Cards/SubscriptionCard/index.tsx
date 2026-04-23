import { Box, Chip, Typography } from "@mui/material";
import type { Subscription } from "@services/plan/subscriptions";
import TimeUtils from "@utils/TimeUtils";
import clsx from "clsx";
import "./index.scss";

type SubscriptionCardProps = {
  subscription: Subscription;
};

const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  return (
    <Box className="column gap subscription-card">
      <Box className="row start">
        <Typography className="title">{subscription.plan}</Typography>
        <Typography className={clsx("status", subscription.status)}>
          {subscription.status}
        </Typography>
      </Box>
      <Box className="row start">
        <Box className="column start">
          <Typography>
            <strong>Start</strong>{" "}
            {TimeUtils.toFullDateTimeNumericDisplay(subscription.start)}
          </Typography>
          <Typography>
            <strong>End</strong>{" "}
            {TimeUtils.toFullDateTimeNumericDisplay(subscription.end)}
          </Typography>
        </Box>
        <Chip label="UTC" color="utility" size="small" />
      </Box>
    </Box>
  );
};

export default SubscriptionCard;
