import React, { useEffect, useMemo, useState } from "react";
import { TIMES_WITH_OFFSET } from "@constants/Times";
import { Box, Typography } from "@mui/material";
import TaoForm from "@components/Forms/TaoForm";
import TimeUtils from "@utils/TimeUtils";
import type { Tao } from "@services/taos";
import { enqueueSnackbar } from "notistack";
import clsx from "clsx";
import "./index.scss";

type DayScheduleProps = {
  dayIndex: number;
  dayId: number | undefined;
  taos: Tao[] | undefined;
  setTao: (state: Tao) => void;
  showHourMarkers?: boolean;
  setIsParentUpdated?: () => void;
};

const DaySchedule = ({
  dayIndex,
  dayId,
  taos,
  setTao,
  showHourMarkers = true,
  setIsParentUpdated,
}: DayScheduleProps) => {
  // behavior - index of time entries
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectTimeInterval, setSelectTimeInterval] = useState<number[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number>(0);
  const [firstIndex, setFirstIndex] = useState<number>(0); // set by first click
  // dialog
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  // taos
  const blockHeight = 15; // 15px each time interval block
  const [taoTimeIntervals, setTaoTimeIntervals] = useState<number[][]>([]);

  const occupiedSet = useMemo(() => {
    const set = new Set<number>();
    taoTimeIntervals.forEach(([start, end]) => {
      for (let i = start; i <= end; i++) set.add(i);
    });
    return set;
  }, [taoTimeIntervals]);

  const taoMap = useMemo(() => {
    const map = new Map<number, { tao: Tao; interval: [number, number] }>();
    taoTimeIntervals.forEach(([start, end], idx) => {
      if (taos?.[idx]) {
        const _end = end - (end === TIMES_WITH_OFFSET.length - 1 ? 1 : 0);
        map.set(start, { tao: taos[idx], interval: [start, _end] });
      }
    });
    return map;
  }, [taoTimeIntervals, taos]);

  // rerender taoTimeIntervals on taos
  useEffect(() => {
    if (taos === undefined || taos.length === 0) {
      setTaoTimeIntervals([]);
      return;
    }

    // in number [][], where each index stores [startId, endId] that corresponds to TIMES_WITH_OFFSET index
    const taoTimeIntervalIndexes = taos.map((tao) => {
      let start = TimeUtils.formatTimeHHmmssToHHmm(tao.start);
      let end = TimeUtils.formatTimeHHmmssToHHmm(tao.end);
      let endOfDay = TIMES_WITH_OFFSET[TIMES_WITH_OFFSET.length - 1].time;

      let startIndex = TIMES_WITH_OFFSET.findIndex(
        (timeEntry) => timeEntry.time === start
      );
      let endIndex =
        end === endOfDay
          ? TIMES_WITH_OFFSET.length - 1
          : TIMES_WITH_OFFSET.findIndex((timeEntry) => timeEntry.time === end) -
            1; // -1 to negate the effect of time ends after time interval index

      return [startIndex, endIndex];
    });

    setTaoTimeIntervals(taoTimeIntervalIndexes);
  }, [taos]);

  // user interactions

  const handleCloseDialog = () => {
    setIsOpen(false);
    setIsSelecting(false);
    setSelectTimeInterval([]);
  };

  const handleMouseLeaveDayScheduleBox = () => {
    setIsSelecting(false);
    setSelectTimeInterval([]);
  };

  const handleClickTimeEntryBox = (timeIndex: number) => {
    if (occupiedSet.has(timeIndex)) {
      enqueueSnackbar("This time slot is occupied.", { variant: "error" });
      return;
    }

    if (isSelecting) {
      // second click
      if (!isTimeIntervalSelectable(timeIndex)) {
        enqueueSnackbar("The time slots in between are occupied.", {
          variant: "error",
        });
        handleCloseDialog();
        return;
      }

      initDialog(firstIndex, timeIndex);
    } else {
      // first click
      setIsSelecting(true);
      setFirstIndex(timeIndex);

      initSelectTimeInterval(timeIndex);
    }
  };

  const initDialog = (_firstIndex: number, _secondIndex: number) => {
    // check if mouse selects time intervals from top to bottom or the other way around
    const isInOrder = _firstIndex <= _secondIndex;

    const firstTimeIndex = isInOrder ? _firstIndex : _secondIndex;
    const secondTimeIndex = (isInOrder ? _secondIndex : _firstIndex) + 1;

    setStart(TIMES_WITH_OFFSET[firstTimeIndex].time);
    setEnd(TIMES_WITH_OFFSET[secondTimeIndex].time);

    setIsOpen(true);
  };

  const isInBetween = (index: number) => {
    // make sure the first index is set
    if (!isSelecting) return;

    if (!isTimeIntervalSelectable(index)) return false;

    // mouse moves down
    if (firstIndex <= hoverIndex) {
      return index >= firstIndex && index <= hoverIndex;
    }
    // mouse moves up
    else {
      return index <= firstIndex && index >= hoverIndex;
    }
  };

  const formatTime = (time: string | undefined, showMinute?: boolean) => {
    if (!time) return;

    if (showMinute) {
      return TimeUtils.formatTimeHHmmTohmmA(time);
    } else {
      return TimeUtils.formatTimeHHmmTohA(time);
    }
  };

  const isTimeIntervalSelectable = (timeIndex: number) => {
    if (selectTimeInterval.length === 0) return true;

    return (
      timeIndex >= selectTimeInterval[0] && timeIndex <= selectTimeInterval[1]
    );
  };

  const initSelectTimeInterval = (timeIndex: number) => {
    let start = 0;
    let end = TIMES_WITH_OFFSET.length - 1;

    for (let index = 0; index < taoTimeIntervals.length; index++) {
      const [s, e] = taoTimeIntervals[index];

      if (timeIndex < s) {
        start = index > 0 ? taoTimeIntervals[index - 1][1] + 1 : 0;
        end = s - 1;
        break;
      }

      if (timeIndex > e) {
        // If last interval, free space goes until the end
        if (index === taoTimeIntervals.length - 1) {
          start = e + 1;
          end = TIMES_WITH_OFFSET.length - 1;
          break;
        }
      }
    }

    setSelectTimeInterval([start, end]);
  };

  // tao content action

  const handleClickTao = (e: React.MouseEvent<HTMLDivElement>, tao: Tao) => {
    e.stopPropagation();
    setTao(tao);
  };

  const getTaoContent = (timeIndex: number) => {
    const entry = taoMap.get(timeIndex);
    if (!entry) return null;

    const { tao, interval } = entry;
    const _interval = interval[1] - interval[0] + 1;
    const boxHeight = blockHeight * _interval;

    const startTime = TimeUtils.formatTimeHHmmssTohmmA(tao.start);
    const endTime = TimeUtils.formatTimeHHmmssTohmmA(tao.end);

    return (
        <Box
          className="day-schedule-tao-content-box"
          onClick={(e) => handleClickTao(e, tao)}
        >
          <Box height={boxHeight} className="day-schedule-tao-content">
            <Typography
              className="day-schedule-tao-title"
              sx={{ WebkitLineClamp: _interval }}
            >
              {tao.attraction.title}
            </Typography>
            <Typography className="day-schedule-tao-title">
              {startTime}-{endTime}
            </Typography>
          </Box>
        </Box>
    );
  };

  return (
    <Box
      className="day-schedule-box"
      onMouseLeave={handleMouseLeaveDayScheduleBox}
    >
      {TIMES_WITH_OFFSET.map(
        (timeEntry, i) =>
          i < TIMES_WITH_OFFSET.length - 1 && (
            <Box
              className={clsx(
                "day-schedule-time-interval-box",
                timeEntry.isHourly && "hourly",
                !occupiedSet.has(i) &&
                  (isInBetween(i) || (!isSelecting && hoverIndex === i)) &&
                  "highlight",
                occupiedSet.has(i) && "unclickable"
              )}
              key={`time-entry-${i}`}
              onClick={() => handleClickTimeEntryBox(i)}
              onMouseEnter={() => setHoverIndex(i)}
            >
              {/* tao content */}
              {getTaoContent(i)}

              {/* hourly time marker */}
              {showHourMarkers && timeEntry.isHourly ? (
                <Box className="day-schedule-time-marker-box">
                  <Typography className={clsx("day-schedule-time-marker")}>
                    {formatTime(timeEntry.time)}
                  </Typography>
                </Box>
              ) : (
                ""
              )}
            </Box>
          )
      )}

      <TaoForm
        open={isOpen}
        onClose={handleCloseDialog}
        dayIndex={dayIndex}
        dayId={dayId}
        start={start}
        end={end}
        setIsParentUpdated={setIsParentUpdated}
      />
    </Box>
  );
};

export default DaySchedule;
