// use the fixed heights for easy sticky behavior
const Layouts = {
  // Header
  Header: 64,
  SubHeader: 32,
  // workshop - main
  WorkshopName: 40,
  WorkshopNameMt: 16,
  WorkshopNavTab: 48,
  WorkshopToolBar: 32,
  // workshop - edit trip
  WorkshopTripName: 40,
  WorkshopTripNameMt: 16,
} as const;

// Header
export const Headers = Layouts.Header; // + Layouts.SubHeader;
// workshop - main
export const WorkshopToName = Headers + Layouts.WorkshopName + Layouts.WorkshopNameMt;
export const WorkshopToNavTab = WorkshopToName + Layouts.WorkshopNavTab;
export const WorkshopToToolBar = WorkshopToNavTab + Layouts.WorkshopToolBar;
// workshop - edit trip
export const WorkshopToTripName = Headers + Layouts.WorkshopTripName + Layouts.WorkshopTripNameMt;

export default Layouts;
