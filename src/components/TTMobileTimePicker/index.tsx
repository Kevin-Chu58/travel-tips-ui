import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import "./index.scss";

type TTMobileTimePickerProps = {
  value: Dayjs | undefined;
  setValue: (state: Dayjs | null) => void;
  minTime?: Dayjs | undefined;
  maxTime?: Dayjs | undefined;
  minutesStep?: number;
};

const TTMobileTimePicker = ({
  value,
  setValue,
  minTime,
  maxTime,
  minutesStep = 1,
}: TTMobileTimePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileTimePicker
        className="tt-mobile-time-picker"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        minTime={minTime}
        maxTime={maxTime}
        minutesStep={minutesStep}
      />
    </LocalizationProvider>
  );
};

export default TTMobileTimePicker;
