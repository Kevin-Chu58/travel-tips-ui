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

  // Remove leading www.
  host = host.replace(/^www\./, "");

  // Split hostname into parts
  const parts = host.split(".");

  // Handle multi-TLDs like co.uk, com.au, org.uk, etc.
  const knownSecondLevelTLDs = new Set([
    "co.uk",
    "org.uk",
    "gov.uk",
    "com.au",
    "net.au",
    "org.au",
    "co.jp",
  ]);

  const lastTwo = parts.slice(-2).join(".");
  if (knownSecondLevelTLDs.has(lastTwo)) {
    // Example: ["travel-tips", "co", "uk"]
    return parts[parts.length - 3];
  }

  // Normal case: take second-to-last part before TLD
  // Example: ["facebook", "com"] → "facebook"
  return parts[parts.length - 2];
};

export const UrlUtils = {
  getSiteLogo,
  getSiteName,
};
