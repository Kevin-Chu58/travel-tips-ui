import TTButton from "@components/TTButton";
import { Box, TextField, type SxProps } from "@mui/material";
import { useState } from "react";

type DescriptionTextFieldProps = {
  value: string;
  setValue: (state: string) => void;
};

const DescriptionTextField = ({
  value,
  setValue,
}: DescriptionTextFieldProps) => {
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const buttonHighlightSx = {
    borderWidth: "1px 1px 0 1px",
    borderStyle: "solid",
    borderColor: "divider",
    bgcolor: "white",
    zIndex: 5,
    scale: 1.06,
  } as SxProps;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        flex={1}
        bgcolor="whitesmoke"
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <TTButton
          label="write"
          variant="text"
          onClick={() => setIsPreview(false)}
          disableRipple
          sx={{
            borderColor: "transparent",
            borderRadius: ".5rem .5rem 0 0",
            ...(!isPreview && buttonHighlightSx),
          }}
        />
        <TTButton
          label="preview"
          variant="text"
          onClick={() => setIsPreview(true)}
          disableRipple
          sx={{
            borderColor: "transparent",
            borderRadius: ".5rem .5rem 0 0",
            ...(isPreview && buttonHighlightSx),
          }}
        />
      </Box>

      {isPreview ? (
        <TextField
          value={value}
          multiline
          slotProps={{
            htmlInput: {
              readOnly: true,
            },
          }}
          sx={{
            display: "flex",
            flex: 1,
            m: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
          }}
        />
      ) : (
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          multiline
          sx={{ display: "flex", flex: 1, bgcolor: "whitesmoke", m: 2 }}
        />
      )}
    </Box>
  );
};

export default DescriptionTextField;
