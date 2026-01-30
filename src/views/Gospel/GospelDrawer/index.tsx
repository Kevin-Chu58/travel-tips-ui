import TTIconButton from "@components/TTIconButton";
import type { GospelSearchType } from "@constants/Types";
import {
  Box,
  Chip,
  Collapse,
  Divider,
  FormControl,
  MenuItem,
  OutlinedInput,
  Typography,
  type ChipOwnProps,
} from "@mui/material";
import {
  type SermonLabelSearchResult,
  sermonsService,
  type SermonLabel,
  type Sermon,
} from "@services/gospel/sermons";
import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate, useSearchParams } from "react-router";
import { useParams } from "react-router";
import { useIsMobile } from "@hooks/useIsMobile";
import { highlightText } from "@components/HighlightText";
import DefaultHighlight from "@components/HighlightText/DefaultHighlight";
import CloseIcon from "@mui/icons-material/Close";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import clsx from "clsx";
import "./index.scss";

type GospelDrawerProps = {
  isHidden: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

const GospelDrawer = ({ isHidden, setIsHidden }: GospelDrawerProps) => {
  const searchTypes = [
    {
      label: "Sermon",
      color: "success",
    },
    {
      label: "Topic",
      color: "info",
    },
  ];

  // window
  const isMobile = useIsMobile();
  // url
  const { labelSlug, orderId } = useParams();
  // search params
  const [searchParams] = useSearchParams();
  const isWriterParams = Boolean(searchParams.has("my"));
  // user
  const isWriter = useSelector((state: RootState) => state.user.isWriter);
  // categories
  const [categories, setCategories] = useState<SermonLabel[]>([]);
  // topics
  const topicsMapRef = useRef<Map<number, SermonLabel[]>>(new Map());
  const [topicsMap, setTopicsMap] = useState<Map<number, SermonLabel[]>>(
    new Map(),
  );
  // search
  const valueRef = useRef<string>("");
  const [value, setValue] = useState<string>(""); // search input
  const [searchType, setSearchType] = useState<GospelSearchType>("Sermon");
  // search results
  const [sermonResult, setSermonResult] = useState<Sermon[] | undefined>();
  const [sermonLabelResult, setSermonLabelResult] = useState<
    SermonLabelSearchResult | undefined
  >();
  const [openSearchCategories, setOpenSearchCategories] = useState<string[]>(
    [],
  ); // category.slug[]
  // slug
  const [slug, setSlug] = useState<string | undefined>();
  // behavior
  const [openCategories, setOpenCategories] = useState<string[]>([]); // category.slug[]
  const [isSearch, setIsSearch] = useState<boolean>(false); // whether hide or show search result
  // others
  const _categoryCount = sermonLabelResult?.categories?.length ?? 0;
  const _topicCount = sermonLabelResult?.topics?.length ?? 0;
  const navigate = useNavigate();

  // init functions

  const initCategories = async () => {
    const labelResult = await sermonsService.getSermonLabelsByParams({
      type: "Category",
    });
    setCategories(labelResult.result.categories ?? []);
  };

  const initTopics = async (id: number) => {
    const labelResult = await sermonsService.getSermonLabelsByParams({
      type: "Topic",
      parentLabelId: id,
    });

    topicsMapRef.current.set(id, labelResult.result.topics ?? []);
    setTopicsMap(topicsMapRef.current);
  };

  // use effect

  useEffect(() => {
    initCategories();
  }, []);

  // init focused label slug on label slug and orderId in url
  useEffect(() => {
    if (!labelSlug && !orderId) {
      setSlug(undefined);
    } else setSlug(labelSlug);
  }, [labelSlug, orderId]);

  // init search when search type is changed
  useEffect(() => {
    handleSearch();
  }, [searchType]);

  // handle functions

  const handleSearch = async () => {
    if (!value) return;

    if (searchType === "Topic") {
      const searchResult = await sermonsService.getSermonLabelsByParams({
        name: value,
      });
      setSermonLabelResult(searchResult.result);
    }

    if (searchType === "Sermon") {
      const sermonResult = await sermonsService.getSermonsByParams({
        title: value,
      });
      setSermonResult(sermonResult);
    }

    setIsSearch(true);
    valueRef.current = value;
  };

  // trigger when press enter when focus on search input
  const handleKeyDownSearch = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  };

  const handleCloseSearch = () => {
    setSermonResult(undefined);
    setSermonLabelResult(undefined);
    setOpenSearchCategories([]);
    valueRef.current = "";

    setIsSearch(false);
  };

  const handleCategoryClick = async (
    category: SermonLabel,
    isSearch: boolean = false,
  ) => {
    const isOpened = isSearch
      ? openSearchCategories.includes(category.slug)
      : openCategories.includes(category.slug);

    if (isOpened) {
      isSearch
        ? setOpenSearchCategories((prev) =>
            prev.filter((c) => c !== category.slug),
          )
        : setOpenCategories((prev) => prev.filter((c) => c !== category.slug));
    } else {
      // init topics under that category if haven't initiated
      if (!topicsMap.has(category.id)) await initTopics(category.id);

      isSearch
        ? setOpenSearchCategories((prev) => [...prev, category.slug])
        : setOpenCategories((prev) => [...prev, category.slug]);
    }
  };

  const handleTopicClick = (slug: string) => {
    navigate(`/gospel/${slug}`);
    setSlug(slug);

    if (isMobile) setIsHidden(true);
  };

  const handleSermonClick = async (sermon: Sermon) => {
    try {
      const sermonOrder = await sermonsService.getSermonOrderById(sermon.id);

      if (sermonOrder > 0) {
        navigate(`/gospel/${sermon.label?.topic?.slug}/${sermonOrder}`);
      }
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const handleHomeClick = () => {
    navigate("/gospel");
    setSlug(undefined);

    if (isMobile) setIsHidden(true);
  };

  const handleMySermonClick = () => {
    navigate("/gospel?my");
    setSlug(undefined);

    if (isMobile) setIsHidden(true);
  };

  // components

  const chip = (
    searchType?: GospelSearchType,
    isDefault: boolean = false,
    size: ChipOwnProps["size"] = "small",
    onClick?: () => void,
  ) => {
    if (!searchType) return undefined;

    const _searchType = searchTypes.find((t) => t.label === searchType);
    return (
      <Chip
        key={_searchType?.label}
        label={_searchType?.label}
        className={clsx(
          "chip",
          Boolean(onClick) && "onClick",
          !isDefault && "custom",
        )}
        size={size}
        onClick={onClick}
        color={
          isDefault ? "default" : (_searchType?.color as ChipOwnProps["color"])
        }
      />
    );
  };

  const menuItem = (label: SermonLabel, isSearch: boolean = false) => {
    const isOpened = isSearch
      ? openSearchCategories.includes(label.slug)
      : openCategories.includes(label.slug);
    const topicCount = topicsMap.get(label.id)?.length ?? 0;
    const hasCollapse = label.type === "Category";

    return (
      <React.Fragment key={label.slug}>
        {/* category */}
        <MenuItem
          className="category-menu-item"
          onClick={() =>
            hasCollapse
              ? handleCategoryClick(label, isSearch)
              : handleTopicClick(label.slug)
          }
          disableRipple
        >
          <Typography>
            {highlightText(label.name, valueRef.current, DefaultHighlight)}
          </Typography>
          {hasCollapse ? isOpened ? <RemoveIcon /> : <AddIcon /> : undefined}
        </MenuItem>

        {/* topics of the category */}
        {hasCollapse ? (
          <Collapse in={isOpened}>
            {topicCount > 0 &&
              topicsMap.get(label.id)!.map((topic) => (
                <MenuItem
                  key={topic.slug}
                  className={clsx(
                    "topic-menu-item",
                    topic.slug === slug && "hovered",
                  )}
                  onClick={() => handleTopicClick(topic.slug)}
                >
                  <Typography>{topic.name}</Typography>
                </MenuItem>
              ))}
          </Collapse>
        ) : undefined}
      </React.Fragment>
    );
  };

  const SearchContent = (
    <React.Fragment>
      <Divider variant="middle">
        <Chip label="search result" onDelete={handleCloseSearch} />
      </Divider>
      {searchType === "Topic" ? (
        <React.Fragment>
          {_categoryCount > 0 ? (
            <React.Fragment>
              <Typography className="caption">category</Typography>
              {sermonLabelResult?.categories?.map((category) =>
                menuItem(category, true),
              )}
            </React.Fragment>
          ) : undefined}
          {_topicCount > 0 ? (
            <React.Fragment>
              <Typography className="caption">topic</Typography>
              {sermonLabelResult?.topics?.map((topic) => menuItem(topic))}
            </React.Fragment>
          ) : undefined}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography className="caption">sermon</Typography>
          {sermonResult?.map((sermon) => (
            <MenuItem
              key={sermon.id}
              className="category-menu-item"
              onClick={() => handleSermonClick(sermon)}
            >
              <Box display="flex" flexDirection="column">
                {/* label - category & topic */}
                <Typography
                  className="default"
                  variant="subtitle2"
                  fontWeight="bold"
                >
                  <span style={{ color: "var(--info-900)" }}>
                    {sermon.label?.category?.name}
                  </span>
                  {` > ${sermon.label?.topic?.name}`}
                </Typography>
                {/* sermon title with highlight */}
                <Typography>
                  {highlightText(
                    sermon.title,
                    valueRef.current,
                    DefaultHighlight,
                  )}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );

  const NavContent = (
    <React.Fragment>
      <Typography className="caption">navigation</Typography>
      <MenuItem
        key="main"
        className={clsx(
          "category-menu-item",
          !labelSlug && !orderId && !isWriterParams && "hovered",
        )}
        onClick={handleHomeClick}
      >
        <Typography>Home</Typography>
      </MenuItem>
      {isWriter ? (
        <MenuItem
          key="my"
          className={clsx(
            "category-menu-item",
            !labelSlug && !orderId && isWriterParams && "hovered",
          )}
          onClick={handleMySermonClick}
        >
          <Typography>My Sermons</Typography>
        </MenuItem>
      ) : undefined}
      {categories.length > 0 ? (
        <React.Fragment>
          <Typography className="caption">all categories</Typography>
          {categories.map((category) => menuItem(category))}
        </React.Fragment>
      ) : undefined}
    </React.Fragment>
  );

  return (
    <Box
      className={clsx(
        "gospel-drawer-container",
        isMobile && "mobile",
        isHidden && "hidden",
      )}
    >
      <Box className="header">
        <Typography className="title" variant="h2">
          GOSPEL
        </Typography>
        <FormControl className="input-form-control">
          <OutlinedInput
            className="outlined-input"
            placeholder="Find topics or sermons..."
            size="small"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDownSearch}
            startAdornment={
              <Box className="start-adornment-box">
                {chip(searchType, false, "medium")}
              </Box>
            }
            endAdornment={
              <TTIconButton
                className="search-button no-border"
                onClick={handleSearch}
              >
                <SearchIcon />
              </TTIconButton>
            }
            autoFocus
          />
        </FormControl>
        <Box className="chip-box">
          {searchTypes.map((type) => {
            const label = type.label as GospelSearchType;
            return chip(label, label !== searchType, "small", () =>
              setSearchType(label),
            );
          })}
        </Box>
      </Box>

      {/* content */}
      <Box className="content">{isSearch ? SearchContent : NavContent}</Box>

      {/* close button - mobile view */}
      {isMobile ? (
        <Box className="close-button">
          <TTIconButton onClick={() => setIsHidden(true)} noBorder>
            <CloseIcon />
          </TTIconButton>
        </Box>
      ) : undefined}
    </Box>
  );
};

export default GospelDrawer;
