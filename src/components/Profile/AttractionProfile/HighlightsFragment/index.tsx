import TTIconButton from "@components/TTIconButton";
import {
  Box,
  Divider,
  Fab,
  FormControl,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useRef, useState } from "react";
import HighlightForm from "@components/Forms/HighlightForm";
import HighlightItem from "@components/Item/HighlightItem";
import {
  getDefaultHighlight,
  type HighlightSearchParams,
  type Highlight,
  highlightsService,
} from "@services/highlights";
import TTButton from "@components/TTButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import { enqueueSnackbar } from "notistack";
import DeleteHighlightForm from "@components/Forms/DeleteHighlightForm";
import type { SearchResults } from "@services/http";
import { throttle } from "lodash";
import ToolTip from "@components/ToolTip";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import {
  HighlightOrderByEnumLabels,
  type HighlightOrderByEnum,
  type NavTab,
} from "@constants/Types";
import SortIcon from "@mui/icons-material/Sort";
import { useIsMobile } from "@hooks/useIsMobile";
import TTTabs from "@components/TTTabs";
import clsx from "clsx";
import "./index.scss";

type HighlightsFragmentProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  parentAttractionId: number | undefined;
  allowChangeHighlight?: boolean;
  selectHighlightId?: number;
  setSelectHighlightId?: (state: number | undefined) => void;
  hideHeader?: boolean;
};

