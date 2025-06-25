import { type SxProps } from "@mui/material";
import { type TripDetail } from "@services/trips";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TripTimelineMap } from "@components/TripTimelineMap";

dayjs.extend(customParseFormat);

type TripDaysProps = {
  trip: TripDetail | undefined;
  queryKey: (string | undefined)[];
  navTabValue?: number;
  readonly?: boolean;
  sx?: SxProps;
};

const TripDays = ({ trip, queryKey, sx }: TripDaysProps) => {
  return (
    <TripTimelineMap.TripTimelineMapEdit
      trip={trip}
      queryKey={queryKey}
      sx={sx}
    />
  );
};

export default TripDays;
