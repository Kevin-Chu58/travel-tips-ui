import { useIsMobile } from "@hooks/useIsMobile";
import type { Banner } from "@services/feed/banners";
import { Box, Chip, Typography, type SxProps } from "@mui/material";
import type { Theme } from "@emotion/react";
import MarkdownBox from "@components/MarkdownBox";
import { StyleUtils } from "@utils/StyleUtils";
import { useNavigate } from "react-router";
import clsx from "clsx";
import "./index.scss";

type BannerCardProps = {
  banner: Banner;
  mobileView?: boolean;
  allowNav?: boolean;
};

const BannerCard = ({
  banner,
  mobileView = false,
  allowNav = true,
}: BannerCardProps) => {
  // window
  const isMobile = mobileView ?? useIsMobile();
  // navigate
  const navigate = useNavigate();

  const handleClick = () => {
    if (!allowNav) return;

    if (banner.link.startsWith("/")) {
      navigate(banner.link);
    } else {
      window.location.href = banner.link;
    }
  };

  const getStyling = (styling: string | undefined) => {
    if (!styling) return undefined;

    try {
      return StyleUtils.sanitizeStyles(JSON.parse(styling) as SxProps<Theme>);
    } catch (_) {
      return undefined;
    }
  };

  const dynamicStyles = getStyling(banner.styling?.styling);

  const BannerContent = (
    <Box className="banner-content-box" sx={dynamicStyles}>
      <Box className="content">
        <Typography className="title">{banner.title}</Typography>
        <MarkdownBox
          className="overview"
          text={banner.overview}
          isOfficial
        ></MarkdownBox>
        {banner.label ? (
          <Chip variant="filled" className="label" label={banner.label} />
        ) : undefined}
        {banner.subLabel ? (
          <Chip
            variant="filled"
            className="sub-label"
            label={banner.subLabel}
          />
        ) : undefined}
      </Box>
    </Box>
  );

  const BannerContentMobile = (
    <Box className="banner-content-box" sx={dynamicStyles}>
      <Box className="content mobile">
        <Typography className="title">{banner.title}</Typography>
        {banner.label ? (
          <Chip variant="filled" className="label" label={banner.label} />
        ) : undefined}
        {banner.subLabel ? (
          <Chip
            variant="filled"
            className="sub-label"
            label={banner.subLabel}
          />
        ) : undefined}
      </Box>
    </Box>
  );

  try {
    return (
      <Box
        className={clsx("banner-card", isMobile && "mobile")}
        onClick={handleClick}
      >
        {banner.picture ? (
          <img
            className="banner-card-image"
            src={banner.picture.url}
            alt="banner-image"
          />
        ) : undefined}
        {isMobile ? BannerContentMobile : BannerContent}
      </Box>
    );
  } catch (_) {
    return "an error occurred";
  }
};

export default BannerCard;
