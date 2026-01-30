import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import FormBase from "../FormBase";
import { useState } from "react";
import type { SermonLabelType } from "@services/gospel/sermons";

type AddSermonLabelFormProps = {
  open: boolean;
  onClose: () => void;
};

const AddSermonLabelForm = ({ open, onClose }: AddSermonLabelFormProps) => {
  // label type
  const [type, setType] = useState<SermonLabelType>("Category");

  return (
    <FormBase open={open} onClose={onClose} title="Add Sermon Label" panel>
      <Box>
        {/* radio group - label type */}
        <FormControl>
          <FormLabel>Label Type</FormLabel>
          <RadioGroup
            row
            value={type}
            onChange={(e) => setType(e.target.value as SermonLabelType)}
          >
            <FormControlLabel
              value="Category"
              control={<Radio />}
              label="Category"
            />
            <FormControlLabel value="Topic" control={<Radio />} label="Topic" />
          </RadioGroup>
        </FormControl>

        {type === "Category" ? <Box>category</Box> : <Box>type</Box>}
      </Box>
    </FormBase>
  );
};

export default AddSermonLabelForm;
