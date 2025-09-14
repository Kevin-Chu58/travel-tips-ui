import TTIconButton from "@components/TTIconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
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
import TTChipButton from "@components/TTChipButton";
import GoogleIcon from "@mui/icons-material/Google";
import HighlightItem from "@components/Item/HighlightItem";
import { highlightsService, type Highlight } from "@services/highlights";
import HighlightForm from "@components/Forms/HighlightForm";
import DiscoverHighlightsForm from "@components/Forms/DiscoverHighlightsForm";
import DirectionAccordion from "@components/Accordions/DirectionAccordion";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import { enqueueSnackbar } from "notistack";
import TTButton from "@components/TTButton";
import {
  hereMapService,
  type HereRoutingResponse,
} from "@services/hereMap/hereMap";
import "./index.scss";

type TaoComponentProps = {
  taos: Tao[] | undefined;
  tao: Tao | undefined;
  routeResponsesMapRef: React.RefObject<Map<number, HereRoutingResponse[]>>;
  routeResponses: HereRoutingResponse[] | undefined;
  setRouteResponses: (state: HereRoutingResponse[]) => void;
  syncEditDayTaos: (state: Tao) => void;
  onClose: () => void;
  readonly?: boolean;
};

const TaoComponent = ({
  taos,
  tao,
  routeResponsesMapRef,
  routeResponses,
  setRouteResponses,
  syncEditDayTaos,
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
  // others
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const taoIndex = taos?.findIndex((t) => t.id === tao?.id);
  const routeResponse = taoIndex ? routeResponses?.at(taoIndex - 1) : undefined;
  const formatedSections = routeResponse
    ? MapUtils.mergeRoutingSections(routeResponse.routes![0])
    : undefined;

  // rerender _tao on tao when is defined
  useEffect(() => {
    if (tao) {
      _setTao(tao);
      setHighlight(tao.highlight);
      setTransportMode(tao.transportMode ?? TransportModes[0]);
    }
  }, [tao?.id, tao?.attraction.id, tao?.highlight?.id, tao?.start, tao?.end]);

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

        let updatedTao = await taosService.patchTao(tao.id, taoPatch, token);
        syncEditDayTaos(updatedTao);

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
        let updatedTao = {...tao, highlight: highlight};
        syncEditDayTaos(updatedTao);
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
    if (tao && token) {
      try {

        let updatedTao = await taosService.patchTaoDetachHighlight(tao.id, token);
        syncEditDayTaos(updatedTao);

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

    if (tao && token) {
      try {
        await taosService.patchTao(
          tao.id,
          { transportMode: newTransportMode },
          token
        );

        enqueueSnackbar(`Transport mode updated to ${newTransportMode}.`, {
          variant: "success",
        });

        setTransportMode(newTransportMode);

        let updatedTao = {...tao, transportMode: newTransportMode};
        syncEditDayTaos(updatedTao);

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
        <Box>
          {/* title & address */}
          <Typography className="trip-profile-tao-comp-title">
            Visit {attraction?.title}
          </Typography>
          <Typography>{attraction?.address}</Typography>

          {/* attraction category */}
          {attraction?.category ? (
            <Chip
              size="small"
              label={<Typography>{attraction.category}</Typography>}
            />
          ) : undefined}
        </Box>

        {/* highlight */}
        {highlight?.description ? (
          <React.Fragment>
            <Divider flexItem />
            <Box>
              <Typography className="trip-profile-tao-comp-large-text">
                Highlight
              </Typography>
              <HighlightItem
                highlight={highlight}
                isLast={true}
                onUpdate={handleUpdateHighlight}
                onDelete={undefined}
                onDetach={handleDetachHighlight}
                readonly={readonly}
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

        {/* ways of transport */}
        {routeResponse ? (
          <React.Fragment>
            <Divider flexItem />
            <Box>
              <Typography className="trip-profile-tao-comp-large-text">
                Directions
              </Typography>
              {!readonly ? <Select
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
              </Select> : <Typography variant="h6">{transportMode}</Typography>}
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Routing information © HERE
                </Typography>
                {/* direction - time, distance, actions, agency, etc. */}
                {(formatedSections ?? []).map((section) => (
                  <DirectionAccordion key={section.id} section={section} taoId={tao?.id} />
                ))}
              </Box>
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
        syncEditDayTaos={syncEditDayTaos}
      />
    </Box>
  );
};

export default TaoComponent;
