import TTIconButton from "@components/TTIconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Chip, Divider, Typography } from "@mui/material";
import { taosService, type Tao } from "@services/taos";
import MapUtils from "@utils/MapUtils";
import TimeUtils from "@utils/TimeUtils";
import React, { useEffect, useState } from "react";
import TTChipButton from "@components/TTChipButton";
import GoogleIcon from "@mui/icons-material/Google";
import HighlightItem from "@components/Item/HighlightItem";
import { highlightsService, type Highlight } from "@services/highlights";
import HighlightForm from "@components/Forms/HighlightForm";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { enqueueSnackbar } from "notistack";
import TTButton from "@components/TTButton";
import "./index.scss";
import DiscoverHighlightsForm from "@components/Forms/DiscoverHighlightsForm";

type TaoComponentProps = {
  tao: Tao | undefined;
  onClose: () => void;
  readonly?: boolean;
  setIsParentUpdated: () => void;
};

const TaoComponent = ({
  tao,
  onClose,
  readonly = false,
  setIsParentUpdated,
}: TaoComponentProps) => {
  // tao
  const [_tao, _setTao] = useState<Tao | undefined>();
  const attraction = _tao?.attraction;
  // highlight
  const [_highlight, _setHighlight] = useState<Highlight | undefined>();
  const [description, setDescription] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  // open form states
  const [openDiscoverHighlights, setOpenDiscoverHighlights] =
    useState<boolean>(false);
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // rerender _tao on tao when is not undefined
  useEffect(() => {
    if (tao) {
      _setTao(tao);
      _setHighlight(tao.highlight);
    }
  }, [tao]);

  const handlePostHighlight = async () => {
    if (isCreating && tao && description && token) {
      try {
        let highlightPost = {
          attractionId: tao.attraction.id,
          description: description,
        };

        let newHighlight = await highlightsService.postHighlight(
          highlightPost,
          token
        );

        let taoPatch = {
          ...tao,
          highlightId: newHighlight.id,
        };

        await taosService.patchTao(tao.id, taoPatch, token);

        enqueueSnackbar("Successfully created highlight for this event.", {
          variant: "success",
        });
        setIsParentUpdated();
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  };

  const handleDetachHighlight = async () => {
    if (tao && token) {
      try {
        let _tao = {
          highlightId: undefined,
        };

        await taosService.patchTao(tao.id, _tao, token);

        setIsParentUpdated();
        enqueueSnackbar("Successfully detached highlight.", {
          variant: "success",
        });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  };

  return (
    <Box className="trip-profile-tao-comp-box">
      {/* header */}
      <Box className="trip-profile-tao-comp-header-box">
        <Typography className="trip-profile-tao-comp-header">Event</Typography>
        <TTIconButton
          className="trip-profile-tao-comp-close-button"
          onClick={onClose}
        >
          <CloseIcon />
        </TTIconButton>
      </Box>

      <Divider variant="middle" flexItem />

      {/* tao content */}
      <Box className="trip-profile-tao-comp-content-box">
        <Box>
          {/* start - end time */}
          <Typography>
            {TimeUtils.formatTimeHHmmssTohmmA(tao?.start ?? "")} -{" "}
            {TimeUtils.formatTimeHHmmssTohmmA(tao?.end ?? "")}
          </Typography>

          {/* title & address */}
          <Typography>{attraction?.title}</Typography>
          <Typography className="trip-profile-tao-comp-address">
            {attraction?.address}
          </Typography>

          {/* attraction category */}
          {attraction?.category ? (
            <Chip
              size="small"
              label={<Typography>{attraction.category}</Typography>}
            />
          ) : undefined}
        </Box>

        {/* highlight */}
        {_highlight?.description ? (
          <React.Fragment>
            <Divider flexItem />
            <Box>
              <Typography className="trip-profile-tao-comp-large-text">
                Highlight
              </Typography>
              <HighlightItem
                highlight={_highlight}
                isLast={true}
                onDelete={undefined}
                onDetach={handleDetachHighlight}
              />
            </Box>
          </React.Fragment>
        ) : !readonly ? (
          <React.Fragment>
            <Divider flexItem />
            <Box>
              <Typography className="trip-profile-tao-comp-large-text">
                Highlight
              </Typography>

              {!isCreating ? (
                <React.Fragment>
                  <Box className="trip-profile-tao-comp-highlight-helper-box">
                    <Typography className="trip-profile-tao-comp-highlight-helper-text">
                      Discover amazing highlights {"\n"} — or make your own!
                    </Typography>
                  </Box>

                  <Box className="trip-profile-tao-comp-highlight-button-box">
                    <TTButton
                      color="info"
                      onClick={() => setOpenDiscoverHighlights(true)}
                    >
                      discover
                    </TTButton>
                    <TTButton onClick={() => setIsCreating(true)}>
                      create/share
                    </TTButton>
                  </Box>
                </React.Fragment>
              ) : (
                <Box>
                  <HighlightForm
                    description={description}
                    setDescription={setDescription}
                    onAction={handlePostHighlight}
                    onClose={() => setIsCreating(false)}
                    isPost
                  />
                </Box>
              )}
            </Box>
          </React.Fragment>
        ) : undefined}

        {/* links to other resources */}
        <Divider flexItem />
        <Box className="trip-profile-tao-comp-link-box">
          <Typography className="trip-profile-tao-comp-large-text">
            Other Resources
          </Typography>

          {/* links */}
          <Box>
            <a
              href={MapUtils.getGoogleMapLink(attraction?.address ?? "")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TTChipButton icon={<GoogleIcon />} label="Google Map" />
            </a>
          </Box>
        </Box>
      </Box>

      <DiscoverHighlightsForm
        tao={tao}
        open={openDiscoverHighlights}
        onClose={() => setOpenDiscoverHighlights(false)}
        setIsParentUpdated={setIsParentUpdated}
      />
    </Box>
  );
};

export default TaoComponent;
