import {
  Box,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router";
import React, { useEffect, useState } from "react";
import {
  sermonsService,
  type Sermon,
  type SermonLabelComplete,
} from "@services/gospel/sermons";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import MenuIcon from "@mui/icons-material/Menu";
import TTIconButton from "@components/TTIconButton";
import SermonForm from "@components/Forms/SermonForm";
import AddIcon from "@mui/icons-material/Add";
import TTButton from "@components/TTButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkdownBox from "@components/MarkdownBox";
import DeleteSermonForm from "@components/Forms/DeleteSermonForm";
import AddSermonLabelForm from "@components/Forms/AddSermonLabelForm";
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
  // search params
  const [searchParams] = useSearchParams();
  const isWriterParams = Boolean(searchParams.has("my"));
  // sermon label
  const [label, setLabel] = useState<SermonLabelComplete | undefined>(
    undefined,
  );
  // sermons
  const [sermons, setSermons] = useState<Sermon[]>([]);
  // sermon
  const [sermon, setSermon] = useState<Sermon | undefined>(undefined);
  // my sermons
  const [mySermons, setMySermons] = useState<Sermon[]>([]);
  // my sermon - in edit
  const [mySermon, setMySermon] = useState<Sermon | undefined>();
  // form status
  const [openAddSermonLabelForm, setOpenAddSermonLabelForm] = useState<boolean>(false);
  const [openNewSermonForm, setOpenNewSermonForm] = useState<boolean>(false);
  const [openDeleteSermonForm, setOpenDeleteSermonForm] = useState<boolean>(false);
  // behavior
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
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

  const initMySermons = async () => {
    setIsLoading(true);
    const sermons = await sermonsService.getMySermons();
    setMySermons(sermons);
    setIsLoading(false);
  };

  // async functions

  const asyncNewSermon = (sermon: Sermon) => {
    setMySermons((prev) => [sermon, ...prev]);
  };

  const asyncUpdateSermon = (sermon: Sermon) => {
    let sermons = [...mySermons];
    const i = sermons.findIndex((s) => s.id === sermon.id);

    if (i < 0) return;

    sermons[i] = sermon;

    setMySermons([...sermons]);
  };

  const asyncDeleteSermon = (sermonId: number) => {
    setMySermons(prev => prev.filter(s => s.id !== sermonId));
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

  // init my sermons on isWriterParams
  useEffect(() => {
    if (!isWriterParams) return;
    initMySermons();
  }, [isWriterParams]);

  // handle functions

  const handleDeleteSermon = async () => {
    if (!mySermon) return;

    try {
      const deletedSermonId = await sermonsService.deleteSermon(mySermon.id);
      asyncDeleteSermon(deletedSermonId);

      enqueueSnackbar("Sermon deleted.", {variant: "success"});

      setOpenDeleteSermonForm(false);
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, {variant: "error"});
      }
    }
  };

  const handleOpenSermonForm = () => {
    setOpenNewSermonForm(true);
    handleAnchorElClose();
  };

  const handleCloseSermonForm = () => {
    setOpenNewSermonForm(false);
    setMySermon(undefined);
  };

  const handleOpenDeleteSermonForm = () => {
    setOpenDeleteSermonForm(true);
    handleAnchorElClose();
  };

  const handleMySermonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    sermon: Sermon,
  ) => {
    event.stopPropagation();
    setMySermon(sermon);
    handleAnchorElClick(event);
  };

  const handleAnchorElClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAnchorElClose = () => {
    setAnchorEl(null);
  };

  const handleBack = () => {
    setSermon(undefined);
    navigate("./..");
  };

  const handleBackHome = () => {
    setSermon(undefined);
    navigate("/gospel");
  };

  // components

  const NavButton = (isSermon: boolean = false) => {
    return isMobile ? (
      <TTIconButton onClick={() => setIsHidden(false)} noBorder>
        <MenuIcon />
      </TTIconButton>
    ) : (
      <Typography
        className="back-text"
        onClick={isSermon ? handleBack : handleBackHome}
      >
        {isSermon ? `<< Back to Topic` : `<< Back to Home`}
      </Typography>
    );
  };

  const WriterView = () => {
    return (
      <Box className={clsx("gospel-content-container", isMobile && "mobile")}>
        <Box className="header-box">
          {/* nav button - only in mobile view */}
          {NavButton()}
          <Typography
            className={clsx("category", isMobile && "mobile")}
            variant="h3"
          >
            My Sermons
          </Typography>

          <Box className="tool-box">
            {/* label setting */}
            <TTButton
              label="New Labels"
              startIcon={<AddIcon />}
              color="info"
              onClick={() => setOpenAddSermonLabelForm(true)}
            />
            {/* add sermon */}
            <TTButton
              label="New Sermon"
              startIcon={<AddIcon />}
              color="utility"
              onClick={() => setOpenNewSermonForm(true)}
            />
          </Box>
        </Box>

        <Divider />

        {/* content */}
        <Box>
          {mySermons.map((sermon) => (
            <MenuItem
              key={sermon.id}
              className="my-sermon-menu-item"
              disableRipple
            >
              <Box className="row full">
                <Box className="column">
                  <Box className="row full">
                    <Typography variant="h6">{sermon.title}</Typography>
                    <Typography variant="caption">
                      {sermon.publishAt}
                    </Typography>
                  </Box>
                  {/* label - category & topic */}
                  {sermon.label ? (
                    <Box className="row wrap">
                      <Chip
                        label={sermon.label.category?.name}
                        size="small"
                        color="info"
                      />
                      <Chip
                        label={sermon.label.topic?.name}
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
                  <IconButton onClick={(e) => handleMySermonClick(e, sermon)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Box>
      </Box>
    );
  };

  const SermonView = () => {
    return (
      <Box className={clsx("gospel-content-container", isMobile && "mobile")}>
        <Box className="header-box">
          {/* nav button - only in mobile view */}
          {NavButton(true)}
          {sermon?.label ? (
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
        <MarkdownBox text={sermon?.content} isOfficial />
      </Box>
    );
  };

  const TopicView = () => {
    return (
      <Box className={clsx("gospel-content-container", isMobile && "mobile")}>
        {/* header */}
        <Box className="header-box">
          {/* nav button - only in mobile view */}
          {NavButton()}

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

  const Main = () => {
    if (labelSlug && orderId) return SermonView();
    if (labelSlug && !orderId) return TopicView();
    if (isWriterParams) return WriterView();
    else return <Box>feed</Box>;
  };

  return (
    <React.Fragment>
      {Main()}

      {/* forms */}

      <AddSermonLabelForm
        open={openAddSermonLabelForm}
        onClose={() => setOpenAddSermonLabelForm(false)}
      />
      <SermonForm
        sermonId={mySermon?.id}
        open={openNewSermonForm}
        onClose={handleCloseSermonForm}
        onAction={mySermon ? asyncUpdateSermon : asyncNewSermon}
      />
      <DeleteSermonForm
        open={openDeleteSermonForm}
        onClose={() => setOpenDeleteSermonForm(false)}
        onAction={handleDeleteSermon}
      />

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
        <MenuItem onClick={handleOpenSermonForm}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem className="error" onClick={handleOpenDeleteSermonForm}>
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
