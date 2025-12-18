// import TTCard from "@components/TTCard";
import SortIcon from "@mui/icons-material/Sort";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  Select,
  // Tooltip,
  // Typography,
  type SelectChangeEvent,
} from "@mui/material";
// import TTIconButton from "@components/TTIconButton";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import DeleteIcon from "@mui/icons-material/Delete";
import type { SortType } from "@constants/Types";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
// import { mild_box_shadow } from "@constants/Shadows";
import { type JSX } from "react";
import ToolTip from "@components/ToolTip";
import "./index.scss";

type ListToolSortProps = {
  showSort?: boolean;
  sortType?: number;
  setSortType?: (state: number) => void;
  sortTypes?: SortType[];
};

type ListToolSelectProps = {
  showSelect?: boolean;
  selected?: number[];
  // button options
  handlePublish?: (state: boolean) => void;
  handleDelete?: () => void;
};

type ListToolFilterProps = {
  showFilter?: boolean;
};

type ListToolAddProps = {
  addOnClick?: () => void;
  addInput?: JSX.Element;
  addIcon?: "add" | "upload";
  addLabel?: string;
  otherButtons?: JSX.Element[];
};

type ListToolProps = ListToolSortProps &
  ListToolSelectProps &
  ListToolFilterProps &
  ListToolAddProps;

const addIconMap: Record<string, JSX.Element> = {
  add: <AddIcon />,
  upload: <UploadIcon />,
};

const ListTool = ({
  // sort props
  showSort = false,
  sortType,
  setSortType,
  sortTypes,
  // add props
  addOnClick,
  addInput,
  addIcon = "add",
  addLabel,
  otherButtons,
}: // filter props
// showFilter = false,
// select props
// showSelect = false,
// selected = [],
// handlePublish,
// handleDelete,
ListToolProps) => {
  // others
  // const selectButtonSx = { scale: 0.9, height: 32 };

  // const isSelectedEmpty = () => selected.length === 0;

  // const displayNumSelected = () =>
  //   isSelectedEmpty()
  //     ? "No item selected"
  //     : `${selected.length} ${selected.length > 1 ? "items" : "item"} selected`;

  // sort operations

  const addSvgIcon = addIconMap[addIcon] ?? null;

  const handleSortChange = (e: SelectChangeEvent) => {
    if (setSortType) setSortType(Number.parseInt(e.target.value));
  };

  return (
    <Box className="list-tool-container">
      {showSort && (
        <Box className="list-tool-sort-container">
          <SortIcon fontSize="small" />
          <Select
            className="list-tool-sort-select"
            value={sortType?.toString()}
            onChange={handleSortChange}
            size="small"
          >
            {sortTypes?.map((_sortType, i) => (
              <MenuItem
                key={_sortType.label}
                value={i.toString()}
                className="list-tool-sort-select-item"
              >
                {_sortType.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
      {addOnClick ? (
        <Box className="list-tool-button-container">
          <Divider orientation="vertical" variant="middle" flexItem />
          <Box>
            <ToolTip title={addLabel} offsetY={-8}>
              <IconButton size="small" onClick={addOnClick}>
                {addSvgIcon}
                {addInput}
              </IconButton>
            </ToolTip>
            {/** display other buttons */}
            {otherButtons?.map(button => button)}
          </Box>
        </Box>
      ) : undefined}
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

export default ListTool;
