import {
  Box,
  TextField as MuiTextField,
  type SxProps,
  type Theme,
} from "@mui/material";
import IconButton from "@components/TTIconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { getHex } from "@constants/Colors";

type TextFieldProps = {
  id?: string;
  className?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  color?: string;
  inputRef?: React.RefObject<HTMLElement | null>;
  label?: string;
  input?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearInput?: () => void;
  onEnterDown?: () => void;
  inputSx?: SxProps<Theme>;
};

const TextField = ({
  id,
  className,
  autoFocus = false,
  fullWidth = false,
  multiline = false,
  color = "black",
  inputRef,
  label,
  input,
  placeholder,
  onChange,
  onEnterDown,
  clearInput,
  inputSx,
}: TextFieldProps) => {
  const isInputEmpty = () => {
    return !input || input.length === 0;
  };

  const pressEnter = (event: React.KeyboardEvent) => {
    if (onEnterDown && event.key === "Enter") {
      onEnterDown();
    }
  };

  return (
    <Box display="flex" position="relative" flexGrow={1}>
      <MuiTextField
        id={id}
        className={className}
        placeholder={placeholder}
        inputRef={inputRef}
        fullWidth={fullWidth}
        label={label}
        variant="standard"
        value={input}
        onChange={onChange}
        onKeyDown={pressEnter}
        autoFocus={autoFocus}
        multiline={multiline}
        sx={
          {
            ".MuiInputBase-input": {...inputSx},
          } as SxProps<Theme>
        }
      />
      {clearInput && (
        <IconButton
          onClick={clearInput}
          sx={{
            ml: -3.5,
            mt: -1,
            borderWidth: 0,
            cursor: isInputEmpty() ? "unset" : "pointer",
          }}
        >
          <ClearIcon
            sx={{
              color: color,
              visibility: isInputEmpty() ? "hidden" : "visible",
              border: "1px solid transparent",
              borderRadius: 50,
              scale: 1.1,
              ":hover": {
                bgcolor: getHex(color) + "33",
              },
            }}
          />
        </IconButton>
      )}
    </Box>
  );
};

export default TextField;
