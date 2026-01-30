import {
  Box,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import FormBase from "../FormBase";
import DescriptionTextField from "@components/TextField/DescriptionTextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  sermonsService,
  type Sermon,
  type SermonLabel,
} from "@services/gospel/sermons";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState, type ChangeEvent } from "react";
import TimeUtils from "@utils/TimeUtils";
import { enqueueSnackbar } from "notistack";
import dayjs, { Dayjs } from "dayjs";
import "./index.scss";

type SermonFormProps = {
  sermonId?: number;
  open: boolean;
  onClose: () => void;
  onAction?: (state: Sermon) => void;
};

const SermonForm = ({ sermonId, open, onClose, onAction }: SermonFormProps) => {
  // title
  const [title, setTitle] = useState<string | undefined>();
  // publish at
  const [publishAt, setPublishAt] = useState<Dayjs | null>(null);
  // content
  const [content, setContent] = useState<string | undefined>();
  // label data
  const [categories, setCategories] = useState<SermonLabel[]>([]);
  const [topics, setTopics] = useState<SermonLabel[]>([]);
  // label slug
  const [category, setCategory] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const _category = categories.find((c) => c.slug === category);
  const _topic = topics.find((t) => t.slug === topic);
  // is banner
  const [isBanner, setIsBanner] = useState<boolean>(false);
  // others
  const isValid =
    Boolean(title) &&
    publishAt !== null &&
    Boolean(content?.trim()) &&
    !(_category !== undefined && _topic === undefined);

  // init functions

  const initCategories = async () => {
    const categories = await sermonsService.getSermonLabelsByParams({
      type: "Category",
    });
    setCategories(categories.result.categories ?? []);
  };

  const initTopics = async () => {
    const topics = await sermonsService.getSermonLabelsByParams({
      type: "Topic",
      parentLabelId: _category?.id,
    });
    setTopics(topics.result.topics ?? []);
  };

  // use effect
  useEffect(() => {
    const loadSermon = async () => {
      if (open) {
        initCategories();

        if (sermonId) {
          const sermon = await sermonsService.getSermonById(sermonId, true);
          
          setTitle(sermon.title);
          setPublishAt(dayjs(sermon.publishAt));
          setCategory(sermon.label?.category?.slug ?? "");
          setTopic(sermon.label?.topic?.slug ?? "");
          setIsBanner(sermon.isBanner);
          setContent(sermon.content);
        }
      }
    };
    loadSermon();
  }, [open]);

  useEffect(() => {
    if (category) {
      initTopics();
    }
  }, [category]);

  // handle functions

  const handleCreate = async () => {
    if (!isValid) return;

    try {
      const newSermon = await sermonsService.postNewSermon({
        title: title ?? "",
        content: content ?? "",
        labelId: _topic?.id,
        publishAt: TimeUtils.dayjsToString("YYYY-MM-DD", publishAt),
        isBanner: isBanner,
      });

      enqueueSnackbar("Sermon created.", { variant: "success" });
      if (onAction) onAction(newSermon);

      handleClose();
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const handleUpdate = async () => {
    if (!isValid || !sermonId) return;

    try {
      const updatedSermon = await sermonsService.patchSermon(sermonId, {
        title: title,
        content: content,
        labelId: _topic?.id,
        publishAt: TimeUtils.dayjsToString("YYYY-MM-DD", publishAt),
        isBanner: isBanner,
      });

      enqueueSnackbar("Sermon updated.", { variant: "success" });
      if (onAction) onAction(updatedSermon);

      handleClose();
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const handleClose = () => {
    setTitle(undefined);
    setPublishAt(null);
    setContent(undefined);
    setCategory("");
    setTopic("");
    setIsBanner(false);
    onClose();
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
    setTopic("");
  };

  const handleTopicChange = (event: SelectChangeEvent) => {
    setTopic(event.target.value);
  };

  const handleIsBannerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsBanner(event.target.checked);
  };

  return (
    <FormBase
      className="sermon-form"
      open={open}
      onClose={handleClose}
      width="60vw"
      height="80vh"
      maxHeight="80vh"
      title={sermonId ? "Edit Sermon" : "New Sermon"}
      actionButtonLabel={sermonId ? "Update" : "Create"}
      actionButtonOnClick={sermonId ? handleUpdate : handleCreate}
      disableActionButton={!isValid}
      panel
    >
      <Box className="column">
        <Grid container spacing={4}>
          {/* left col */}
          <Grid className="column" size={{ xs: 12, md: 6 }}>
            {/* title */}
            <Typography className="form-title">Title*</Typography>
            <TextField
              value={title ?? ""}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sermon Title"
            />
            {/* publish at */}
            <Typography className="form-title">Publish At*</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker value={publishAt} onChange={(e) => setPublishAt(e)} />
            </LocalizationProvider>
          </Grid>

          {/* right col */}
          <Grid className="column" size={{ xs: 12, md: 6 }}>
            <Typography className="form-title">Label</Typography>
            {/* category */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={category}
                onChange={handleCategoryChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.slug}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* topic */}
            <FormControl fullWidth>
              <InputLabel>Topic</InputLabel>
              <Select label="Topic" value={topic} onChange={handleTopicChange}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.slug}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="caption">*Only sermons with category and topic are visible to public.</Typography>
            {/* banner */}
            <Box className="row">
              <Typography className="form-title">Appears in Banner?</Typography>
              <Checkbox
                checked={isBanner}
                onChange={(e) => handleIsBannerChange(e)}
              />
            </Box>
          </Grid>

          {/* content */}
          <Grid size={12}>
            <Typography className="form-title">Content*</Typography>
            <DescriptionTextField
              value={content ?? ""}
              setValue={setContent}
              placeholder="Write sermon here"
              maxHeight="50vh"
              isOfficial
            />
          </Grid>
        </Grid>
      </Box>
    </FormBase>
  );
};

export default SermonForm;
