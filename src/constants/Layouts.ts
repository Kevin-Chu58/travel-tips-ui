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
  WorkshopNavTabDivider: 1,
} as const;

// Header
export const Headers = Layouts.Header; // + Layouts.SubHeader;
// workshop - main
export const WorkshopToNameMt = Headers + Layouts.WorkshopNameMt;
export const WorkshopToName = WorkshopToNameMt + Layouts.WorkshopName;
export const WorkshopToNavTab = WorkshopToName + Layouts.WorkshopNavTab + Layouts.WorkshopNavTabDivider;
export const WorkshopToToolBar = WorkshopToNavTab + Layouts.WorkshopToolBar;

export default Layouts;
