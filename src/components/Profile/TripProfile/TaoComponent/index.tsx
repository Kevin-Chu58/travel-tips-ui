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
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import ReplyIcon from "@mui/icons-material/Reply";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import { useNavigate, useParams } from "react-router";
import TaoForm from "@components/Forms/TaoForm";
import EditIcon from "@mui/icons-material/Edit";
import type { GeoCoordinate } from "@constants/Types";
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
  const [_tao, _setTao] = useState<Tao | undefined>();
  const attraction = _tao?.attraction;
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [highlight, setHighlight] = useState<Highlight | undefined>();
  const [description, setDescription] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [transportMode, setTransportMode] = useState<string>(
    tao?.transportMode ?? TransportModes[0],
  );
  const [openDiscoverHighlights, setOpenDiscoverHighlights] =
    useState<boolean>(false);
  // open form status
  const [openEditTaoForm, setOpenEditTaoForm] = useState<boolean>(false);
  // others
  const { dayId } = useParams(); // dayId - day index in days, not day.id
  const navigate = useNavigate();

  const lastGeoCoordinate = useMemo(
    () =>
      ({
        lat: tao?.attraction.lat,
        lng: tao?.attraction.lng,
      }) as GeoCoordinate,
    [tao],
  );

  const taoIndex = useMemo(
    () => taos?.findIndex((t) => t.id === tao?.id),
    [taos, tao?.id],
  );

  const prevTao = useMemo(
    () => (taos && taoIndex! > 0 ? taos[taoIndex! - 1] : undefined),
    [taos, taoIndex],
  );

  const routeResponse = useMemo(
    () => (taoIndex ? routeResponses?.at(taoIndex - 1) : undefined),
    [routeResponses, taoIndex],
  );

  const formatedSections = useMemo(
    () =>
      routeResponse && routeResponse.routes?.at(0)
        ? MapUtils.mergeRoutingSections(routeResponse.routes[0])
        : undefined,
    [routeResponse],
  );

  const googleRouteLink = useMemo(
    () =>
      prevTao && tao
        ? MapUtils.getGoogleRouteLink(
            prevTao.attraction.address,
            tao.attraction.address,
          )
        : undefined,
    [prevTao, tao],
  );

  const googleMapLink = useMemo(
    () => MapUtils.getGoogleMapLink(attraction?.address ?? ""),
    [attraction?.address],
  );

  useEffect(() => {
    if (tao) {
      _setTao(tao);
      setIsPrivate(tao.isPrivate);
      setHighlight(tao.highlight);
      setIsCreating(false);
      setTransportMode(tao.transportMode ?? TransportModes[0]);
    }
  }, [tao?.id, tao?.attraction.id, tao?.highlight?.id, tao?.start, tao?.end]);

  // handle functions

  const handlePrivacyStatusClick = useCallback(async () => {
    if (tao) {
      try {
        let newStatus = await taosService.patchTaoPrivacy(tao.id, !isPrivate);
        tao.isPrivate = newStatus;
        asyncEditDayTaos(tao);
        setIsPrivate((prev) => !prev);
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  }, [tao, isPrivate, asyncEditDayTaos]);

  const handlePostHighlight = useCallback(async () => {
    if (isCreating && tao && description) {
      try {
        let highlightPost = {
          attractionId: tao.attraction.id,
          description: description,
        };
        let newHighlight = await highlightsService.postHighlight(highlightPost);
        let taoPatch = { ...tao, highlightId: newHighlight.id };
        let updatedTao = await taosService.patchTao(tao.id, taoPatch);
        asyncEditDayTaos(updatedTao);
        setDescription("");
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  }, [isCreating, tao, description, asyncEditDayTaos]);

  const handleUpdateHighlight = useCallback(
    async (highlight: Highlight | undefined) => {
      if (tao) {
        try {
          let updatedTao = { ...tao, highlight: highlight };
          asyncEditDayTaos(updatedTao);
          setHighlight(highlight);
        } catch (e) {
          if (e instanceof Error)
            enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    },
    [tao, asyncEditDayTaos],
  );

  const handleDetachHighlight = useCallback(async () => {
    if (tao) {
      try {
        let updatedTao = await taosService.patchTaoDetachHighlight(tao.id);
        asyncEditDayTaos(updatedTao);
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  }, [tao, asyncEditDayTaos]);

  const handleTransportModeChange = useCallback(
    async (event: SelectChangeEvent) => {
      let newTransportMode = event.target.value;

      if (!TransportModes.includes(newTransportMode)) {
        enqueueSnackbar("Transport mode unrecognized.", { variant: "error" });
        return;
      }

      if (tao) {
        try {
          await taosService.patchTao(tao.id, {
            transportMode: newTransportMode,
          });
          setTransportMode(newTransportMode);

          let updatedTao = { ...tao, transportMode: newTransportMode };
          asyncEditDayTaos(updatedTao);

          let updatedRouteResponse = await hereMapService.getRoutingByTaoId(
            tao.id,
          );
          if (!updatedRouteResponse) updatedRouteResponse = { routes: [] };

          let routeResponses = routeResponsesMapRef.current.get(tao.dayId);
          if (routeResponses && taoIndex) {
            const newRouteResponses = [...routeResponses];
            newRouteResponses[taoIndex - 1] = updatedRouteResponse;
            routeResponsesMapRef.current.set(tao.dayId, newRouteResponses);
            setRouteResponses(newRouteResponses);
          }
        } catch (e) {
          if (e instanceof Error)
            enqueueSnackbar(e.message, { variant: "error" });
        }
      }
    },
    [tao, taoIndex, asyncEditDayTaos, setRouteResponses],
  );

  const handleClose = useCallback(() => {
    onClose();
    setDescription("");
    setHighlight(undefined);
  }, [onClose]);

  const handleAttractionClick = useCallback(
    () => navigate(`/attraction/${attraction?.id}`),
    [navigate, attraction?.id],
  );

  const handleOpenDiscoverHighlights = useCallback(
    () => setOpenDiscoverHighlights(true),
    [],
  );

  const handleCloseDiscoverHighlights = useCallback(
    () => setOpenDiscoverHighlights(false),
    [],
  );

  const handleStartCreating = useCallback(() => setIsCreating(true), []);
  const handleStopCreating = useCallback(() => setIsCreating(false), []);

  const handleOpenTaoForm = useCallback(() => {
    setOpenEditTaoForm(true);
  }, [setOpenEditTaoForm]);

  const handleCloseForm = useCallback(() => {
    setOpenEditTaoForm(false);
  }, [setOpenEditTaoForm]);

  // components

  const transportModeItems = useMemo(
    () =>
      TransportModes.map((mode: string) => (
        <MenuItem key={mode} className="selected-transport-mode" value={mode}>
          {mode}
        </MenuItem>
      )),
    [],
  );

  const wikiImageItems = useMemo(
    () =>
      wikiImages.map((image) => {
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
      }),
    [wikiImages],
  );

  return (
    <Box className="trip-profile-tao-comp-box">
      {/* header */}
      <Box className="row gap-large header-box">
        <Typography>
          {TimeUtils.formatTimeHHmmssTohmmA(tao?.start ?? "")} -{" "}
          {TimeUtils.formatTimeHHmmssTohmmA(tao?.end ?? "")}
        </Typography>
        {!readonly && (
          <TTButton
            color="secondary"
            onClick={handleOpenTaoForm}
            startIcon={<EditIcon />}
            circular
          >
            Update
          </TTButton>
        )}
        <TTIconButton className="close-button" onClick={handleClose}>
          <CloseIcon />
        </TTIconButton>
      </Box>

      <Divider variant="middle" flexItem />

      <Box className="content-box">
        <Box className="section">
          <Typography className="title">
            Visit{" "}
            <span className="title-span" onClick={handleAttractionClick}>
              {attraction?.title}
            </span>
          </Typography>
          <Typography>{attraction?.address}</Typography>

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

          <Box className="privacy-setting">
            {!readonly ? (
              <Box className="column">
                <Box className="row">
                  <Checkbox
                    color="default"
                    checked={isPrivate}
                    icon={<LockOpenIcon className="lock-icon" />}
                    checkedIcon={<LockIcon className="lock-icon" />}
                    onClick={handlePrivacyStatusClick}
                  />
                  {tao?.isPrivate ? (
                    <Typography>
                      Only visible to you and shared users
                    </Typography>
                  ) : (
                    <Typography>Visible to Everyone</Typography>
                  )}
                </Box>
                <Box className="row primary">
                  <LocalActivityIcon fontSize="small" /> Member Only
                </Box>
              </Box>
            ) : tao?.isPrivate ? (
              <React.Fragment>
                <LockIcon />
                <Typography color="textSecondary">
                  Only visible to you and shared users
                </Typography>
              </React.Fragment>
            ) : undefined}
          </Box>
        </Box>

        {wikiImages.length > 0 ? (
          <React.Fragment>
            <Box className="wiki-image-box">{wikiImageItems}</Box>
          </React.Fragment>
        ) : undefined}

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
                        onClick={handleOpenDiscoverHighlights}
                      >
                        discover
                      </TTButton>
                      <TTButton
                        className="highlight-button"
                        onClick={handleStartCreating}
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
                      onClose={handleStopCreating}
                      isPost
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </React.Fragment>
        ) : undefined}

        {routeResponse ? (
          <React.Fragment>
            <Divider flexItem />
            <Box className="section">
              <Box className="row full">
                <Typography className="large-text">Directions</Typography>
                {prevTao && tao ? (
                  <NavButton className="jump-to-button" link={googleRouteLink}>
                    <ReplyIcon className="jump-to-icon" />
                  </NavButton>
                ) : undefined}
              </Box>

              {routeResponse?.notices?.length &&
              routeResponse.notices.length > 0 ? (
                <Alert severity="warning">
                  {routeResponse.notices[0].title}
                </Alert>
              ) : undefined}

              <Box>
                {!readonly ? (
                  <Select
                    color="info"
                    size="small"
                    value={transportMode}
                    onChange={handleTransportModeChange}
                  >
                    {transportModeItems}
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

        <Divider flexItem />
        <Box className="resource-section">
          <Typography className="large-text">Other Resources</Typography>
          <Box className="link-box">
            <Box>
              <NavButton
                className="success"
                link={googleMapLink}
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
        onClose={handleCloseDiscoverHighlights}
        asyncEditDayTaos={asyncEditDayTaos}
      />

      {openEditTaoForm && (
        <TaoForm
          open
          onClose={handleCloseForm}
          dayIndex={Number(dayId)}
          dayId={tao?.dayId}
          tao={tao}
          lastGeoCoordinate={lastGeoCoordinate}
          asyncEditDayTaos={asyncEditDayTaos}
        />
      )}
    </Box>
  );
};

export default TaoComponent;
