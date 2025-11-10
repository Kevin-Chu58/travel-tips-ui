import TTButton from "@components/TTButton";
import { Box, TextField } from "@mui/material";
import { useState } from "react";
import "./index.scss";
import MarkdownBox from "@components/MarkdownBox";

type DescriptionTextFieldProps = {
  value: string;
  setValue: (state: string) => void;
  placeholder?: string;
};

const DescriptionTextField = ({
  value,
  setValue,
  placeholder,
}: DescriptionTextFieldProps) => {
  const [isPreview, setIsPreview] = useState<boolean>(false);

  return (
    <Box className="description-text-field-box">
      <Box className="description-text-field-view-box">
        <TTButton
          label="write"
          variant="text"
          onClick={() => setIsPreview(false)}
          className={`description-text-field-view-button ${
            !isPreview && "focus"
          }`}
          disableRipple
        />
        <TTButton
          label="preview"
          variant="text"
          onClick={() => setIsPreview(true)}
          className={`description-text-field-view-button ${
            isPreview && "focus"
          }`}
          disableRipple
        />
      </Box>

      {isPreview ? (
        <MarkdownBox text={value || "*Nothing to preview*"} />
      ) : (
        <TextField
          className="description-text-field-view-input-text-field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          multiline
        />
      )}
    </Box>
  );
};

export default DescriptionTextField;
