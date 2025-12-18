import { Alert, Box, Checkbox, Divider, Typography } from "@mui/material";
import crossSvg from "@assets/cross.svg";
import TTButton from "@components/TTButton";
import { useState } from "react";
import "./index.scss";

type FoundationProfileProps = {
  readonly?: boolean;
  next: () => void;
};

const FoundationProfile = ({
  readonly = false,
  next,
}: FoundationProfileProps) => {
  // checkbox
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <Box className="user-agreement-foundation-container">
      {/* header */}
      <Box className="user-agreement-foundation-header-container">
        <Box className="user-agreement-foundation-header-content-container">
          <img src={crossSvg} height={48} />
          <Box>
            <Typography variant="h5">User Agreement</Typography>
            <Typography fontStyle="italic">
              Christian Foundation of TravelTips
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="user-agreement-foundation-content-container">
        {/* sub header */}
        <Typography variant="h6">
          All Cultures Bow Before the Word of God.
        </Typography>

        {/* content */}
        <Typography className="user-agreement-foundation-content">
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
      </Box>

      {!readonly ? <Divider flexItem variant="middle" /> : undefined}

      {/* agreement checking */}
      {!readonly ? (
        <Box className="user-agreement-checking-container">
          <Box
            className="user-agreement-foundation-checking-content-container"
            onClick={() => setChecked((prev) => !prev)}
          >
            <Checkbox
              className="user-agreement-foundation-checkbox"
              color="default"
              checked={checked}
            />
            <Typography className="user-agreement-foundation-content">
              I <b>understand</b> that TravelTips is built on Christian values,
              and I <b>agree to respect</b> them when <b>using the platform.</b>
            </Typography>
          </Box>

          <Box className="user-agreement-foundation-checking-content-container">
            <Typography className="user-agreement-foundation-checking-helper">
              Next: Terms of Service
            </Typography>
            <TTButton
              className="user-agreement-foundation-checkbox-button"
              circular
              disabled={!checked}
              onClick={next}
            >
              Proceed
            </TTButton>
          </Box>
        </Box>
      ) : undefined}
    </Box>
  );
};

export default FoundationProfile;
