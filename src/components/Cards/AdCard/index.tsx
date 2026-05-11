import { Box, Skeleton, Typography } from "@mui/material";
import type { Ad } from "@services/feed/ads";
import type { Business } from "@services/feed/businesses";
import TTButton from "@components/TTButton";
import "./index.scss";
import { Link } from "react-router";

type AdCardProps = {
  ad: Ad | undefined;
  business?: Business;
  templateId?: number;
  hideUndefined?: boolean;
};

const AdCard = ({
  ad,
  business,
  templateId,
  hideUndefined = false,
}: AdCardProps) => {
  if (!ad && hideUndefined) return;

  // console.log(ad);

  const imageSection = (
    <Box className="image-box">
      {ad?.picture ? (
        <img className="ad-image" src={ad.picture} alt="sponsored ad" />
      ) : (
        <Skeleton
          variant="rectangular"
          sx={{ margin: ".5rem" }}
          width="100%"
          height="auto"
        />
      )}
    </Box>
  );

  // footer section

  const getFooterSection = () => {
    switch (templateId ?? ad?.templateId) {
      case 1:
        return footerSection1;
      case 2:
        return footSection2;
      default:
        return;
    }
  };

  const footerSection1 = (
    <Box className="column footer">
      <Typography>
        <b>{ad?.title}</b>
      </Typography>
      <Typography className="ad-card-text" variant="body2">
        {ad?.text}
      </Typography>
      <Box className="row">
        <Typography variant="caption">
          <b>Sponsored</b>
        </Typography>{" "}
        •{" "}
        <Typography variant="caption">
          {business?.name ?? ad?.businessName}
        </Typography>
      </Box>
    </Box>
  );

  const footSection2 = (
    <Box className="row footer full">
      <Box className="column full">
        <Typography>
          <b>{ad?.title}</b>
        </Typography>
        <Box className="row">
          <Box className="column">
            <Typography variant="caption">
              {business?.name ?? ad?.businessName}
            </Typography>
            <Typography variant="caption">
              <b>Sponsored</b>
            </Typography>
          </Box>
          <Box className="ad-card-button-box">
            {ad?.linkLabel ? (
              <TTButton className="link-button" color="info">
                {ad.linkLabel}
              </TTButton>
            ) : undefined}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const contentSections = (
    <Box className="column">
      {imageSection}
      {getFooterSection()}
    </Box>
  );

  return (
    <Box className="ad-card-box">
      {ad?.link ? (
        <Link to={ad.link} target="_blank" rel="noopener">
          {contentSections}
        </Link>
      ) : (
        contentSections
      )}
    </Box>
  );
};

export default AdCard;
