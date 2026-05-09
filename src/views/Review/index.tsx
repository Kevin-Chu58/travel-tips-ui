import { Box, Container, Divider, Typography } from "@mui/material";
import type { NavTab } from "@constants/Types";
import { useNavigate } from "react-router";
import type { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { businessesService, type Business } from "@services/feed/businesses";
import { adsService, type Ad } from "@services/feed/ads";
import BusinessReview from "./ReviewCard/BusinessReview";
import { FiRefreshCw } from "react-icons/fi";
import TTButton from "@components/TTButton";
import AdReview from "./ReviewCard/AdReview";
import "./index.scss";

const Review = () => {
  // user
  const user = useSelector((state: RootState) => state.user);
  // type focus
  const [typeFocus, setTypeFocus] = useState<number | undefined>();
  // review list
  const [reviews, setReviews] = useState<any[]>([]);
  // others
  const navigate = useNavigate();

  // navigate to main page if authorization check fails
  useEffect(() => {
    if (!user.isLoading && !user.isAdmin && !user.isReviewer) {
      navigate("/");
    }
  }, [user]);

  // initiate review list when type focus is specified
  useEffect(() => {
    if (typeFocus !== undefined) {
      initFunction();
    }
  }, [typeFocus]);

  // init functions

  const initFunction = async () => {
    switch (typeFocus) {
      case 0: // pending-business
        setReviews(await businessesService.getPendingBusinesses());
        return;
      case 1: // pending-ads
        setReviews(await adsService.getPendingAds());
        return;
      default:
        return;
    }
  };

  // handle functions

  // components

  const getDisplay = (review: any, key: number) => {
    switch (typeFocus) {
      case 0: // pending-business
        return <BusinessReview key={key} business={review as Business} />;
      case 1: // pending-ads
        return <AdReview key={key} ad={review as Ad} />;
      default:
        return;
    }
  };

  const reviewTypes = [
    {
      name: "pending-business",
      label: "Pending Businesses",
      description: "Registered businesses that are in pending state",
    },
    {
      name: "pending-ads",
      label: "Pending Ads",
      description: "Newly created Ads that are in pending state",
    },
  ] as NavTab[];

  const focusedType =
    typeFocus !== undefined ? reviewTypes[typeFocus] : undefined;

  return (
    <Container className="review-view" maxWidth="md">
      <Typography variant="h4">Pick a category to review</Typography>
      <Divider />
      <Box className="row section gap">
        {reviewTypes.map((r, i) => (
          <Box
            key={r.name}
            className="review-type-content"
            onClick={() => setTypeFocus(i)}
          >
            <Typography variant="h6">{r.label}</Typography>
            <Divider flexItem />
            <Typography>{r.description}</Typography>
          </Box>
        ))}
      </Box>

      {/* review list */}
      {focusedType !== undefined ? (
        <Box>
          <Box className="row section gap">
            <Typography variant="h6">{focusedType.label}</Typography>
            <TTButton
              color="utility"
              startIcon={<FiRefreshCw />}
              size="small"
              onClick={initFunction}
            >
              Refresh
            </TTButton>
          </Box>
          {reviews.length > 0 ? (
            <Box>{reviews.map((r, i) => getDisplay(r, i))}</Box>
          ) : (
            <Typography>No reiews found.</Typography>
          )}
        </Box>
      ) : undefined}
    </Container>
  );
};

export default Review;
