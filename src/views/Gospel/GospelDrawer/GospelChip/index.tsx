import { SEARCH_TYPES, type GospelSearchType } from "@constants/Types";
import { Chip, type ChipOwnProps } from "@mui/material";
import clsx from "clsx";

type GospelChipProps = {
  searchType?: GospelSearchType;
  isDefault: boolean;
  size: ChipOwnProps["size"];
  onClick?: () => void;
};

const GospelChip = ({
  searchType,
  isDefault = false,
  size = "small",
  onClick = () => {},
}: GospelChipProps) => {
  if (!searchType) return undefined;

  const _searchType = SEARCH_TYPES.find((t) => t.label === searchType);
  return (
    <Chip
      key={_searchType?.label}
      label={_searchType?.label}
      className={clsx(
        "chip",
        Boolean(onClick) && "onClick",
        !isDefault && "custom",
      )}
      size={size}
      onClick={onClick}
      color={
        isDefault ? "default" : (_searchType?.color as ChipOwnProps["color"])
      }
    />
  );
};

export default GospelChip;
