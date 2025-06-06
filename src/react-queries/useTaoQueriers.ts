import type { TaoId, TaoParams } from "@constants/Types";
import { daysService, type Day } from "@services/days";
import type { TripDetail } from "@services/trips";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SortUtils from "@utils/SortUtils";
import TripUtils from "@utils/TripUtils";

const toTaoForm = (dayId: number, taoParams: TaoParams) => ({
  dayId,
  ...taoParams,
});

export const useTaoMutations = ({
  trip,
  // taos,
  token,
  editDay,
  // editTao,
  queryKey,
}: {
  trip?: TripDetail | null;
  // taos?: TripAttractionOrder[];
  token?: string | null;
  editDay?: number;
  // editTao?: number;
  queryKey: (string | undefined)[];
}) => {
  const queryClient = useQueryClient();

  const mutationAddTao = useMutation({
    mutationFn: async (params: TaoParams) => {
      if (!editDay || !token) throw new Error("Missing trip or token");
      return await daysService.postNewTao(toTaoForm(editDay, params), token);
    },
    onSuccess: (taos) => {
      if (!trip) return;
      
      // Deep clone the trip.days array
      const newDays = trip.days?.map((day) => ({
        ...day,
        tripAttractionOrders: [...(day.tripAttractionOrders ?? [])],
      }));

      // Find the index and update the specific day's TAOs
      const newDayIndex = newDays?.findIndex((day) => day.id === editDay);
      if (newDayIndex !== undefined && newDayIndex !== -1) {
        newDays![newDayIndex] = {
          ...newDays![newDayIndex],
          tripAttractionOrders: [...taos],
        };
      }

      queryClient.setQueryData(queryKey, (old: TripDetail) => ({
        ...old,
        days: newDays,
      }));
    },
  });

  const mutationUpdateTao = useMutation({
    mutationFn: async (params: TaoParams) => {
      if (!editDay || !token || !params.id) throw new Error("Missing data");
      return await daysService.patchTao(
        params.id,
        toTaoForm(editDay, params),
        token
      );
    },
    onSuccess: (taos) => {
      if (!trip) return;

      // Deep copy of days
      let newDays = (trip.days || []).map(
        (day) =>
          ({
            ...day,
            tripAttractionOrders: [...(day.tripAttractionOrders || [])],
          } as Day)
      );

      // Find and update specific day
      let newDayIndex = TripUtils.getDayIndex(newDays, editDay);
      if (newDayIndex != null) {
        newDays[newDayIndex] = {
          ...newDays[newDayIndex],
          tripAttractionOrders: [...taos], // ensure taos is cloned too
        };
      }
      
      newDays = SortUtils.sortIdAsc(newDays);

      queryClient.setQueryData(queryKey, (old: TripDetail) => ({
        ...old,
        days: newDays,
      }));
    },
  });

  const mutationRemoveTao = useMutation({
    mutationFn: async ({ id }: TaoId) => {
      if (!token || !id) throw new Error("Missing token or id");
      return await daysService.deleteTao(id, token);
    },
    onMutate: async ({ id }) => {
      if (!trip || !id) return;

      const previousTrip = queryClient.getQueryData(queryKey);

      // Deep copy the days array and each day's tripAttractionOrders
      const updatedDays = (trip.days ?? []).map((day) => ({
        ...day,
        tripAttractionOrders: [...(day.tripAttractionOrders ?? [])],
      }));

      // Find and update the correct day's TAOs
      const index = updatedDays.findIndex((day) => day.id === editDay);
      if (index !== -1) {
        const existing = updatedDays[index];
        updatedDays[index] = {
          ...existing,
          tripAttractionOrders: existing.tripAttractionOrders?.filter(
            (tao) => tao.id !== id
          ),
        };
      }

      queryClient.setQueryData(queryKey, (old: TripDetail) => ({
        ...old,
        days: updatedDays,
      }));

      return { previousTrip };
    },
    onError: (_err, _params, context) => {
      if (context?.previousTrip) {
        queryClient.setQueryData(queryKey, context.previousTrip);
      }
    },
  });

  return {
    mutationAddTao,
    mutationUpdateTao,
    mutationRemoveTao,
  };
};
