import {
  LocalizationProvider,
  MobileTimePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import "./index.scss";
import { useIsMobile } from "@hooks/useIsMobile";

type TTMobileTimePickerProps = {
  value: Dayjs | undefined;
  setValue: (state: Dayjs | null) => void;
  minTime?: Dayjs | undefined;
  maxTime?: Dayjs | undefined;
  minutesStep?: number;
};

const TTTimePicker = ({
  value,
  setValue,
  minTime,
  maxTime,
  minutesStep = 1,
}: TTMobileTimePickerProps) => {
  const isMobile = useIsMobile();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {isMobile ? (
        <MobileTimePicker
          className="tt-time-picker"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          minTime={minTime}
          maxTime={maxTime}
          minutesStep={minutesStep}
        />
      ) : (
        <TimePicker
          className="tt-time-picker"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          minTime={minTime}
          maxTime={maxTime}
          minutesStep={minutesStep}
        />
      )}
    </LocalizationProvider>
  );
};

export default TTTimePicker;
