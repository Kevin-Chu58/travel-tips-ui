// import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import IconButton from "@components/IconButton";
import TextField from "@components/TextField";
import { Box, type SxProps, type Theme } from "@mui/material";

type SearchProps = {
  className: string;
  color: string;
  placeholder?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
};

const Search = ({
  className,
  color,
  placeholder,
  autoFocus = false,
  fullWidth = false,
  sx,
}: SearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState<string>("");

  // re-render the input
  useEffect(() => {}, [input]);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const clearInput = () => {
    setInput("");
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    // TODO - get search results
    console.log(input);
    clearInput();
  };

  return (
    <Box display="flex" flexDirection="row" maxWidth={400} sx={sx}>
      <TextField
        id="search"
        className={className}
        placeholder={placeholder}
        autoFocus={autoFocus}
        fullWidth={fullWidth}
        color={color}
        inputRef={inputRef}
        input={input}
        onChange={handleChangeInput}
        clearInput={clearInput}
        onEnterDown={handleSearch}
      />
      <IconButton
        onClick={handleSearch}
        sx={{
          ml: -1,
          color: color,
          ":hover": {
            color: "primary.main",
          },
        }}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default Search;
