import ListToolBar from "@components/ListTool";
import { Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { useEffect } from "react";
import type { ListToolButton } from "@constants/Types";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import "./index.scss";

type HighlightsToolProps = {
  addOnClick: () => void;
  getMyAttractions: () => void;
  showHovers: boolean;
  setShowHovers: React.Dispatch<React.SetStateAction<boolean>>;
};

const HighlightsTool = ({
  addOnClick,
  getMyAttractions,
  showHovers,
  setShowHovers,
}: HighlightsToolProps) => {
  // user
  const user = useSelector((state: RootState) => state.user);

  // rerender on access token
  useEffect(() => {
    if (user.id) {
      getMyAttractions();
    }
  }, [user?.id]);

  const showHoverButton: ListToolButton = {
    label: showHovers ? "Hide Details" : "Show Details",
    icon: showHovers ? VisibilityIcon : VisibilityOffIcon,
    onClick: () => setShowHovers((prev) => !prev),
  };

  return (
    <Box className="workshop-main-content-highlights-tool-container">
      <ListToolBar
        showFilter
        addOnClick={addOnClick}
        addLabel="New Highlight"
        otherButtons={[showHoverButton]}
      />
    </Box>
  );
};

export default HighlightsTool;
