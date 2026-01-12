import { Alert, Box, Checkbox, Typography } from "@mui/material";
import UserAgreementBase from "../UserAgreementBase";
import React, { useState } from "react";

type FoundationProfileProps = {
  readonly?: boolean;
  next?: () => void;
};

const FoundationProfile = ({
  readonly = false,
  next,
}: FoundationProfileProps) => {
  // checkbox
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <UserAgreementBase
      subHeader="Christian Foundation of TravelTips"
      checkingChildren={
        <Box
          className="checking-content-container"
          onClick={() => setChecked((prev) => !prev)}
        >
          <Checkbox className="checkbox" color="default" checked={checked} />
          <Typography className="content">
            I <b>understand</b> that TravelTips is built on Christian values,
            and I <b>agree to respect</b> them when <b>using the platform.</b>
          </Typography>
        </Box>
      }
      nextHelperNote="Terms of Service"
      nextDisabled={!checked}
      readonly={readonly}
      next={next}
    >
      <React.Fragment>
        {/* sub header */}
        <Typography variant="h6">
          All Cultures Bow Before the Word of God.
        </Typography>

        {/* content */}
        <Typography className="content">
          TravelTips is operated as a Christian-values platform. We welcome
          users from all backgrounds, beliefs, and cultures to explore, browse,
          and enjoy travel content. However, because this platform is built upon
          the authority of Scripture and the Lordship of Jesus Christ, all
          user-submitted content must be consistent with Biblical principles as
          understood by the Christian community operating TravelTips.
          <br />
          <br /> Our mission is to provide a travel-sharing environment that
          honors God, reflects Chrsitian morality, and avoids promoting ideas or
          practices contrary to the teachings of the Bible. While everyone is
          free to use the app as a guest or registered user, becoming a content
          contributor means agreeing to respect the Christian foundation on
          which TravelTips is built.
        </Typography>

        <Alert severity="info" variant="filled">
          This introduction explains the values that shape the platform and sets
          the context for the specific content standards and terms that follow.
        </Alert>
      </React.Fragment>
    </UserAgreementBase>
  );
};

export default FoundationProfile;
