import { useMutation, useQueryClient } from "@tanstack/react-query";
import { daysService } from "@services/days";
import TimeUtils from "@utils/TimeUtils";
import type { TripDetail } from "@services/trips";
import type { DayId, DayParams } from "@constants/Types";

const toDayForm = (tripId: number, { name, description, start, end }: DayParams) => ({
  tripId,
  name,
  description,
  start: TimeUtils.dayjsToString(start),
  end: TimeUtils.dayjsToString(end),
});

export const useDayMutations = ({
  trip,
  token,
  editDay,
  queryKey,
}: {
  trip?: TripDetail | null;
  token?: string | null;
  editDay?: number;
  queryKey: (string | undefined)[];
}) => {
  const queryClient = useQueryClient();

  const mutationAddDay = useMutation({
    mutationFn: async (params: DayParams) => {
      if (!trip || !token) throw new Error("Missing trip or token");
      return await daysService.postNewDay(toDayForm(trip.id, params), token);
    },
    onSuccess: (day) => {
      if (!trip) return;
      const newDays = [...(trip.days || []), day];
      queryClient.setQueryData(queryKey, (old: TripDetail) => ({
        ...old,
        days: newDays,
      }));
    },
  });

  const mutationUpdateDay = useMutation({
    mutationFn: async (params: DayParams) => {
      if (!trip || !token || !params.id) throw new Error("Missing data");
      return await daysService.patchDay(params.id, toDayForm(trip.id, params), token);
    },
    onMutate: async (params) => {
      if (!trip || !params.id) return;
      const previousTrip = queryClient.getQueryData(queryKey);
      const updatedDays = [...(trip.days || [])];
      const index = updatedDays.findIndex((d) => d.id === editDay);
      const existing = updatedDays[index];
      if (!existing) return;

      updatedDays[index] = {
        ...existing,
        name: params.name,
        description: params.description,
        start: TimeUtils.dayjsToString(params.start) ?? existing.start,
        end: TimeUtils.dayjsToString(params.end) ?? existing.end,
      };

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
    onSuccess: (updatedDay) => {
      if (!trip) return;
      const updatedDays = [...(trip.days || [])];
      const index = updatedDays.findIndex((d) => d.id === editDay);
      if (index === -1) return;

      updatedDay.tripAttractionOrders =
        updatedDays[index].tripAttractionOrders;

      updatedDays[index] = updatedDay;

      queryClient.setQueryData(queryKey, (old: TripDetail) => ({
        ...old,
        days: updatedDays,
      }));
    },
  });

  const mutationRemoveDay = useMutation({
    mutationFn: async ({ id }: DayId) => {
      if (!token || !id) throw new Error("Missing token or id");
      return await daysService.deleteDay(id, token);
    },
    onMutate: async ({ id }) => {
      if (!trip || !id) return;
      const previousTrip = queryClient.getQueryData(queryKey);
      const updatedDays = (trip.days || []).filter((d) => d.id !== id);

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
    mutationAddDay,
    mutationUpdateDay,
    mutationRemoveDay,
  };
}