const HighlightsFragment = ({
  containerRef,
  parentAttractionId,
  allowChangeHighlight = true,
  selectHighlightId,
  setSelectHighlightId,
  hideHeader = false,
}: HighlightsFragmentProps) => {
  // window
  const isMobile = useIsMobile();
  // search params
  const highlightParamsRef = useRef<HighlightSearchParams>({});
  const [highlightParams, setHighlightParams] = useState<HighlightSearchParams>(
    {}
  );
  // param details
  const { attractionId, createdByAuthId, highlightOrderByEnum } =
    highlightParams;
  // highlights
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  // post
  const [openPost, setOpenPost] = useState<boolean>(false);
  // behavior
  const isLoadingRef = useRef<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [showNavTop, setShowNavTop] = useState<boolean>(false);
  // nav tabs
  const [navTabValue, setNavTabValue] = useState<number>(0);
  // sort
  const [orderBy, setOrderBy] = useState<HighlightOrderByEnum>("newest");
  // delete
  const [deleteHighlightId, setDeleteHighlightId] = useState<
    number | undefined
  >();
  const openDelete = Boolean(deleteHighlightId);
  // others
  const user = useSelector((state: RootState) => state.user);
  const isUser = !user.isLoading && Boolean(user.userId);

  // init searchTripParams and other states on searchParams
  useEffect(() => {
    if (!isInit) return;

    const newParams = {
      attractionId: parentAttractionId,
      createdByAuthId: undefined,
      cursor: undefined,
      highlightOrderByEnum: undefined,
    } as HighlightSearchParams;

    highlightParamsRef.current = newParams;
    setHighlightParams(newParams);
  }, []);

  // refetch highlights when search params changed
  useEffect(() => {
    if (!attractionId) return;

    const initHighlights = async () => {
      highlightParamsRef.current = { ...highlightParams, cursor: undefined };
      await getHighlightsByParams(true);
      setIsInit(false);
    };
    initHighlights();
  }, [attractionId, createdByAuthId, highlightOrderByEnum]);

  // rerender nav top button on container ref scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // rerender highlights on nav tab value
  useEffect(() => {
    const myAuthId = user.userId;

    if (navTabValue === 0)
      updateHighlightParams({ createdByAuthId: undefined });

    if (navTabValue === 1 && myAuthId !== null)
      updateHighlightParams({ createdByAuthId: myAuthId });
  }, [navTabValue]);

  // highlight params

  const updateHighlightParams = (updates: Partial<HighlightSearchParams>) => {
    setHighlightParams((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // async functions

  const asyncHighlights = (
    tripResults: SearchResults<Highlight>,
    isNewSearch: boolean = false
  ) => {
    const params = highlightParamsRef.current;

    if (!params.cursor || isNewSearch) setHighlights([...tripResults.results]);
    else setHighlights((prev) => [...prev, ...tripResults.results]);
  };

  // get highlights

  const getHighlightsByParams = async (isNewSearch: boolean = false) => {
    const params = highlightParamsRef.current;
    try {
      const highlightResult = await highlightsService.getHighlightsByParams(
        params
      );

      asyncHighlights(highlightResult, isNewSearch);

      // update cursor in the ref and state
      const newParams = { ...params, cursor: highlightResult.cursor };
      highlightParamsRef.current = newParams;
      setHighlightParams(newParams);
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  /// highlight updates

  const addHighlight = (highlight?: Highlight) => {
    if (highlight) {
      setHighlights((prev) => [...prev, highlight]);
    }
  };

  const updateHighlight = (highlight?: Highlight) => {
    if (highlight) {
      setHighlights((prev) =>
        prev.map((h) => (h.id === highlight.id ? highlight : h))
      );
    }
  };

  const deleteHighlight = (highlight: Highlight) => {
    if (highlight) {
      setHighlights((prev) => prev.filter((h) => h.id !== highlight.id));
    }
  };

  /// handle events

  // trigger when scroll close to the bottom
  const handleScroll = throttle(() => {
    // check whether condition met to show/hide button nav to top
    const isDown = (containerRef.current?.scrollTop ?? 0) >= 100;
    setShowNavTop((prev) => (prev !== isDown ? isDown : prev));

    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // detect near-bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMore();
    }
  }, 100);

  const loadMore = async () => {
    if (isLoadingRef.current) return;

    const params = highlightParamsRef.current;
    if (!params.cursor) return;

    isLoadingRef.current = true;

    try {
      await getHighlightsByParams();
    } finally {
      isLoadingRef.current = false;
    }
  };

  const handleClickSelectHighlight = (id: number) => {
    if (setSelectHighlightId) {
      if (selectHighlightId !== id) {
        setSelectHighlightId(id);
      } else {
        setSelectHighlightId(undefined);
      }
    }
  };

  const handleNavTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // handle form
  const handleDeleteClose = () => {
    setDeleteHighlightId(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (deleteHighlightId) {
      const deletedHighlight = await highlightsService.deleteHighlight(
        deleteHighlightId
      );

      await BehaviorUtils.sleep();
      deleteHighlight(deletedHighlight);

      enqueueSnackbar("Successfully deleted highlight.", {
        variant: "success",
      });
    }
    setDeleteHighlightId(undefined);
  };

  const handleOrderByChange = (event: SelectChangeEvent) => {
    const newOrderBy = event.target.value as HighlightOrderByEnum;

    updateHighlightParams({ highlightOrderByEnum: newOrderBy });
    setOrderBy(newOrderBy);
  };

  // nav tabs
  const navTabs = [
    {
      name: "all",
      label: "All",
    },
    {
      name: "my",
      label: "My",
      condition: isUser,
    },
  ] as NavTab[];

  // components

  const OrderBySelect = (
    <FormControl
      className={clsx("order-by-form-control", isMobile && "mobile")}
    >
      <SortIcon />
      <Select
        id="select-country-input"
        value={orderBy}
        onChange={handleOrderByChange}
        size="small"
      >
        {Object.entries(HighlightOrderByEnumLabels).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );  

  let getHighlightItem = (
    highlight: Highlight,
    i: number,
    noDivider: boolean = false
  ) => (
    <HighlightItem
      key={highlight.id}
      highlight={highlight}
      showMenu={allowChangeHighlight}
      isLast={noDivider || i + 1 === highlights.length}
      onUpdate={updateHighlight}
      onDelete={setDeleteHighlightId}
      showRef
    />
  );

  return (
    <React.Fragment>
      <Box className="highlight-profile-highlights-fragment-box">
        {/* header bar */}
        {!hideHeader ? (
          <Box className="header-bar">
            <Typography variant="h6">Highlights</Typography>
            {/* add icon */}
            {allowChangeHighlight ? (
              <TTIconButton
                onClick={() => setOpenPost(true)}
                className="header-add-button"
              >
                <ToolTip title="Write a new highlight">
                  <AddIcon />
                </ToolTip>
              </TTIconButton>
            ) : undefined}
          </Box>
        ) : undefined}

        {/* tabs */}
        <Box className={clsx("tool-box", isMobile && "mobile")}>
          <TTTabs
            navTabs={navTabs}
            navTabValue={navTabValue}
            setNavTabValue={setNavTabValue}
            variant="switch"
          />
          {OrderBySelect}
        </Box>

        {/* new highlight form - highlight item in edit */}
        {openPost && attractionId && (
          <React.Fragment>
            <HighlightForm
              highlight={{ ...getDefaultHighlight(attractionId) }}
              onAction={addHighlight}
              onClose={() => setOpenPost(false)}
              isPost
            />
            {highlights.length > 0 && <Divider flexItem />}
          </React.Fragment>
        )}

        {highlights.length > 0 ? (
          highlights.map((highlight, i) =>
            setSelectHighlightId ? (
              <TTButton
                key={`highlight-button-${highlight.id}`}
                className={clsx(
                  "highlight-select-button",
                  selectHighlightId === highlight.id && "focus"
                )}
                color="info"
                variant="text"
                onClick={() => handleClickSelectHighlight(highlight.id)}
              >
                {getHighlightItem(highlight, i, true)}
              </TTButton>
            ) : (
              getHighlightItem(highlight, i)
            )
          )
        ) : (
          <Typography>No highlights available.</Typography>
        )}
      </Box>

      {/* fabs */}
      {showNavTop ? (
        <Fab className="nav-top-fab" color="utility" onClick={handleNavTop}>
          <ArrowUpwardIcon />
        </Fab>
      ) : undefined}

      {/* form */}
      <DeleteHighlightForm
        open={openDelete}
        onClose={handleDeleteClose}
        onAction={handleDeleteConfirm}
      />
    </React.Fragment>
  );
};

export default HighlightsFragment;
