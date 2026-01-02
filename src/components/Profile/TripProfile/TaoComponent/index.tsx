import TTIconButton from "@components/TTIconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
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
import { SiGooglemaps } from 'react-icons/si';
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
      setHighlight(tao.highlight);
      setIsCreating(false);
      setTransportMode(tao.transportMode ?? TransportModes[0]);
    }
  }, [tao?.id, tao?.attraction.id, tao?.highlight?.id, tao?.start, tao?.end]);

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
      <Box className="trip-profile-tao-comp-header-box">
        {/* start - end time */}
        <Typography>
          {TimeUtils.formatTimeHHmmssTohmmA(tao?.start ?? "")} -{" "}
          {TimeUtils.formatTimeHHmmssTohmmA(tao?.end ?? "")}
        </Typography>
        <TTIconButton
          className="trip-profile-tao-comp-close-button"
          onClick={handleClose}
        >
          <CloseIcon />
        </TTIconButton>
      </Box>

      <Divider variant="middle" flexItem />

      {/* tao content */}
      <Box className="trip-profile-tao-comp-content-box">
        <Box className="trip-profile-tao-comp-section">
          {/* title & address */}
          <Typography className="trip-profile-tao-comp-title">
            Visit{" "}
            <span className="trip-profile-tao-comp-title-span">
              {attraction?.title}
            </span>
          </Typography>
          <Typography>{attraction?.address}</Typography>

          {/* attraction category */}
          {attraction?.category ? (
            <Chip
              className="day-event-event-category"
              size="small"
              label={
                <Typography variant="caption">{attraction.category}</Typography>
              }
            />
          ) : undefined}
        </Box>

        {/* wiki images */}
        {wikiImages.length > 0 ? (
          <React.Fragment>
            <Box className="trip-profile-tao-comp-wiki-image-box">
              {wikiImages.map((image) => {
                let titleRegex = /(?<=:).*(?=\.)/gm;
                let imageTitle = image.title.match(titleRegex)?.join() ?? "";
                return (
                  <img
                    key={image.title}
                    className="trip-profile-tao-comp-wiki-image"
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
            <Box className="trip-profile-tao-comp-section">
              <Typography className="trip-profile-tao-comp-large-text">
                Highlight
              </Typography>

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
            <Box className="trip-profile-tao-comp-section">
              <Typography className="trip-profile-tao-comp-large-text">
                Highlight
              </Typography>

              <Box>
                {!isCreating ? (
                  <Box>
                    <Box className="trip-profile-tao-comp-highlight-helper-box">
                      <Typography className="trip-profile-tao-comp-highlight-helper-text">
                        Discover amazing highlights {"\n"} — or make your own!
                      </Typography>
                    </Box>

                    <Box className="trip-profile-tao-comp-highlight-button-box">
                      <TTButton
                        className="trip-profile-tao-comp-highlight-button"
                        color="info"
                        onClick={() => setOpenDiscoverHighlights(true)}
                      >
                        discover
                      </TTButton>
                      <TTButton
                        className="trip-profile-tao-comp-highlight-button"
                        onClick={() => setIsCreating(true)}
                      >
                        create/share
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
            <Box className="trip-profile-tao-comp-section">
              <Typography className="trip-profile-tao-comp-large-text">
                Directions
              </Typography>

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
                        className="trip-profile-tao-comp-selected-transport-mode"
                        value={mode}
                      >
                        {mode}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Typography className="trip-profile-tao-comp-transport-mode">
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
        <Box className="trip-profile-tao-comp-resource-section">
          <Typography className="trip-profile-tao-comp-large-text">
            Other Resources
          </Typography>

          <Box className="trip-profile-tao-comp-link-box">
            {/* links */}
            <Box>
              <NavButton
                link={MapUtils.getGoogleMapLink(attraction?.address ?? "")}
                icon={<SiGooglemaps size={24} />}
                label="Google Map"
                color="success"
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
