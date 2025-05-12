import {
  Box,
  TextField as MuiTextField,
  type SxProps,
  type Theme,
} from "@mui/material";
import IconButton from "@components/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { getHex } from "@constants/Colors";

type TextFieldProps = {
  id: string;
  className: string;
  autoFocus: boolean;
  fullWidth?: boolean;
  color: string;
  inputRef: React.RefObject<HTMLElement | null>;
  input: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearInput: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  sx?: SxProps<Theme>;
};

const TextField = ({
  id,
  className,
  autoFocus,
  fullWidth = false,
  color,
  inputRef,
  input,
  placeholder,
  onChange,
  onKeyDown,
  clearInput,
  sx,
}: TextFieldProps) => {
  const isInputEmpty = () => {
    return input.length === 0;
  };

  return (
    <Box display="flex" position="relative" flexGrow={1} sx={sx}>
      <MuiTextField
        id={id}
        className={className}
        placeholder={placeholder}
        inputRef={inputRef}
        fullWidth={fullWidth}
        label=""
        variant="standard"
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
      />
      <IconButton
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
            border: "1px solid transparent",
            borderRadius: 50,
            scale: 0.8,
            ":hover": {
              bgcolor: getHex(color) + "33",
            },
          }}
        />
      </IconButton>
    </Box>
  );
};

export default TextField;
