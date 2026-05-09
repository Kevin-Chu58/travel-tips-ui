import TTIconButton from "@components/TTIconButton";
import { SEARCH_TYPES, type GospelSearchType } from "@constants/Types";
import {
  Box,
  Chip,
  Collapse,
  Divider,
  FormControl,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@mui/material";
import {
  type WritingLabelSearchResult,
  writingsService,
  type WritingLabel,
  type Writing,
} from "@services/gospel/writings";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import GospelChip from "./GospelChip";
import clsx from "clsx";
import "./index.scss";

type GospelDrawerProps = {
  isHidden: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

const GospelDrawer = ({ isHidden, setIsHidden }: GospelDrawerProps) => {
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
  const [categories, setCategories] = useState<WritingLabel[]>([]);
  // topics
  const [topicsMap, setTopicsMap] = useState<Map<number, WritingLabel[]>>(
    new Map(),
  );
  // search
  const [value, setValue] = useState<string>(""); // search input
  const [searchType, setSearchType] = useState<GospelSearchType>("Writing");
  // search results
  const [WritingResult, setWritingResult] = useState<Writing[] | undefined>();
  const [WritingLabelResult, setWritingLabelResult] = useState<
    WritingLabelSearchResult | undefined
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
  const _categoryCount = WritingLabelResult?.categories?.length ?? 0;
  const _topicCount = WritingLabelResult?.topics?.length ?? 0;
  const navigate = useNavigate();

  // init functions

  const initCategories = async () => {
    const labelResult = await writingsService.getWritingLabelsByParams({
      type: "Category",
    });
    setCategories(labelResult.result.categories ?? []);
  };

  const initTopics = async (id: number) => {
    const labelResult = await writingsService.getWritingLabelsByParams({
      type: "Topic",
      parentLabelId: id,
    });

    let _topicsMap = topicsMap;
    _topicsMap.set(id, labelResult.result.topics ?? []);
    setTopicsMap(_topicsMap);
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

  const handleCloseSearch = useCallback(() => {
    setWritingResult(undefined);
    setWritingLabelResult(undefined);
    setOpenSearchCategories([]);
    setValue("");
    setIsSearch(false);
  }, []);

  const handleTopicClick = useCallback(
    (slug: string) => {
      navigate(`/gospel/${slug}`);
      setSlug(slug);
      if (isMobile) setIsHidden(true);
    },
    [navigate, isMobile, setIsHidden],
  );

  const handleHomeClick = useCallback(() => {
    navigate("/gospel");
    setSlug(undefined);
    if (isMobile) setIsHidden(true);
  }, [navigate, isMobile, setIsHidden]);

  const handleMyWritingClick = useCallback(() => {
    navigate("/gospel?my");
    setSlug(undefined);
    if (isMobile) setIsHidden(true);
  }, [navigate, isMobile, setIsHidden]);

  const handleWritingClick = useCallback(
    async (writing: Writing) => {
      try {
        const writingOrder = await writingsService.getWritingOrderById(
          writing.id,
        );
        if (writingOrder > 0) {
          navigate(`/gospel/${writing.label?.topic?.slug}/${writingOrder}`);
        }
      } catch (e) {
        if (e instanceof Error)
          enqueueSnackbar(e.message, { variant: "error" });
      }
    },
    [navigate],
  );

  const handleCategoryClick = useCallback(
    async (category: WritingLabel, isSearch: boolean = false) => {
      const isOpened = isSearch
        ? openSearchCategories.includes(category.slug)
        : openCategories.includes(category.slug);

      if (isOpened) {
        isSearch
          ? setOpenSearchCategories((prev) =>
              prev.filter((c) => c !== category.slug),
            )
          : setOpenCategories((prev) =>
              prev.filter((c) => c !== category.slug),
            );
      } else {
        if (!topicsMap.has(category.id)) await initTopics(category.id);
        isSearch
          ? setOpenSearchCategories((prev) => [...prev, category.slug])
          : setOpenCategories((prev) => [...prev, category.slug]);
      }
    },
    [openSearchCategories, openCategories, topicsMap],
  );

  const handleSearch = useCallback(async () => {
    if (!value) return;

    if (searchType === "Topic") {
      const searchResult = await writingsService.getWritingLabelsByParams({
        name: value,
      });
      setWritingLabelResult(searchResult.result);
    }

    if (searchType === "Writing") {
      const writingResult = await writingsService.getWritingsByParams({
        title: value,
      });
      setWritingResult(writingResult);
    }

    setIsSearch(true);
    setValue(value);
  }, [value, searchType]);

  // trigger when press enter when focus on search input
  const handleKeyDownSearch = useCallback(
    async (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        await handleSearch();
      }
    },
    [],
  );

  // components

  type MenuItemProps = {
    label: WritingLabel;
    isSearch?: boolean;
  };

  const menuItem = ({ label, isSearch = false }: MenuItemProps) => {
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
            {highlightText(label.name, value, DefaultHighlight)}
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

  const SearchContent = useMemo(
    () => (
      <React.Fragment>
        <Divider variant="middle">
          <Chip label="search result" onDelete={handleCloseSearch} />
        </Divider>
        {searchType === "Topic" ? (
          <React.Fragment>
            {_categoryCount > 0 && (
              <React.Fragment>
                <Typography className="caption">category</Typography>
                {WritingLabelResult?.categories?.map((category) =>
                  menuItem({ label: category, isSearch: true }),
                )}
              </React.Fragment>
            )}
            {_topicCount > 0 && (
              <React.Fragment>
                <Typography className="caption">topic</Typography>
                {WritingLabelResult?.topics?.map((topic) =>
                  menuItem({ label: topic }),
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography className="caption">Writing</Typography>
            {WritingResult?.map((writing) => (
              <MenuItem
                key={writing.id}
                className="category-menu-item"
                onClick={() => handleWritingClick(writing)}
              >
                <Box display="flex" flexDirection="column">
                  <Typography
                    className="default"
                    variant="subtitle2"
                    fontWeight="bold"
                  >
                    <span style={{ color: "var(--info-900)" }}>
                      {writing.label?.category?.name}
                    </span>
                    {` > ${writing.label?.topic?.name}`}
                  </Typography>
                  <Typography>
                    {highlightText(writing.title, value, DefaultHighlight)}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </React.Fragment>
        )}
      </React.Fragment>
    ),
    [
      searchType,
      _categoryCount,
      _topicCount,
      WritingLabelResult,
      WritingResult,
      handleCloseSearch,
      handleWritingClick,
    ],
  );

  const NavContent = useMemo(
    () => (
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
        {isWriter && (
          <MenuItem
            key="my"
            className={clsx(
              "category-menu-item",
              !labelSlug && !orderId && isWriterParams && "hovered",
            )}
            onClick={handleMyWritingClick}
          >
            <Typography>My Writings</Typography>
          </MenuItem>
        )}
        {categories.length > 0 && (
          <React.Fragment>
            <Typography className="caption">all categories</Typography>
            {categories.map((category) => menuItem({ label: category }))}
          </React.Fragment>
        )}
      </React.Fragment>
    ),
    [
      categories,
      labelSlug,
      orderId,
      isWriterParams,
      isWriter,
      handleHomeClick,
      handleMyWritingClick,
      slug,
      openCategories,
      topicsMap,
    ],
  );

  return (
    <Box
      className={clsx(
        "gospel-drawer-container",
        isMobile && "mobile",
        isMobile && isHidden && "hidden",
      )}
    >
      <Box className="header">
        <Typography className="title" variant="h2">
          GOSPEL
        </Typography>
        <FormControl className="input-form-control">
          <OutlinedInput
            className="outlined-input"
            placeholder="Find topics or Writings..."
            size="small"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDownSearch}
            startAdornment={
              <Box className="start-adornment-box">
                <GospelChip
                  searchType={searchType}
                  isDefault={false}
                  size="medium"
                />
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
          {SEARCH_TYPES.map((type) => {
            const label = type.label as GospelSearchType;
            return (
              <GospelChip
                key={type.label}
                searchType={label}
                isDefault={label !== searchType}
                size="small"
                onClick={() => setSearchType(label)}
              />
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
