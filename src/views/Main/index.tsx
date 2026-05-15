import {
  Box,
  Chip,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useIsMobile } from "@hooks/useIsMobile";
import TLogo from "@assets/T.svg";
import TTButton from "@components/TTButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { Link, useNavigate } from "react-router";
import { enqueueSnackbar } from "notistack";
import {
  URL_SURPRISE_TRIP_BIRTHDAY,
  URL_SURPRISE_TRIP_FAMILY,
  URL_SURPRISE_TRIP_ROMANCE,
} from "@constants/Urls";
import {
  SlDiamond,
  SlDocs,
  SlGlobeAlt,
  SlLock,
  SlMap,
  SlPeople,
} from "react-icons/sl";
import { ads } from "@constants/Defaults";
import AdCard from "@components/Cards/AdCard";
import XIcon from "@mui/icons-material/X";
import clsx from "clsx";
import "./index.scss";

const Main = () => {
  // window
  const isMobile = useIsMobile();
  // user
  const user = useSelector((state: RootState) => state.user);
  // others
  const navigate = useNavigate();

  const handleSloganButtonClick = () => {
    if (user?.id) {
      navigate("/workshop");
    } else {
      enqueueSnackbar("Please sign up/login first.");
    }
  };

  return (
    <Container className="main-page-container" maxWidth={false} disableGutters>
      <Box className="main-page-section">
        {/* hero section */}
        <Box className="main-page-content-container">
          {/* slogan */}
          <Box
            className={clsx("main-page-slogan-container", isMobile && "mobile")}
          >
            {isMobile ? (
              <img className="main-page-logo" src={TLogo} />
            ) : undefined}
            <Typography
              variant={isMobile ? "h4" : "h2"}
              className="main-page-slogan-highlight"
            >
              Your journey.
            </Typography>
            <Typography
              variant={isMobile ? "h6" : "h4"}
              className="main-page-slogan"
            >
              Your privacy. Your peace.
            </Typography>
            <Box className="column end section">
              <TTButton
                className="slogan-button"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                onClick={handleSloganButtonClick}
                disableRipple
              >
                Start planning free
              </TTButton>
            </Box>
            <Divider>
              <Chip label="Follow Us" color="utility" />
            </Divider>
            <Box className="follow-us">
              <Link
                to="https://x.com/travel_tips_go"
                target="_blank"
                rel="noopener"
              >
                <IconButton>
                  <XIcon />
                </IconButton>
              </Link>
            </Box>
          </Box>
        </Box>

        {/* promotion section - surprise trip */}
        <Box className="column main-page-section surprise-trip">
          <Box className="column full center v-center section-content">
            <Box className="column center">
              <Typography className="bold font-sora" variant="h4">
                Keep the magic alive!
              </Typography>
              <Typography className="primary bold font-sora" variant="h6">
                Plan Surprise Trips
              </Typography>
            </Box>
            <Box
              className={clsx(
                "row section center gap-large surprise-trip-cards",
                isMobile && "mobile",
              )}
            >
              <Box className="column center gap surprise-trip-card">
                <img
                  className="surprise-trip-image"
                  src={URL_SURPRISE_TRIP_ROMANCE}
                  loading="lazy"
                  alt="surprise-trip-romance"
                />
                <Typography className="bold font-lily" variant="h6">
                  Romance 💑
                </Typography>
              </Box>
              <Box className="column center gap surprise-trip-card">
                <img
                  className="surprise-trip-image"
                  src={URL_SURPRISE_TRIP_BIRTHDAY}
                  loading="lazy"
                  alt="surprise-trip-birthday"
                />
                <Typography className="bold font-lily" variant="h6">
                  Birthday 🎂
                </Typography>
              </Box>
              <Box className="column center gap surprise-trip-card">
                <img
                  className="surprise-trip-image"
                  src={URL_SURPRISE_TRIP_FAMILY}
                  loading="lazy"
                  alt="surprise-trip-family"
                />
                <Typography className="bold font-lily" variant="h6">
                  Family 👨‍👩‍👧
                </Typography>
              </Box>
            </Box>
            <Box className="column section text-center">
              <Typography className="bold font-sora section-helper">
                Share your trip with trusted people. Hide destination from
                everyone else.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* promotion section - no tracking cookies */}
        <Box className="column main-page-section no-tracking-cookies">
          <Box className="column full center v-center section-content">
            <Typography className="white bold font-sora" variant="h3">
              We. Don't. <s>Track. You.</s>
            </Typography>
            <Box className="column gap-large expect-cookie-list">
              <Typography className="white bold font-sora" variant="h6">
                No more behavioral tracking
              </Typography>
              <Typography className="white bold font-sora" variant="h6">
                No more third party ads
              </Typography>
              <Typography className="white bold font-sora" variant="h6">
                Contextual ads only!
              </Typography>
            </Box>
            <Box className="column section text-center">
              <Typography className="info bold font-sora section-helper">
                Built by someone who hates ads too..
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* promotion section - core feature */}
        <Box className="column main-page-section core-feature">
          <Box className="column full center v-center section-content">
            <Typography className="bold font-sora" variant="h3">
              Core Features
            </Typography>
            <Box className="row start center wrap feature-cards">
              <Box className="column gap-large feature-card">
                <Box className="row center">
                  <SlLock />
                </Box>
                <Box className="row center text-center wrap">
                  <Typography className="primary bold font-sora" variant="h6">
                    Selective Event Privacy
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  Lock individual stops within your trip. Public travelers see
                  your route — trusted people see everything. You control who
                  sees what.
                </Typography>
              </Box>
              <Box className="column gap-large feature-card">
                <Box className="row center">
                  <SlPeople />
                </Box>
                <Box className="row center text-center wrap">
                  <Typography className="info bold font-sora" variant="h6">
                    Trusted Sharing
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  Share your full trip — hidden events included — with specific
                  people only. Perfect for co-planners, travel partners, and
                  mission teams.
                </Typography>
              </Box>
              <Box className="column gap-large feature-card">
                <Box className="row center">
                  <SlMap />
                </Box>
                <Box className="row center text-center wrap">
                  <Typography className="warning bold font-sora" variant="h6">
                    Smart Routing
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  Get multiple route options between your stops. Pick the one
                  that fits. Open in Google Maps when you're ready to navigate
                  live.
                </Typography>
              </Box>
              <Box className="column gap-large feature-card">
                <Box className="row center">
                  <SlDiamond />
                </Box>
                <Box className="row center text-center wrap">
                  <Typography className="success bold font-sora" variant="h6">
                    Budget Tagging
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  Tag every trip from budget (1) to luxury (5). Discover trips
                  that match how you like to travel — not just where.
                </Typography>
              </Box>
              <Box className="column gap-large feature-card">
                <Box className="row center">
                  <SlDocs />
                </Box>
                <Box className="row center text-center wrap">
                  <Typography className="utility bold font-sora" variant="h6">
                    Unlimited PDF Downloads
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  Download your full itinerary anytime, no limits. Perfect for
                  remote areas, printed handouts, or sharing with people who
                  aren't on the platform.
                </Typography>
              </Box>
              <Box className="column gap-large feature-card">
                <Box className="row center">
                  <SlGlobeAlt />
                </Box>
                <Box className="row center text-center wrap">
                  <Typography className="region bold font-sora" variant="h6">
                    Region Discovery
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  Tag trips by region and let others discover your journey.
                  Build a public travel story while keeping your private moments
                  hidden.
                </Typography>
              </Box>
            </Box>
            <Box className="column section text-center">
              <Typography className="bold font-sora section-helper">
                Simple pricing. No hidden fees. No data games.
              </Typography>
              <TTButton
                onClick={() => navigate("/membership")}
                color="info"
                circular
                disableRipple
              >
                Subscribe. Up to $9/month.
              </TTButton>
            </Box>
          </Box>
        </Box>

        {/* promotion section - Christian Values */}
        <Box className="column main-page-section christian-values">
          <Box className="column full center v-center section-content">
            <Typography className="bold font-sora" variant="h3">
              Christian Values
            </Typography>
            <Typography className="primary bold font-sora" variant="h6">
              Built with integrity. Open to all.
            </Typography>
            <Box className="row start center wrap value-cards">
              <Box className="column value-card">
                <Box className="row value-header">
                  <Typography className="bold font-sora" variant="h6">
                    Values Statement
                  </Typography>
                </Box>
                <Box className="value-content">
                  <Typography className="bold font-sora">
                    We believe how you build something matters as much as what
                    you build. <br />
                    <br />
                    Every ad is reviewed. Every user is respected. Every journey
                    is yours.
                  </Typography>
                </Box>
              </Box>
              <Box className="column value-card">
                <Box className="row value-header">
                  <Typography className="bold font-sora" variant="h6">
                    Weekly Gospel
                  </Typography>
                </Box>
                <Box className="value-content">
                  <Typography className="bold font-sora">
                    Every week the founder shares a reflection connecting faith,
                    life, and the journey ahead. Free for everyone — no
                    subscription required.
                    <br />
                    <br /> Whether you share the faith or simply appreciate
                    thoughtful writing — you're welcome here.
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className="column section text-center">
              <Typography className="bold font-sora section-helper">
                Travel intentionally. Live purposefully.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* promotion section - Made For You */}
        <Box className="column main-page-section made-for-you">
          <Box className="column full center v-center section-content">
            <Typography className="bold font-sora" variant="h3">
              Made For You
            </Typography>
            <Box className="row start center wrap for-you-cards">
              <Box className="column for-you-card">
                <Box className="row section gap">
                  <Typography variant="h3">&#128536;</Typography>
                  <Typography className="bold font-sora" variant="h6">
                    Romantic &<br /> Surprise Planners
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  You have something special in mind. Plan every detail
                  privately, reveal it at exactly the right moment. No spoilers.
                </Typography>
              </Box>
              <Box className="column for-you-card">
                <Box className="row section gap">
                  <Typography variant="h3">⛪</Typography>
                  <Typography className="bold font-sora" variant="h6">
                    Church Groups &<br /> Mission Teams
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  Coordinate complex group itineraries with sensitive locations.
                  Share logistics with your team while keeping certain stops
                  private from participants.
                </Typography>
              </Box>
              <Box className="column for-you-card">
                <Box className="row section gap">
                  <Typography variant="h3">✍️</Typography>
                  <Typography className="bold font-sora" variant="h6">
                    Travel Bloggers
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  Build a beautiful public trip portfolio. Keep your secret
                  spots hidden from followers while sharing everything with
                  trusted collaborators.
                </Typography>
              </Box>
              <Box className="column for-you-card">
                <Box className="row section gap">
                  <Typography variant="h3">👨‍👩‍👧</Typography>
                  <Typography className="bold font-sora" variant="h6">
                    Family Reunion Organizers
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  One person handles everything so the family just shows up.
                  Share the full plan with co-organizers, keep the surprise for
                  everyone else.
                </Typography>
              </Box>
              <Box className="column for-you-card">
                <Box className="row section gap">
                  <Typography variant="h3">🔒</Typography>
                  <Typography className="bold font-sora" variant="h6">
                    Privacy-Conscious Traveler
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  You're tired of being tracked, profiled, and sold to. Here
                  you're just a traveler — nothing more, nothing less.
                </Typography>
              </Box>
            </Box>
            <Box className="column section text-center">
              <Typography className="bold font-sora section-helper">
                Whoever you are — you travel your way here.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* promotion section - Ad Platform */}
        <Box className="column main-page-section ad-platform">
          <Box className="column full center v-center section-content">
            <Typography className="bold font-sora" variant="h3">
              Promote Your Business
            </Typography>
            <Box className="row center wrap ad-platform-cards">
              <Box className="column gap-large ad-platform-card">
                <Box className="column center text-center">
                  <Typography className="bold font-sora" variant="h3">
                    ⚖️
                  </Typography>
                  <Typography className="bold font-sora" variant="h5">
                    Fair & Transparent
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  Purchase ad weight on the search parameters that matter to
                  your business. More weight means more visibility — simple,
                  honest, no auction games.
                </Typography>
              </Box>
              <Box className="column gap-large ad-platform-card">
                <Box className="column center text-center">
                  <Typography className="bold font-sora" variant="h3">
                    🎯
                  </Typography>
                  <Typography className="bold font-sora" variant="h5">
                    Context-Based Targeting
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  Your ad appears when travelers are actively planning trips in
                  your region and budget range. No behavioral profiling. No
                  creepy retargeting. Just the right moment.
                </Typography>
              </Box>
              <Box className="column gap-large ad-platform-card">
                <Box className="column center text-center">
                  <Typography className="bold font-sora" variant="h3">
                    ✅
                  </Typography>
                  <Typography className="bold font-sora" variant="h5">
                    Reviewed & Trusted
                  </Typography>
                </Box>
                <Typography className="font-sora">
                  Every business and ad is manually reviewed before going live.
                  Your brand appears alongside content that shares your values —
                  not just anything.
                </Typography>
              </Box>
            </Box>
            <Typography className="bold font-sora" variant="h3">
              How it works
            </Typography>
            <Box className="column left center step-cards">
              <Box className="column step-card">
                <Typography className="info bold font-sora" variant="h4">
                  Step 1
                </Typography>
                <Typography className="bold font-sora" variant="h6">
                  Create your business profile
                </Typography>
              </Box>
              <Box className="column step-card">
                <Typography className="info bold font-sora" variant="h4">
                  Step 2
                </Typography>
                <Typography className="bold font-sora" variant="h6">
                  Purchase ad weight on your target parameters
                  <br />
                  e.g. region, budget, keyword, user
                </Typography>
              </Box>
              <Box className="column step-card">
                <Typography className="info bold font-sora" variant="h4">
                  Step 3
                </Typography>
                <Typography className="bold font-sora" variant="h6">
                  Appear naturally in relevant trip searches
                </Typography>
              </Box>
            </Box>
            <Typography className="bold font-sora" variant="h3">
              Examples
            </Typography>
            <Box className="row center wrap ad-examples">
              {ads.map((ad, i) => (
                <AdCard key={i} ad={ad} />
              ))}
            </Box>
            <TTButton
              onClick={() => navigate("/partnership")}
              color="info"
              circular
              disableRipple
            >
              Register your business →
            </TTButton>
            <Box className="column section text-center">
              <Typography className="white bold font-sora section-helper">
                Ad weights start at $10 each. Minimum 10 weights per target.
                <br />
                Premium pricing applies to high-demand regions.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Main;
