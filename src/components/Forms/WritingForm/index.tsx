import {
  Box,
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
  writingsService,
  type Writing,
  type WritingLabel,
} from "@services/gospel/Writings";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import TimeUtils from "@utils/TimeUtils";
import { enqueueSnackbar } from "notistack";
import dayjs, { Dayjs } from "dayjs";
import "./index.scss";

type WritingFormProps = {
  WritingId?: number;
  open: boolean;
  onClose: () => void;
  onAction?: (state: Writing) => void;
};

const WritingForm = ({
  WritingId,
  open,
  onClose,
  onAction,
}: WritingFormProps) => {
  // title
  const [title, setTitle] = useState<string | undefined>();
  // publish at
  const [publishAt, setPublishAt] = useState<Dayjs | null>(null);
  // content
  const [content, setContent] = useState<string | undefined>();
  // label data
  const [categories, setCategories] = useState<WritingLabel[]>([]);
  const [topics, setTopics] = useState<WritingLabel[]>([]);
  // label slug
  const [category, setCategory] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const _category = categories.find((c) => c.slug === category);
  const _topic = topics.find((t) => t.slug === topic);
  // others
  const isValid =
    Boolean(title) &&
    publishAt !== null &&
    Boolean(content?.trim()) &&
    !(_category !== undefined && _topic === undefined);

  // init functions

  const initCategories = async () => {
    const categories = await writingsService.getWritingLabelsByParams({
      type: "Category",
    });
    setCategories(categories.result.categories ?? []);
  };

  const initTopics = async () => {
    const topics = await writingsService.getWritingLabelsByParams({
      type: "Topic",
      parentLabelId: _category?.id,
    });
    setTopics(topics.result.topics ?? []);
  };

  // use effect
  useEffect(() => {
    const loadWriting = async () => {
      if (open) {
        initCategories();

        if (WritingId) {
          const Writing = await writingsService.getWritingById(WritingId, true);

          setTitle(Writing.title);
          setPublishAt(dayjs(Writing.publishAt));
          setCategory(Writing.label?.category?.slug ?? "");
          setTopic(Writing.label?.topic?.slug ?? "");
          setContent(Writing.content);
        }
      }
    };
    loadWriting();
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
      const newWriting = await writingsService.postNewWriting({
        title: title ?? "",
        content: content ?? "",
        labelId: _topic?.id,
        publishAt: TimeUtils.dayjsToString("YYYY-MM-DD", publishAt),
      });

      enqueueSnackbar("Writing created.", { variant: "success" });
      if (onAction) onAction(newWriting);

      handleClose();
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const handleUpdate = async () => {
    if (!isValid || !WritingId) return;

    try {
      const updatedWriting = await writingsService.patchWriting(WritingId, {
        title: title,
        content: content,
        labelId: _topic?.id,
        publishAt: TimeUtils.dayjsToString("YYYY-MM-DD", publishAt),
      });

      enqueueSnackbar("Writing updated.", { variant: "success" });
      if (onAction) onAction(updatedWriting);

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
    onClose();
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
    setTopic("");
  };

  const handleTopicChange = (event: SelectChangeEvent) => {
    setTopic(event.target.value);
  };

  return (
    <FormBase
      className="Writing-form"
      open={open}
      onClose={handleClose}
      width="60vw"
      height="80vh"
      maxHeight="80vh"
      title={WritingId ? "Edit Writing" : "New Writing"}
      actionButtonLabel={WritingId ? "Update" : "Create"}
      actionButtonOnClick={WritingId ? handleUpdate : handleCreate}
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
              placeholder="Writing Title"
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
            <Typography variant="caption">
              *Only Writings with category and topic are visible to public.
            </Typography>
          </Grid>

          {/* content */}
          <Grid size={12}>
            <Typography className="form-title">Content*</Typography>
            <DescriptionTextField
              value={content ?? ""}
              setValue={setContent}
              placeholder="Write Writing here"
              maxHeight="50vh"
              isOfficial
            />
          </Grid>
        </Grid>
      </Box>
    </FormBase>
  );
};

export default WritingForm;
