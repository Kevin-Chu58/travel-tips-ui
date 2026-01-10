import TTButton from "@components/TTButton";
import { Box, InputAdornment, TextField } from "@mui/material";
import MarkdownBox from "@components/MarkdownBox";
import { useState } from "react";
import "./index.scss";

type DescriptionTextFieldProps = {
  value: string;
  setValue: (state: string) => void;
  placeholder?: string;
  maxLength?: number;
};

const DescriptionTextField = ({
  value,
  setValue,
  placeholder,
  maxLength,
}: DescriptionTextFieldProps) => {
  const [isPreview, setIsPreview] = useState<boolean>(false);

  return (
    <Box className="description-text-field-box">
      <Box className="view-box">
        <TTButton
          label="write"
          variant="text"
          onClick={() => setIsPreview(false)}
          className={`view-button ${
            !isPreview && "focus"
          }`}
          disableRipple
        />
        <TTButton
          label="preview"
          variant="text"
          onClick={() => setIsPreview(true)}
          className={`view-button ${
            isPreview && "focus"
          }`}
          disableRipple
        />
      </Box>

      {isPreview ? (
        <MarkdownBox text={value} />
      ) : (
        <Box className="text-field-box">
          <TextField
          className="view-input-text-field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          multiline
        />
        
          <Box className="end-adornment">
            <InputAdornment position="end">
              {maxLength ? `${value?.length ?? 0}/${maxLength}` : ""}
            </InputAdornment>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DescriptionTextField;
