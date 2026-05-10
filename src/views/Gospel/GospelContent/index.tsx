import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
  writingsService,
  type Writing,
  type WritingLabelComplete,
} from "@services/gospel/writings";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import AddIcon from "@mui/icons-material/Add";
import TTButton from "@components/TTButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GospelNavButton from "./GospelNavButton";
import {
  youTubeFeedsService,
  type YouTubeChannel,
} from "@services/gospel/youtubeFeeds";
import clsx from "clsx";
import "./index.scss";
import TimeUtils from "@utils/TimeUtils";

// lazy load
const AddWritingLabelForm = React.lazy(
  () => import("@components/Forms/AddWritingLabelForm"),
);
const WritingForm = React.lazy(() => import("@components/Forms/WritingForm"));
const DeleteWritingForm = React.lazy(
  () => import("@components/Forms/DeleteWritingForm"),
);
const MarkdownBox = React.lazy(() => import("@components/MarkdownBox"));

type GospelContentProps = {
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

const GospelContent = ({ setIsHidden }: GospelContentProps) => {
  // window
  const isMobile = useIsMobile();
  // url
  const location = useLocation();
  const { labelSlug, orderId } = useParams();
  // feed
  const [youTubeFeed, setYouTubeFeed] = useState<YouTubeChannel[]>([]);
  // search params
  const [searchParams] = useSearchParams();
  const isWriterParams = Boolean(searchParams.has("my"));
  // Writing label
  const [label, setLabel] = useState<WritingLabelComplete | undefined>(
    undefined,
  );
  // Writings
  const [writings, setWritings] = useState<Writing[]>([]);
  // Writing
  const [writing, setWriting] = useState<Writing | undefined>(undefined);
  // my Writings
  const [myWritings, setMyWritings] = useState<Writing[]>([]);
  // my Writing - in edit
  const [myWriting, setMyWriting] = useState<Writing | undefined>();
  // form status
  const [openForm, setOpenForm] = useState<
    "addWritingLabel" | "writing" | "deleteWriting" | null
  >(null);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // others
  const navigate = useNavigate();

  // init functions

  const initLabel = async (labelSlug: string) => {
    try {
      const label =
        await writingsService.getWritingLabelCompleteBySlug(labelSlug);
      setLabel(label);
    } catch (_) {
      navigate("/gospel");
      enqueueSnackbar("Topic not found.", { variant: "error" });
    }
  };

  const initWritings = async (labelSlug: string) => {
    setIsLoading(true);
    const Writings = await writingsService.getWritingsByParams({
      labelSlug: labelSlug,
      isDesc: false,
    });
    setWritings(Writings);
    setIsLoading(false);
  };

  const initWriting = async (labelSlug: string, orderId: number) => {
    try {
      setIsLoading(true);
      const Writing = await writingsService.getWritingByLabelOrder(
        labelSlug,
        orderId,
      );
      setWriting(Writing);
      setIsLoading(false);
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const initMyWritings = async () => {
    setIsLoading(true);
    const Writings = await writingsService.getMyWritings();
    setMyWritings(Writings);
    setIsLoading(false);
  };

  const initFeed = async () => {
    if (youTubeFeed && youTubeFeed.length > 0) return;

    setIsLoading(true);
    const _youTubeFeed = await youTubeFeedsService.getGospelYouTubeFeed();
    setYouTubeFeed(_youTubeFeed);
    setIsLoading(false);
  };

  // async functions

  const asyncNewWriting = (Writing: Writing) => {
    setMyWritings((prev) => [Writing, ...prev]);
  };

  const asyncUpdateWriting = (Writing: Writing) => {
    let Writings = [...myWritings];
    const i = Writings.findIndex((s) => s.id === Writing.id);

    if (i < 0) return;

    Writings[i] = Writing;

    setMyWritings([...Writings]);
  };

  const asyncDeleteWriting = (WritingId: number) => {
    setMyWritings((prev) => prev.filter((s) => s.id !== WritingId));
  };

  // use effects

  // initiate complete label, Writings, and Writing on label slug and order id
  useEffect(() => {
    if (!labelSlug) {
      setWritings([]);
      setWriting(undefined);
      return;
    }

    initLabel(labelSlug);

    const _orderId = orderId ? parseInt(orderId) : undefined;

    if (_orderId === undefined) {
      initWritings(labelSlug);
    } else if (_orderId > 0) {
      initWriting(labelSlug, _orderId);
    } else {
      navigate("/gospel");
      enqueueSnackbar("Writing not found.", { variant: "error" });
    }
  }, [labelSlug, orderId]);

  // init my Writings on isWriterParams
  useEffect(() => {
    if (!isWriterParams) return;
    initMyWritings();
  }, [isWriterParams]);

  useEffect(() => {
    if (location.pathname === "/gospel" && searchParams.size === 0) {
      initFeed();
    }
  }, [location, searchParams]);

  // handle functions

  const handleDeleteWriting = async () => {
    if (!myWriting) return;

    try {
      const deletedWritingId = await writingsService.deleteWriting(
        myWriting.id,
      );
      asyncDeleteWriting(deletedWritingId);

      enqueueSnackbar("Writing deleted.", { variant: "success" });

      setOpenForm(null);
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const handleOpenWritingForm = () => {
    setOpenForm("writing");
    handleAnchorElClose();
  };

  const handleCloseWritingForm = () => {
    setOpenForm(null);
    setMyWriting(undefined);
  };

  const handleOpenDeleteWritingForm = () => {
    setOpenForm("deleteWriting");
    handleAnchorElClose();
  };

  const handleMyWritingClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    Writing: Writing,
  ) => {
    event.stopPropagation();
    setMyWriting(Writing);
    handleAnchorElClick(event);
  };

  const handleAnchorElClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAnchorElClose = () => {
    setAnchorEl(null);
  };

  const handleBack = () => {
    setWriting(undefined);
    navigate("./..");
  };

  const handleBackHome = () => {
    setWriting(undefined);
    navigate("/gospel");
  };

  // components

  const WriterView = useMemo(() => {
    return (
      <Box
        className={clsx(
          "column full flex gospel-content-container",
          isMobile && "mobile",
        )}
      >
        {!isLoading ? (
          <React.Fragment>
            <Box className="header-box">
              {/* nav button - only in mobile view */}
              <GospelNavButton
                setIsHidden={setIsHidden}
                handleBack={handleBack}
                handleBackHome={handleBackHome}
              />
              <Typography
                className={clsx("category", isMobile && "mobile")}
                variant="h3"
              >
                My Writings
              </Typography>

              <Box className="tool-box">
                {/* label setting */}
                <TTButton
                  label="New Labels"
                  startIcon={<AddIcon />}
                  color="info"
                  onClick={() => setOpenForm("addWritingLabel")}
                />
                {/* add Writing */}
                <TTButton
                  label="New Writing"
                  startIcon={<AddIcon />}
                  color="utility"
                  onClick={() => setOpenForm("writing")}
                />
              </Box>
            </Box>

            <Divider />

            {/* content */}
            <Box>
              {myWritings.map((writing) => (
                <MenuItem
                  key={writing.id}
                  className="my-Writing-menu-item"
                  disableRipple
                >
                  <Box className="row full">
                    <Box className="column">
                      <Box className="row full">
                        <Typography variant="h6">{writing.title}</Typography>
                        <Typography variant="caption">
                          {writing.publishAt}
                        </Typography>
                      </Box>
                      {/* label - category & topic */}
                      {writing.label ? (
                        <Box className="row wrap">
                          <Chip
                            label={writing.label.category?.name}
                            size="small"
                            color="info"
                          />
                          <Chip
                            label={writing.label.topic?.name}
                            size="small"
                            color="utility"
                          />
                        </Box>
                      ) : (
                        <Typography fontStyle="italic">
                          No topic assigned
                        </Typography>
                      )}
                    </Box>

                    <Box className="more-option-button">
                      <IconButton
                        onClick={(e) => handleMyWritingClick(e, writing)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Box>
          </React.Fragment>
        ) : (
          <Box className="column center v-center flex">
            <CircularProgress color="info" aria-label="Loading…" />
          </Box>
        )}
      </Box>
    );
  }, [isMobile, myWritings, handleMyWritingClick]);

  const WritingView = useMemo(() => {
    return (
      <Box
        className={clsx(
          "column full flex gospel-content-container",
          isMobile && "mobile",
        )}
      >
        {!isLoading ? (
          <React.Fragment>
            <Box className="header-box">
              {/* nav button - only in mobile view */}
              <GospelNavButton
                isWriting={true}
                setIsHidden={setIsHidden}
                handleBack={handleBack}
                handleBackHome={handleBackHome}
              />
              {writing?.label ? (
                <React.Fragment>
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
                </React.Fragment>
              ) : undefined}
            </Box>
            <Suspense>
              <MarkdownBox
                className="writing-markdown-box"
                text={writing?.content}
                isOfficial
              />
            </Suspense>
          </React.Fragment>
        ) : (
          <Box className="column center v-center flex">
            <CircularProgress color="info" aria-label="Loading…" />
          </Box>
        )}
      </Box>
    );
  }, [isMobile, writing, label]);

  const TopicView = useMemo(() => {
    return (
      <Box
        className={clsx(
          "column full flex gospel-content-container",
          isMobile && "mobile",
        )}
      >
        {!isLoading ? (
          <React.Fragment>
            {/* header */}
            <Box className="header-box">
              {/* nav button - only in mobile view */}
              <GospelNavButton
                setIsHidden={setIsHidden}
                handleBack={handleBack}
                handleBackHome={handleBackHome}
              />

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
            <Box>
              {writings.length > 0 ? (
                writings.map((writing, i) => (
                  <MenuItem
                    key={writing.id}
                    onClick={() => navigate(`./${i + 1}`)}
                    disableRipple
                  >
                    <Box className="Writing-box">
                      {/* order number */}
                      <Typography variant="h6">{i + 1}.</Typography>
                      {/* details */}
                      <Box>
                        <Typography variant="h5">{writing.title}</Typography>
                        <Typography>{writing.publishAt}</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <Box className="no-Writing-box">
                  <Typography>No Writings published yet.</Typography>
                </Box>
              )}
            </Box>
          </React.Fragment>
        ) : (
          <Box className="column center v-center flex">
            <CircularProgress color="info" aria-label="Loading…" />
          </Box>
        )}
      </Box>
    );
  }, [isMobile, label, isLoading, writings]);

  const FeedView = useMemo(
    () => (
      <Box className="column full flex gospel-content-container mobile">
        {/* header */}
        <Box className="header-box">
          {/* nav button - only in mobile view */}
          <GospelNavButton
            label="Home"
            isWriting={false}
            showInPc={false}
            setIsHidden={setIsHidden}
            handleBack={handleBack}
            handleBackHome={handleBackHome}
          />
        </Box>
        {!isLoading ? (
          <Box className="column gap">
            {youTubeFeed.map((channel) => (
              <Box key={channel.id} className="column gap">
                <Box className="row channel-box">
                  <Link
                    className="channel-box-link"
                    to={`https://www.youtube.com/${channel?.customUrl}`}
                    target="_blank"
                    rel="noopener"
                  >
                    <Avatar
                      src={channel.thumbnailUrl}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box className="column">
                      <Typography variant="h6">{channel.title}</Typography>
                      <Typography color="info">{channel.customUrl}</Typography>
                    </Box>
                  </Link>
                </Box>
                <Box className="row start gap videos-box no-scrollbar">
                  {channel.videos.map((video) => (
                    <Link
                      key={video.videoId}
                      className="channel-box-link"
                      to={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener"
                    >
                      <Box className="column video-card">
                        <Box className="video-box">
                          <img
                            className="video-thumbnail"
                            src={video.thumbnailUrl}
                            loading="lazy"
                          />
                        </Box>
                        <Typography>{video.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {TimeUtils.getDate(video.publishedAt)}
                        </Typography>
                      </Box>
                    </Link>
                  ))}
                </Box>
              </Box>
            ))}
            <Box className="row section" />
          </Box>
        ) : (
          <Box className="column center v-center flex">
            <CircularProgress color="info" aria-label="Loading…" />
          </Box>
        )}
      </Box>
    ),
    [isMobile, isLoading, youTubeFeed],
  );

  const MainContent = useMemo(() => {
    if (labelSlug && orderId) return WritingView; // but only if moved outside
    if (labelSlug && !orderId) return TopicView;
    if (isWriterParams) return WriterView;
    return FeedView;
  }, [
    labelSlug,
    orderId,
    isWriterParams,
    WritingForm,
    TopicView,
    WriterView,
    FeedView,
  ]);

  return (
    <React.Fragment>
      {MainContent}

      {/* forms */}
      {openForm === "addWritingLabel" && (
        <AddWritingLabelForm open onClose={() => setOpenForm(null)} />
      )}
      {openForm === "writing" && (
        <WritingForm
          open
          WritingId={myWriting?.id}
          onClose={handleCloseWritingForm}
          onAction={myWriting ? asyncUpdateWriting : asyncNewWriting}
        />
      )}
      {openForm === "deleteWriting" && (
        <DeleteWritingForm
          open
          onClose={() => setOpenForm(null)}
          onAction={handleDeleteWriting}
        />
      )}

      {/* popups */}
      <Menu
        className="TT-menu flex"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleAnchorElClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleOpenWritingForm}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem className="error" onClick={handleOpenDeleteWritingForm}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default GospelContent;
