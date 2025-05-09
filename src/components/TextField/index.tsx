import { Box, TextField as MuiTextField } from "@mui/material";
import IconButton from "../IconButton";
import ClearIcon from "@mui/icons-material/Clear";

type TextFieldProps = {
  id: string;
  className: string;
  autoFocus: boolean;
  color: string;
  inputRef: React.RefObject<HTMLElement | null>,
  input: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearInput: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
};

const TextField = ({
  id,
  className,
  autoFocus,
  color,
  inputRef,
  input,
  onChange,
  onKeyDown,
  clearInput,
}: TextFieldProps) => {

  const isInputEmpty = () => {
    return input.length === 0;
  };

  return (
    <Box display="flex" position="relative">
      <MuiTextField
        id={id}
        className={className}
        inputRef={inputRef}
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
            scale: .8,
            ":hover": {
              bgcolor: "#ffffff33",
            },
          }}
        />
      </IconButton>
    </Box>
  );
};

export default TextField;
