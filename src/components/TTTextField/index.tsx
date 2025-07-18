import {
  Box,
  TextField as MuiTextField,
  type SxProps,
  type Theme,
} from "@mui/material";
import TTIconButton from "@components/TTIconButton";
import ClearIcon from "@mui/icons-material/Clear";

type TTTextFieldProps = {
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

const TTTextField = ({
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
}: TTTextFieldProps) => {
  const isInputEmpty = () => {
    return !input || input.length === 0;
  };

  const pressEnter = (event: React.KeyboardEvent) => {
    if (onEnterDown && event.key === "Enter") {
      onEnterDown();
    }
  };

  return (
    <Box className="TTTextfield-box">
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
        <TTIconButton
          onClick={clearInput}
          sx={{
            ml: -3.5,
            mt: -1,
            cursor: isInputEmpty() ? "unset" : "pointer",
          }}
        >
          <ClearIcon
            sx={{
              color: color,
              visibility: isInputEmpty() ? "hidden" : "visible",
              borderRadius: 50,
            }}
          />
        </TTIconButton>
      )}
    </Box>
  );
};

export default TTTextField;
