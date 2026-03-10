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
  writingsService,
  type Writing,
  type WritingLabelComplete,
} from "@services/gospel/writings";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import MenuIcon from "@mui/icons-material/Menu";
import TTIconButton from "@components/TTIconButton";
import WritingForm from "@components/Forms/WritingForm";
import AddIcon from "@mui/icons-material/Add";
import TTButton from "@components/TTButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkdownBox from "@components/MarkdownBox";
import DeleteWritingForm from "@components/Forms/DeleteWritingForm";
import AddWritingLabelForm from "@components/Forms/AddWritingLabelForm";
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
  // Writing label
  const [label, setLabel] = useState<WritingLabelComplete | undefined>(
    undefined,
  );
  // Writings
  const [Writings, setWritings] = useState<Writing[]>([]);
  // Writing
  const [Writing, setWriting] = useState<Writing | undefined>(undefined);
  // my Writings
  const [myWritings, setMyWritings] = useState<Writing[]>([]);
  // my Writing - in edit
  const [myWriting, setMyWriting] = useState<Writing | undefined>();
  // form status
  const [openAddWritingLabelForm, setOpenAddWritingLabelForm] =
    useState<boolean>(false);
  const [openNewWritingForm, setOpenNewWritingForm] = useState<boolean>(false);
  const [openDeleteWritingForm, setOpenDeleteWritingForm] =
    useState<boolean>(false);
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
      const Writing = await writingsService.getWritingByLabelOrder(
        labelSlug,
        orderId,
      );
      setWriting(Writing);
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

  // handle functions

  const handleDeleteWriting = async () => {
    if (!myWriting) return;

    try {
      const deletedWritingId = await writingsService.deleteWriting(
        myWriting.id,
      );
      asyncDeleteWriting(deletedWritingId);

      enqueueSnackbar("Writing deleted.", { variant: "success" });

      setOpenDeleteWritingForm(false);
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const handleOpenWritingForm = () => {
    setOpenNewWritingForm(true);
    handleAnchorElClose();
  };

  const handleCloseWritingForm = () => {
    setOpenNewWritingForm(false);
    setMyWriting(undefined);
  };

  const handleOpenDeleteWritingForm = () => {
    setOpenDeleteWritingForm(true);
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

  const NavButton = (isWriting: boolean = false, showInPc: boolean = true) => {
    return isMobile ? (
      <TTIconButton onClick={() => setIsHidden(false)} noBorder>
        <MenuIcon />
      </TTIconButton>
    ) : showInPc ? (
      <Typography
        className="back-text"
        onClick={isWriting ? handleBack : handleBackHome}
      >
        {isWriting ? `<< Back to Topic` : `<< Back to Home`}
      </Typography>
    ) : undefined;
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
            My Writings
          </Typography>

          <Box className="tool-box">
            {/* label setting */}
            <TTButton
              label="New Labels"
              startIcon={<AddIcon />}
              color="info"
              onClick={() => setOpenAddWritingLabelForm(true)}
            />
            {/* add Writing */}
            <TTButton
              label="New Writing"
              startIcon={<AddIcon />}
              color="utility"
              onClick={() => setOpenNewWritingForm(true)}
            />
          </Box>
        </Box>

        <Divider />

        {/* content */}
        <Box>
          {myWritings.map((Writing) => (
            <MenuItem
              key={Writing.id}
              className="my-Writing-menu-item"
              disableRipple
            >
              <Box className="row full">
                <Box className="column">
                  <Box className="row full">
                    <Typography variant="h6">{Writing.title}</Typography>
                    <Typography variant="caption">
                      {Writing.publishAt}
                    </Typography>
                  </Box>
                  {/* label - category & topic */}
                  {Writing.label ? (
                    <Box className="row wrap">
                      <Chip
                        label={Writing.label.category?.name}
                        size="small"
                        color="info"
                      />
                      <Chip
                        label={Writing.label.topic?.name}
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
                  <IconButton onClick={(e) => handleMyWritingClick(e, Writing)}>
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

  const WritingView = () => {
    return (
      <Box className={clsx("gospel-content-container", isMobile && "mobile")}>
        <Box className="header-box">
          {/* nav button - only in mobile view */}
          {NavButton(true)}
          {Writing?.label ? (
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
        <MarkdownBox text={Writing?.content} isOfficial />
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
          {isLoading ? undefined : Writings.length > 0 ? (
            Writings.map((Writing, i) => (
              <MenuItem
                key={Writing.id}
                onClick={() => navigate(`./${i + 1}`)}
                disableRipple
              >
                <Box className="Writing-box">
                  {/* order number */}
                  <Typography variant="h6">{i + 1}.</Typography>
                  {/* details */}
                  <Box>
                    <Typography variant="h5">{Writing.title}</Typography>
                    <Typography>{Writing.publishAt}</Typography>
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
      </Box>
    );
  };

  const FeedView = () => (
    <Box className={clsx("gospel-content-container", isMobile && "mobile")}>
      {/* header */}
      <Box className="header-box">
        {/* nav button - only in mobile view */}
        {NavButton(false, false)}
      </Box>
    </Box>
  );

  const Main = () => {
    if (labelSlug && orderId) return WritingView();
    if (labelSlug && !orderId) return TopicView();
    if (isWriterParams) return WriterView();
    else return FeedView();
  };

  return (
    <React.Fragment>
      {Main()}

      {/* forms */}

      <AddWritingLabelForm
        open={openAddWritingLabelForm}
        onClose={() => setOpenAddWritingLabelForm(false)}
      />
      <WritingForm
        WritingId={myWriting?.id}
        open={openNewWritingForm}
        onClose={handleCloseWritingForm}
        onAction={myWriting ? asyncUpdateWriting : asyncNewWriting}
      />
      <DeleteWritingForm
        open={openDeleteWritingForm}
        onClose={() => setOpenDeleteWritingForm(false)}
        onAction={handleDeleteWriting}
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
