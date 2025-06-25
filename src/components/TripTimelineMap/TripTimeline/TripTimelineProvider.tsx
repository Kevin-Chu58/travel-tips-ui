import { createContext, useContext } from "react";
import useTripTimelineLogic from "@components/TripTimelineMap/TripTimeline/useTripTimelineLogic"; // adjust path
import type { TripDetail } from "@services/trips";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";

type TripTimelineProviderProps = {
  children: React.ReactNode;
  trip?: TripDetail;
  queryKey: (string | undefined)[];
};

const TripTimelineContext = createContext<ReturnType<typeof useTripTimelineLogic> | null>(null);

export const TripTimelineProvider = ({ children, trip, queryKey }: TripTimelineProviderProps) => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const logic = useTripTimelineLogic({ trip, token, queryKey });

  return (
    <TripTimelineContext.Provider value={logic}>
      {children}
    </TripTimelineContext.Provider>
  );
};

export const useTripTimeline = () => {
  const context = useContext(TripTimelineContext);
  if (!context) throw new Error("useTripTimeline must be used within TripTimelineProvider");
  return context;
};