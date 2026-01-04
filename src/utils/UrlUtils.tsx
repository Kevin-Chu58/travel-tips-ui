import { Typography } from "@mui/material";
import { SiLinktree, SiFacebook } from "react-icons/si";

const getSiteLogo = (siteName?: string) => {
  const size = 24;
  switch (siteName) {
    case "linktr.ee":
    case "linktree":
      return <SiLinktree size={size} />;
    case "facebook.com":
      return <SiFacebook size={size} />;
    case "oneparking.com": 
      return <Typography variant="h6">P</Typography>;
    default:
      return undefined;
  }
};

/**
 * @author ChatGPT
 * @param url url
 * @returns site name
 */
const getSiteName = (url: string): string => {
  const u = new URL(url);

  // Get hostname (e.g. "www.facebook.com")
  let host = u.hostname.toLowerCase();

  return host.replace(/^www\./, "");
};

export const UrlUtils = {
  getSiteLogo,
  getSiteName,
};
