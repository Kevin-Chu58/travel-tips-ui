import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import FormBase from "../FormBase";
import { useEffect, useState } from "react";
import {
  sermonsService,
  type SermonLabel,
  type SermonLabelType,
} from "@services/gospel/sermons";
import { StringUtils } from "@utils/StringUtils";
import "./index.scss";
import { enqueueSnackbar } from "notistack";

type AddSermonLabelFormProps = {
  open: boolean;
  onClose: () => void;
};

const AddSermonLabelForm = ({ open, onClose }: AddSermonLabelFormProps) => {
  // label type
  const [type, setType] = useState<SermonLabelType>("Category");
  // label value
  const [value, setValue] = useState<string>("");
  // categories
  const [categories, setCategories] = useState<SermonLabel[]>([]);
  // category - when label type is Topic
  const [category, setCategory] = useState<string>(""); // slug
  // others
  const _category = categories.find((c) => c.slug === category);
  const isValid = Boolean(value) && (type !== "Topic" || category !== "");

  useEffect(() => {
    if (type === "Topic" && categories.length === 0) {
      initCategories();
    }
  }, [type]);

  // init functions

  const initCategories = async () => {
    const categories = await sermonsService.getSermonLabelsByParams({
      type: "Category",
    });
    setCategories(categories.result.categories ?? []);
  };

  // handle functions

  const handleClose = () => {
    setValue("");
    setType("Category");
    setCategories([]);
    onClose();
  };

  const handleCreate = async () => {
    if (!isValid) return;

    try {
      await sermonsService.postNewSermonLabel(value, type, _category?.id);

      enqueueSnackbar("Sermon label created.", { variant: "success" });

      handleClose();
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  return (
    <FormBase
      open={open}
      onClose={handleClose}
      className="add-sermon-label-form"
      width="20vw"
      title="New Sermon Label"
      actionButtonLabel="Create"
      actionButtonOnClick={handleCreate}
      panel
    >
      <Box className="column" gap={1}>
        {/* radio group - label type */}
        <FormControl>
          <FormLabel color="info">Label Type</FormLabel>
          <RadioGroup
            row
            value={type}
            onChange={(e) => setType(e.target.value as SermonLabelType)}
          >
            <FormControlLabel
              value="Category"
              control={<Radio color="info" />}
              label="Category"
            />
            <FormControlLabel
              value="Topic"
              control={<Radio color="info" />}
              label="Topic"
            />
          </RadioGroup>
        </FormControl>

        {type === "Topic" ? (
          <FormControl>
            <InputLabel color="info">Category*</InputLabel>
            <Select
              className="select-category"
              label="Category*"
              value={category}
              color="info"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem className="add-sermon-label-form-menu-item" value="">
                <em>None</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem
                  className="add-sermon-label-form-menu-item"
                  key={category.id}
                  value={category.slug}
                >
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : undefined}

        <FormControl>
          <InputLabel color="info">{`${type}*`}</InputLabel>
          <OutlinedInput
            label={`${type}*`}
            value={value}
            color="info"
            onChange={(e) => setValue(e.target.value)}
          />
        </FormControl>

        <Box className="row">
          <Typography fontWeight="bold">Slug</Typography>
          {value.trim() ? (
            <Chip
              label={StringUtils.slugify(value)}
              color={type === "Category" ? "info" : "utility"}
              size="small"
            />
          ) : (
            <Typography fontStyle="italic">None</Typography>
          )}
        </Box>
        <Typography variant="caption">
          *Every label slug must be unique.
        </Typography>
      </Box>
    </FormBase>
  );
};

export default AddSermonLabelForm;
