import TTCard from "@components/TTCard";
import SortIcon from "@mui/icons-material/Sort";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import TTIconButton from "@components/TTIconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import type { SortType } from "@constants/Types";
import { mild_box_shadow } from "@constants/Shadows";

type ListToolBarSortProps = {
  showSort?: boolean;
  sortType?: number;
  setSortType?: (state: number) => void;
  sortTypes?: SortType[];
};

type ListToolBarFilterProps = {
  showFilter?: boolean;
};

type ListToolBarSelectProps = {
  showSelect?: boolean;
  selected?: number[];
  // button options
  handlePublish?: (state: boolean) => void;
  handleDelete?: () => void;
};

type ListToolBarProps = ListToolBarSortProps &
  ListToolBarSelectProps &
  ListToolBarFilterProps;

const ListToolBar = ({
  // sort props
  showSort = false,
  sortType,
  setSortType,
  sortTypes,
  // filter props
  showFilter = false,
  // select props
  showSelect = false,
  selected = [],
  handlePublish,
  handleDelete,
}: ListToolBarProps) => {
  // others
  const selectButtonSx = { scale: 0.9, height: 32 };

  const isSelectedEmpty = () => selected.length === 0;

  const displayNumSelected = () =>
    isSelectedEmpty()
      ? "No item selected"
      : `${selected.length} ${selected.length > 1 ? "items" : "item"} selected`;

  // sort operations

  const handleSortChange = (e: SelectChangeEvent) => {
    if (setSortType) setSortType(Number.parseInt(e.target.value));
  };

  return (
    <Box display="flex" flexDirection="row" color="dimgrey">
      {showSort && (
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <SortIcon fontSize="small" />
          <Select
            value={sortType?.toString()}
            onChange={handleSortChange}
            size="small"
            sx={{
              height: 24,
              fontSize: ".8rem",
              borderRadius: 20,
              borderColor: "transparent",
              color: "dimgrey",
            }}
          >
            {sortTypes?.map((_sortType, i) => (
              <MenuItem
                key={i}
                value={i.toString()}
                sx={{
                  fontSize: ".8rem",
                }}
              >
                {_sortType.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
      {/* {showSort && (
        <TTCard
          color="black"
          bgcolor="white"
          title="Sort By"
          icon={<SortIcon />}
          sx={{
            background: "white",
            mt: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Select
            value={sortType?.toString()}
            onChange={handleSortChange}
            size="small"
            sx={{
              mt: 1,
              width: 160,
              fontSize: 14,
            }}
          >
            {sortTypes?.map((_sortType, i) => (
              <MenuItem key={i} value={i.toString()} sx={{ fontSize: 14 }}>
                {_sortType.label}
              </MenuItem>
            ))}
          </Select>
        </TTCard>
      )} */}
      {/* {showFilter && (
        <TTCard
          color="black"
          bgcolor="white"
          title="Filter"
          icon={<FilterAltIcon />}
          sx={{
            background: "white",
            mt: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          filter params
        </TTCard>
      )} */}
      {/* {showSelect && (
        <TTCard
          color="black"
          bgcolor="white"
          title="Selected"
          icon={<CheckCircleIcon />}
          sx={{
            background: "white",
            mt: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              fontStyle: isSelectedEmpty() ? "italic" : "none",
            }}
          >
            {displayNumSelected()} */}

            {/* select buttons */}
      {/* //       <Box display="flex" flexWrap="wrap" mt={1}>
      //         {handlePublish && (
      //           <TTIconButton
      //             size="small"
      //             onClick={() => handlePublish(true)}
      //             sx={{ ...selectButtonSx }}
      //           >
      //             <VisibilityIcon sx={{ mr: 1 }} /> Publish
      //           </TTIconButton>
      //         )}

      //         {handlePublish && (
      //           <TTIconButton
      //             size="small"
      //             onClick={() => handlePublish(false)}
      //             sx={{ ...selectButtonSx }}
      //           >
      //             <VisibilityOffIcon sx={{ mr: 1 }} /> Unpublish
      //           </TTIconButton>
      //         )}

      //         {handleDelete && (
      //           <TTIconButton
      //             size="small"
      //             onClick={handleDelete}
      //             color="error"
      //             sx={{ ...selectButtonSx, borderColor: "error.main" }}
      //           >
      //             <DeleteIcon sx={{ mr: 1 }} /> Delete
      //           </TTIconButton>
      //         )}
      //       </Box>
      //     </Box>
      //   </TTCard>
      // )} */}
    </Box>
  );
};

export default ListToolBar;
