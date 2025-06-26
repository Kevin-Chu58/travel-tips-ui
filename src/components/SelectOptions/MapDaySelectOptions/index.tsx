import type { Day } from "@services/days";
import SelectOptionsBase from "../SelectOptionsBase";
import type { SelectType } from "@constants/Types";
import type { SxProps } from "@mui/material";
import { mild_box_shadow } from "@constants/Shadows";

type MapDaySelectOptionsProps = {
  days: Day[];
  onDay: Day | undefined;
  setOnDay: (state: Day | undefined) => void;
  isLocked?: boolean;
  setIsLocked?: (state: boolean) => void;
  sx?: SxProps;
};

const MapDaySelectOptions = ({
  days,
  onDay,
  setOnDay,
  isLocked,
  setIsLocked,
  sx,
}: MapDaySelectOptionsProps) => {
  const options = days.map((day, i) => {
    return {
      item: day,
      label: `Day ${i + 1}`,
    } as SelectType;
  });

  const defaultOption = {
    item: undefined,
    label: "All",
  } as SelectType;

  const optionIndex = onDay
    ? options.findIndex((option) => option.item.id === onDay.id) + 1
    : 0;

  return (
    <SelectOptionsBase
      options={options}
      setOptionFocus={setOnDay}
      defaultOption={defaultOption}
      optionIndex={optionIndex}
      isLocked={isLocked}
      setIsLocked={setIsLocked}
      lockedLabel="lock/unlock focusing on day when hover on timeline"
      showIsLocked
      sx={sx}
      selectSx={{
        width: 100,
        bgcolor: "white",
        boxShadow: mild_box_shadow,
      }}
    />
  );
};

export default MapDaySelectOptions;
