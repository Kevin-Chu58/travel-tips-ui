import TTIconButton from "@components/TTIconButton";
import type { SelectType } from "@constants/Types";
import {
  Box,
  MenuItem,
  Select,
  Tooltip,
  type SelectChangeEvent,
  type SxProps,
} from "@mui/material";
import { useEffect, useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

type SelectOptionsBaseLockProps = {
  optionIndex?: number; // option index gives option to update focused option from the outside
  isLocked?: boolean; // is locked enables and disables this update option
  setIsLocked?: (state: boolean) => void;
  lockedLabel?: string;
  showIsLocked?: boolean;
};

type SelectOptionsBaseProps = SelectOptionsBaseLockProps & {
  options: SelectType[];
  setOptionFocus: (state: any) => void;
  defaultOption?: SelectType;
  sx?: SxProps;
  selectSx?: SxProps;
};

const SelectOptionsBase = ({
  options,
  optionIndex,
  setOptionFocus,
  defaultOption,
  isLocked = false,
  setIsLocked,
  lockedLabel,
  showIsLocked = false,
  sx,
  selectSx,
}: SelectOptionsBaseProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const selectOptions = defaultOption ? [defaultOption, ...options] : options;

  // rerender on focusedIndex to update the focused select option
  useEffect(() => {
    setOptionFocus(selectOptions[focusedIndex].item);
  }, [focusedIndex]);

  // rerender on optionIndex to update the focused select option
  useEffect(() => {
    if (!isLocked && optionIndex) {
      setFocusedIndex(optionIndex);
    }
  }, [optionIndex]);

  // select operations

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFocusedIndex(Number.parseInt(e.target.value));
  };

  // lock operations

  const handleLockClick = () => {
    if (setIsLocked) setIsLocked(!isLocked);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      <Select
        value={focusedIndex.toString()}
        onChange={handleSelectChange}
        size="small"
        sx={{
          width: 160,
          fontSize: 14,
          ...selectSx,
        }}
      >
        {selectOptions.map((option, i) => (
          <MenuItem key={i} value={i.toString()} sx={{ fontSize: 14 }}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {showIsLocked && (
        <Tooltip
          key="select-option-base-lock"
          title={lockedLabel}
          arrow
        >
          <TTIconButton
            onClick={handleLockClick}
            sx={{
              bgcolor: "secondary.900",
              color: "white",
            }}
          >
            {isLocked ? (
              <LockIcon sx={{ fontSize: 30 }} />
            ) : (
              <LockOpenIcon sx={{ fontSize: 30 }} />
            )}
          </TTIconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default SelectOptionsBase;
