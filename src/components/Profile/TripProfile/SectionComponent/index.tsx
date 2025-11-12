import ToolTip from "@components/ToolTip";
import TTIconButton from "@components/TTIconButton";
import TTTabs from "@components/TTTabs";
import { Box, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { NavTab } from "@constants/Types";
import React from "react";
import "./index.scss";

type SectionComponentProps = {
  navTabs: NavTab[];
  navTabValue: number;
  setNavTabValue: (state: number) => void;
  handlePostDay: () => void;
  isLoading: boolean;
  readonly?: boolean;
};

const SectionComponent = ({
  navTabs,
  navTabValue,
  setNavTabValue,
  handlePostDay,
  isLoading,
  readonly = false,
}: SectionComponentProps) => {
  return (
    <React.Fragment>
      {!isLoading && (
        <Box className="trip-profile-section-comp-nav-tab-box">
          <TTTabs
            navTabs={navTabs}
            navTabValue={navTabValue}
            setNavTabValue={setNavTabValue}
          />
        </Box>
      )}

      <Divider
        className="trip-profile-section-comp-divider"
        orientation="vertical"
        flexItem
        variant="middle"
      />

      {/* add day button */}
      {!readonly ? (
        <ToolTip title="Add new day" offsetY={-8}>
          <Box>
            <TTIconButton
              size="small"
              className="trip-profile-section-comp-add-day-button"
              onClick={handlePostDay}
            >
              <AddIcon fontSize="small" />
            </TTIconButton>
          </Box>
        </ToolTip>
      ) : undefined}
    </React.Fragment>
  );
};

export default SectionComponent;
