// import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import IconButton from "../IconButton";
import TextField from "../TextField";
import { Box } from "@mui/material";

type SearchProps = {
  className: string;
  autoFocus: boolean;
};

const Search = ({ className, autoFocus = false }: SearchProps) => {
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box display="flex">
      <TextField
        id="quick-search"
        className={className}
        autoFocus={autoFocus}
        color="white"
        inputRef={inputRef}
        input={input}
        onChange={handleChangeInput}
        clearInput={clearInput}
        onKeyDown={handleKeyDown}
      />
      <IconButton
        onClick={handleSearch}
        sx={{
          color: "white",
          ml: -1,
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
