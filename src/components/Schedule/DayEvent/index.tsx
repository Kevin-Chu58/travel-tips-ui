import { Box, Chip, Divider, Typography } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Tao } from "@services/taos";
import TimeUtils from "@utils/TimeUtils";
import { useIsMobile } from "@hooks/useIsMobile";
import React from "react";
import clsx from "clsx";
import "./index.scss";

type DayEventProps = {
  taos: Tao[] | undefined;
  setTao: (state: Tao) => void;
};

const DayEvent = ({ taos, setTao }: DayEventProps) => {
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
            {i > 0 ? <Divider/> : undefined}

            {/* event content */}
            <Box
              className={clsx(
                  "day-event-event-box",
                  isMobile && "mobile"
                )}
              onClick={(e) => handleClickTao(e, tao)}
            >
              <Box>
                <Typography variant="h6">
                  {startTime} - {endTime}
                </Typography>
                <Typography>{tao.attraction.title}</Typography>
                {/* attraction category */}
                {tao.attraction?.category ? (
                  <Chip
                    className="day-event-event-category"
                    size="small"
                    label={<Typography variant="caption">{tao.attraction.category}</Typography>}
                  />
                ) : undefined}

                <Box className="day-event-arrow-box">
                  <ArrowForwardIcon/>
                </Box>
              </Box>
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default DayEvent;
