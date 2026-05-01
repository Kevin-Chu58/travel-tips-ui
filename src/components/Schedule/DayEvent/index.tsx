import { Box, Chip, Divider, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { Tao } from "@services/taos";
import TimeUtils from "@utils/TimeUtils";
import { useIsMobile } from "@hooks/useIsMobile";
import LockIcon from "@mui/icons-material/Lock";
import ToolTip from "@components/ToolTip";
import TTIconButton from "@components/TTIconButton";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import clsx from "clsx";
import "./index.scss";

type DayEventProps = {
  taos: Tao[] | undefined;
  setTao: (state: Tao) => void;
  deleteMode: boolean;
  onDeleteClick: (e: any, state: Tao) => void;
};

const DayEvent = ({
  taos,
  setTao,
  deleteMode,
  onDeleteClick,
}: DayEventProps) => {
  // others
  const isMobile = useIsMobile();

  // tao content action

  const handleClickTao = (e: React.MouseEvent<HTMLDivElement>, tao: Tao) => {
    e.stopPropagation();
    setTao(tao);
  };

  return (
    <Box className="day-event-container-box">
      {taos?.map((tao, i) => {
        const startTime = TimeUtils.formatTimeHHmmssTohmmA(tao.start);
        const endTime = TimeUtils.formatTimeHHmmssTohmmA(tao.end);

        return (
          <React.Fragment key={tao.id}>
            {/* event routing */}
            {i > 0 ? <Divider /> : undefined}

            {/* event content */}
            <Box
              className={clsx("event-box", isMobile && "mobile")}
              onClick={(e) => handleClickTao(e, tao)}
            >
              {/* time & privacy status */}
              <Box className="time-box">
                <Typography variant="h6">
                  {startTime} - {endTime}
                </Typography>
                {tao.isPrivate ? (
                  <ToolTip
                    title="Only visible to you and shared users"
                    offsetY={-4}
                  >
                    <LockIcon />
                  </ToolTip>
                ) : undefined}
              </Box>
              <Typography>{tao.attraction.title}</Typography>
              {/* attraction category */}
              {tao.attraction?.category ? (
                <Box>
                  <Chip
                    className="event-category"
                    size="small"
                    label={
                      <Typography variant="caption">
                        {tao.attraction.category}
                      </Typography>
                    }
                  />
                </Box>
              ) : undefined}

              <Box className="arrow-box">
                <ArrowForwardIcon />
              </Box>

              {deleteMode && (
                <Box className="delete-box">
                  <TTIconButton
                    className="delete-icon-button"
                    onClick={(e) => onDeleteClick(e, tao)}
                    noBorder
                  >
                    <ClearIcon />
                  </TTIconButton>
                </Box>
              )}
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default DayEvent;
