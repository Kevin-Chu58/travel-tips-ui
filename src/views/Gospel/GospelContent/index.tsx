import { Box, Divider, MenuItem, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  sermonsService,
  type Sermon,
  type SermonLabelComplete,
} from "@services/gospel/sermons";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import MenuIcon from "@mui/icons-material/Menu";
import TTIconButton from "@components/TTIconButton";
import clsx from "clsx";
import "./index.scss";

type GospelContentProps = {
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

const GospelContent = ({ setIsHidden }: GospelContentProps) => {
  // window
  const isMobile = useIsMobile();
  // url
  const { labelSlug, orderId } = useParams();
  // sermon label
  const [label, setLabel] = useState<SermonLabelComplete | undefined>(
    undefined,
  );
  // sermons
  const [sermons, setSermons] = useState<Sermon[]>([]);
  // sermon
  const [sermon, setSermon] = useState<Sermon | undefined>(undefined);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // others
  const navigate = useNavigate();

  // init functions

  const initLabel = async (labelSlug: string) => {
    try {
      const label =
        await sermonsService.getSermonLabelCompleteBySlug(labelSlug);
      setLabel(label);
    } catch (_) {
      navigate("/gospel");
      enqueueSnackbar("Topic not found.", { variant: "error" });
    }
  };

  const initSermons = async (labelSlug: string) => {
    setIsLoading(true);
    const sermons = await sermonsService.getSermonsByParams({
      labelSlug: labelSlug,
      isDesc: false,
    });
    setSermons(sermons);
    setIsLoading(false);
  };

  const initSermon = async (labelSlug: string, orderId: number) => {
    try {
      const sermon = await sermonsService.getSermonByLabelOrder(
        labelSlug,
        orderId,
      );
      setSermon(sermon);
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  // use effects

  // initiate complete label, sermons, and sermon on label slug and order id
  useEffect(() => {
    if (!labelSlug) {
      setSermons([]);
      setSermon(undefined);
      return;
    }

    initLabel(labelSlug);

    const _orderId = orderId ? parseInt(orderId) : undefined;

    if (_orderId === undefined) {
      initSermons(labelSlug);
    } else if (_orderId > 0) {
      initSermon(labelSlug, _orderId);
    } else {
      navigate("/gospel");
      enqueueSnackbar("Sermon not found.", { variant: "error" });
    }
  }, [labelSlug, orderId]);

  // handle functions

  const handleBack = () => {
    setSermon(undefined);
    navigate("./..");
  };

  const SermonView = () => {
    return (
      <Box className="gospel-content-container">
        <Box>
          <Typography className="back-text" onClick={handleBack}>
            {`<< Back to Topic`}
          </Typography>
        </Box>
        <Typography>{sermon?.content}</Typography>
      </Box>
    );
  };

  const TopicView = () => {
    return (
      <Box className={clsx("gospel-content-container", isMobile && "mobile")}>
        {/* header */}
        <Box className="header-box">
          {/* nav button - only in mobile view */}
          {isMobile ? (
            <TTIconButton onClick={() => setIsHidden(false)} noBorder>
              <MenuIcon />
            </TTIconButton>
          ) : <Typography className="back-text" onClick={handleBack}>
            {`<< Back to Home`}
          </Typography>}

          <Typography
            className={clsx("category", isMobile && "mobile")}
            variant="h3"
          >
            {label?.category?.name}
          </Typography>
          <Typography
            className={clsx("topic", isMobile && "mobile")}
            variant="h5"
          >
            {label?.topic?.name}
          </Typography>
        </Box>

        <Divider variant="middle" />

        {/* content */}
        <Box className="content-box">
          {isLoading ? undefined : sermons.length > 0 ? (
            sermons.map((sermon, i) => (
              <MenuItem
                key={sermon.id}
                onClick={() => navigate(`./${i + 1}`)}
                disableRipple
              >
                <Box className="sermon-box">
                  {/* order number */}
                  <Typography variant="h6">{i + 1}.</Typography>
                  {/* details */}
                  <Box>
                    <Typography variant="h5">{sermon.title}</Typography>
                    <Typography>{sermon.publishAt}</Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))
          ) : (
            <Box className="no-sermon-box">
              <Typography>No sermons published yet.</Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  if (labelSlug && orderId) return <SermonView />;
  if (labelSlug && !orderId) return <TopicView />;
  else return <Box>feed</Box>;
};

export default GospelContent;
