// use the fixed heights for easy sticky behavior
const Layouts = {
  // Header
  Header: 64,
  SubHeader: 32,
  // workshop - edit trip
  WorkshopTripName: 40,
  WorkshopTripNameMt: 16,
  WorkshopNavTab: 48,
  workshopDayToolBar: 36,
} as const;

// Header
export const Headers = Layouts.Header + Layouts.SubHeader;
// workshop - edit trip
export const WorkshopToTripName = Headers + Layouts.WorkshopTripName + Layouts.WorkshopTripNameMt;
export const WorkshopToNavTab = WorkshopToTripName + Layouts.WorkshopNavTab;
export const WorkShopToDayToolBar = WorkshopToNavTab + Layouts.workshopDayToolBar;

export default Layouts;
