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
import FormBase from "../FormBases/FormBase";
import { useEffect, useState } from "react";
import {
  writingsService,
  type WritingLabel,
  type WritingLabelType,
} from "@services/gospel/writings";
import { StringUtils } from "@utils/StringUtils";
import { enqueueSnackbar } from "notistack";
import "./index.scss";

type AddWritingLabelFormProps = {
  open: boolean;
  onClose: () => void;
};

const AddWritingLabelForm = ({ open, onClose }: AddWritingLabelFormProps) => {
  // label type
  const [type, setType] = useState<WritingLabelType>("Category");
  // label value
  const [value, setValue] = useState<string>("");
  // categories
  const [categories, setCategories] = useState<WritingLabel[]>([]);
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
    const categories = await writingsService.getWritingLabelsByParams({
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
      await writingsService.postNewWritingLabel(value, type, _category?.id);

      enqueueSnackbar("Writing label created.", { variant: "success" });

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
      className="add-Writing-label-form"
      width="20vw"
      title="New Writing Label"
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
            onChange={(e) => setType(e.target.value as WritingLabelType)}
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
              <MenuItem className="add-Writing-label-form-menu-item" value="">
                <em>None</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem
                  className="add-Writing-label-form-menu-item"
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

        <Box className="row full">
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

export default AddWritingLabelForm;
