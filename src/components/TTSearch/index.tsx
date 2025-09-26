import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import TTTextField from "@components/TTTextField";
import { Box, IconButton, type SxProps, type Theme } from "@mui/material";
import { useSearchParams } from "react-router";

type TTSearchProps = {
  color: string;
  placeholder?: string;
  defaultInput?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  isTripSearch?: boolean;
  sx?: SxProps<Theme>;
};

const TTSearch = ({
  color,
  placeholder,
  defaultInput = "",
  autoFocus = false,
  fullWidth = false,
  isTripSearch = false,
  sx,
}: TTSearchProps) => {
  const [input, setInput] = useState<string>(defaultInput);
  const inputRef = useRef<HTMLInputElement>(null);
  const [_, setSearchParams] = useSearchParams();

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
    if (isTripSearch) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        let trimmedInput = input.trim();

        if (trimmedInput) {
          newParams.set("search", trimmedInput);
        } else {
          newParams.delete("search");
        }
        return newParams;
      });
    }
  };

  return (
    <Box display="flex" flexDirection="row" maxWidth={400} sx={sx}>
      <TTTextField
        id="search"
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
        size="small"
        onClick={handleSearch}
        sx={{
          ml: 1,
          color: color,
          scale: 1.1,
          borderWidth: 0,
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

export default TTSearch;
