import TTIconButton from "@components/TTIconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Checkbox,
  Chip,
  Divider,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { taosService, TransportModes, type Tao } from "@services/taos";
import MapUtils from "@utils/MapUtils";
import TimeUtils from "@utils/TimeUtils";
import React, { useEffect, useState } from "react";
import { SiGooglemaps } from "react-icons/si";
import HighlightItem from "@components/Item/HighlightItem";
import { highlightsService, type Highlight } from "@services/highlights";
import HighlightForm from "@components/Forms/HighlightForm";
import DiscoverHighlightsForm from "@components/Forms/DiscoverHighlightsForm";
import DirectionAccordion from "@components/Accordions/DirectionAccordion";
import type { WikiImage } from "@services/wikiCommons/wikiCommons";
import { enqueueSnackbar } from "notistack";
import TTButton from "@components/TTButton";
import {
  hereMapService,
  type HereRoutingResponse,
} from "@services/hereMap/hereMap";
import NavButton from "@components/Button/NavButton";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import "./index.scss";

type TaoComponentProps = {
  taos: Tao[] | undefined;
  tao: Tao | undefined;
  wikiImages: WikiImage[];
  routeResponsesMapRef: React.RefObject<Map<number, HereRoutingResponse[]>>;
  routeResponses: HereRoutingResponse[] | undefined;
  setRouteResponses: (state: HereRoutingResponse[]) => void;
  asyncEditDayTaos: (state: Tao) => void;
  onClose: () => void;
  readonly?: boolean;
};

