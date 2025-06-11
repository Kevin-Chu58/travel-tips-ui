import TTCard from "@components/TTCard";
import SortIcon from "@mui/icons-material/Sort";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import TTIconButton from "@components/TTIconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import { mild_box_shadow } from "@constants/Shadows";
import type { SortType } from "@constants/Types";

type ListToolSortProps = {
  showSort?: boolean;
  sortType?: number;
  setSortType?: (state: number) => void;
  sortTypes?: SortType[];
};

type ListToolFilterProps = {
  showFilter?: boolean;
};

type ListToolSelectProps = {
  showSelect?: boolean;
  selected?: number[];
  // button options
  handlePublish?: (state: boolean) => void;
  handleDelete?: () => void;
};

type ListToolProps = ListToolSortProps &
  ListToolSelectProps &
  ListToolFilterProps;

const ListTool = ({
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
}: ListToolProps) => {
  // others
  const selectButtonSx = { scale: 0.9, height: 32 };

  const isSelectedEmpty = () => selected.length === 0;

  const displayNumSelected = () =>
    selected.length === 0
      ? "No item selected"
      : `${selected.length} ${selected.length > 1 ? "items" : "item"} selected`;

  // sort operations

  const handleSortChange = (e: SelectChangeEvent) => {
    if (setSortType) setSortType(Number.parseInt(e.target.value));
  };

  return (
    <>
      {showSort && (
        <TTCard
          color="black"
          bgcolor="white"
          title="Sort By"
          icon={<SortIcon />}
          sx={{ background: "white", mt: 0, boxShadow: mild_box_shadow }}
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
      )}
      {showFilter && (
        <TTCard
          color="black"
          bgcolor="white"
          title="Filter"
          icon={<FilterAltIcon />}
          sx={{ background: "white", mt: 0, boxShadow: mild_box_shadow }}
        >
          filter params
        </TTCard>
      )}
      {showSelect && (
        <TTCard
          color="black"
          bgcolor="white"
          title="Selected"
          icon={<CheckCircleIcon />}
          sx={{
            background: "white",
            mt: 0,
            boxShadow: mild_box_shadow,
          }}
        >
          <Box
            sx={{
              fontStyle: isSelectedEmpty() ? "italic" : "none",
            }}
          >
            {displayNumSelected()}

            {/* select buttons */}
            <Box display="flex" flexWrap="wrap" mt={1}>
              {handlePublish && (
                <TTIconButton
                  size="small"
                  onClick={() => handlePublish(true)}
                  sx={{ ...selectButtonSx }}
                >
                  <VisibilityIcon sx={{ mr: 1 }} /> Publish
                </TTIconButton>
              )}

              {handlePublish && (
                <TTIconButton
                  size="small"
                  onClick={() => handlePublish(false)}
                  sx={{ ...selectButtonSx }}
                >
                  <VisibilityOffIcon sx={{ mr: 1 }} /> Unpublish
                </TTIconButton>
              )}

              {handleDelete && (
                <TTIconButton
                  size="small"
                  onClick={handleDelete}
                  color="error"
                  sx={{ ...selectButtonSx, borderColor: "error.main" }}
                >
                  <DeleteIcon sx={{ mr: 1 }} /> Delete
                </TTIconButton>
              )}
            </Box>
          </Box>
        </TTCard>
      )}
    </>
  );
};

export default ListTool;