const TaoComponent = ({
  taos,
  tao,
  wikiImages,
  routeResponsesMapRef,
  routeResponses,
  setRouteResponses,
  asyncEditDayTaos,
  onClose,
  readonly = false,
}: TaoComponentProps) => {
  // tao
  const [_tao, _setTao] = useState<Tao | undefined>();
  const attraction = _tao?.attraction;
  // privacy status
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  // highlight
  const [highlight, setHighlight] = useState<Highlight | undefined>();
  const [description, setDescription] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  // transport mode
  const [transportMode, setTransportMode] = useState<string>(
    tao?.transportMode ?? TransportModes[0]
  );
  // open form states
  const [openDiscoverHighlights, setOpenDiscoverHighlights] =
    useState<boolean>(false);

  const taoIndex = taos?.findIndex((t) => t.id === tao?.id);
  const routeResponse = taoIndex ? routeResponses?.at(taoIndex - 1) : undefined;
  const formatedSections =
    routeResponse && routeResponse.routes?.at(0)
      ? MapUtils.mergeRoutingSections(routeResponse.routes[0])
      : undefined;

  // rerender _tao on tao when is defined
  useEffect(() => {
    if (tao) {
      _setTao(tao);
      setIsPrivate(tao.isPrivate);
      setHighlight(tao.highlight);
      setIsCreating(false);
      setTransportMode(tao.transportMode ?? TransportModes[0]);
    }
  }, [tao?.id, tao?.attraction.id, tao?.highlight?.id, tao?.start, tao?.end]);

  const handlePrivacyStatusClick = async () => {
    if (tao) {
      try {
        let newStatus = await taosService.patchTaoPrivacy(tao.id, !isPrivate);

        tao.isPrivate = newStatus;
        asyncEditDayTaos(tao);
        setIsPrivate((prev) => !prev);

        enqueueSnackbar("Event privacy status updated.", {
          variant: "success",
        });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  };

  const handlePostHighlight = async () => {
    if (isCreating && tao && description) {
      try {
        let highlightPost = {
          attractionId: tao.attraction.id,
          description: description,
        };

        let newHighlight = await highlightsService.postHighlight(highlightPost);

        let taoPatch = {
          ...tao,
          highlightId: newHighlight.id,
        };

        let updatedTao = await taosService.patchTao(tao.id, taoPatch);
        asyncEditDayTaos(updatedTao);
        setDescription("");

        enqueueSnackbar("Successfully created highlight for this event.", {
          variant: "success",
        });
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  };

  const handleUpdateHighlight = async (highlight: Highlight | undefined) => {
    if (tao) {
      try {
        let updatedTao = { ...tao, highlight: highlight };
        asyncEditDayTaos(updatedTao);
        console.log(highlight);
        setHighlight(highlight);
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  };

  const handleDetachHighlight = async () => {
    if (tao) {
      try {
        let updatedTao = await taosService.patchTaoDetachHighlight(tao.id);
        asyncEditDayTaos(updatedTao);

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

  const handleTransportModeChange = async (event: SelectChangeEvent) => {
    let newTransportMode = event.target.value;

    if (!TransportModes.includes(newTransportMode)) {
      enqueueSnackbar("Transport mode unrecognized.", { variant: "error" });
      return;
    }

    if (tao) {
      try {
        await taosService.patchTao(tao.id, { transportMode: newTransportMode });

        enqueueSnackbar(`Transport mode updated to ${newTransportMode}.`, {
          variant: "success",
        });

        setTransportMode(newTransportMode);

        let updatedTao = { ...tao, transportMode: newTransportMode };
        asyncEditDayTaos(updatedTao);

        let updatedRouteResponse = await hereMapService.getRoutingByTaoId(
          tao.id
        );
        if (!updatedRouteResponse) {
          updatedRouteResponse = { routes: [] };
        }

        let routeResponses = routeResponsesMapRef.current.get(tao.dayId);
        if (routeResponses && taoIndex) {
          routeResponses[taoIndex - 1] = updatedRouteResponse;

          routeResponsesMapRef.current.set(tao.dayId, routeResponses);
          setRouteResponses(routeResponses);
        }
      } catch (e) {
        if (e instanceof Error) {
          enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    }
  };

  const handleClose = () => {
    onClose();
    setDescription("");
    setHighlight(undefined);
  };

  return (
    <Box className="trip-profile-tao-comp-box">
      {/* header */}
      <Box className="header-box">
        {/* start - end time */}
        <Typography>
          {TimeUtils.formatTimeHHmmssTohmmA(tao?.start ?? "")} -{" "}
          {TimeUtils.formatTimeHHmmssTohmmA(tao?.end ?? "")}
        </Typography>
        <TTIconButton className="close-button" onClick={handleClose}>
          <CloseIcon />
        </TTIconButton>
      </Box>

      <Divider variant="middle" flexItem />

      {/* tao content */}
      <Box className="content-box">
        <Box className="section">
          {/* title & address */}
          <Typography className="title">
            Visit <span className="title-span">{attraction?.title}</span>
          </Typography>
          <Typography>{attraction?.address}</Typography>

          {/* attraction category */}
          {attraction?.category ? (
            <Box>
              <Chip
                className="event-category"
                size="small"
                label={
                  <Typography variant="caption">
                    {attraction.category}
                  </Typography>
                }
              />
            </Box>
          ) : undefined}

          {/* privacy status */}
          <Box className="privacy-setting">
            {!readonly ? (
              <React.Fragment>
                <Checkbox
                  color="default"
                  checked={isPrivate}
                  icon={<LockOpenIcon />}
                  checkedIcon={<LockIcon />}
                  onClick={handlePrivacyStatusClick}
                />
                {tao?.isPrivate ? (
                  <Typography>Only visible to you and shared users</Typography>
                ) : (
                  <Typography>Visible to Everyone</Typography>
                )}
              </React.Fragment>
            ) : tao?.isPrivate ? (
              <React.Fragment>
                <LockIcon />
                <Typography variant="caption">
                  Only visible to you and shared users
                </Typography>
              </React.Fragment>
            ) : undefined}
          </Box>
        </Box>

        {/* wiki images */}
        {wikiImages.length > 0 ? (
          <React.Fragment>
            <Box className="wiki-image-box">
              {wikiImages.map((image) => {
                let titleRegex = /(?<=:).*(?=\.)/gm;
                let imageTitle = image.title.match(titleRegex)?.join() ?? "";
                return (
                  <img
                    key={image.title}
                    className="wiki-image"
                    src={image.url}
                    alt={imageTitle}
                    loading="lazy"
                  />
                );
              })}
            </Box>
          </React.Fragment>
        ) : undefined}

        {/* highlight */}
        {highlight?.description ? (
          <React.Fragment>
            <Divider flexItem />
            <Box className="section">
              <Typography className="large-text">Highlight</Typography>

              <Box>
                <HighlightItem
                  highlight={highlight}
                  isLast={true}
                  onUpdate={handleUpdateHighlight}
                  onDelete={undefined}
                  onDetach={handleDetachHighlight}
                  readonly={readonly}
                />
              </Box>
            </Box>
          </React.Fragment>
        ) : !readonly ? (
          <React.Fragment>
            <Divider flexItem />
            <Box className="section">
              <Typography className="large-text">Highlight</Typography>

              <Box>
                {!isCreating ? (
                  <Box>
                    <Box className="highlight-helper-box">
                      <Typography className="highlight-helper-text">
                        Discover amazing highlights {"\n"} — or make your own!
                      </Typography>
                    </Box>

                    <Box className="highlight-button-box">
                      <TTButton
                        className="highlight-button"
                        color="info"
                        onClick={() => setOpenDiscoverHighlights(true)}
                      >
                        discover
                      </TTButton>
                      <TTButton
                        className="highlight-button"
                        onClick={() => setIsCreating(true)}
                      >
                        create & share
                      </TTButton>
                    </Box>
                  </Box>
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
            </Box>
          </React.Fragment>
        ) : undefined}

        {/* ways of transport */}
        {routeResponse ? (
          <React.Fragment>
            <Divider flexItem />
            <Box className="section">
              <Typography className="large-text">Directions</Typography>

              {/* notice - optional */}
              {routeResponse.notices ? (
                routeResponse.notices.length > 0 ? (
                  <Alert severity="warning">
                    {routeResponse.notices[0].title}
                  </Alert>
                ) : undefined
              ) : undefined}

              <Box>
                {!readonly ? (
                  <Select
                    color="info"
                    size="small"
                    value={transportMode}
                    onChange={handleTransportModeChange}
                  >
                    {TransportModes.map((mode: string) => (
                      <MenuItem
                        className="selected-transport-mode"
                        value={mode}
                      >
                        {mode}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Typography className="transport-mode">
                    {transportMode}
                  </Typography>
                )}
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Routing information © HERE
                  </Typography>
                  {/* direction - time, distance, actions, agency, etc. */}
                  {(formatedSections ?? []).map((section) => (
                    <DirectionAccordion
                      key={section.id}
                      section={section}
                      taoId={tao?.id}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </React.Fragment>
        ) : undefined}

        {/* links to other resources */}
        <Divider flexItem />
        <Box className="resource-section">
          <Typography className="large-text">Other Resources</Typography>

          <Box className="link-box">
            {/* links */}
            <Box>
              <NavButton
                className="success"
                link={MapUtils.getGoogleMapLink(attraction?.address ?? "")}
                icon={<SiGooglemaps size={24} />}
                label="Google Map"
                hovered
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <DiscoverHighlightsForm
        tao={tao}
        open={openDiscoverHighlights}
        onClose={() => setOpenDiscoverHighlights(false)}
        asyncEditDayTaos={asyncEditDayTaos}
      />
    </Box>
  );
};

export default TaoComponent;
