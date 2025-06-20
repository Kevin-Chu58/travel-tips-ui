import type { TripDetail } from "@services/trips";
import { useEffect, useState } from "react";
import type { Day } from "@services/days";
import TimeUtils from "@utils/TimeUtils";
import dayjs from "dayjs";
import { useDayMutations } from "@react-queries/useDayQueries";
import { type DayFormParams } from "@constants/Types";
import TripUtils from "@utils/TripUtils";
import { getDayCummulatedTimes, isDayUnchanged, isDayValid } from "./utils";

type useTripTimelineLogicProps = {
  trip: TripDetail | undefined;
  token: string | null;
  queryKey: (string | undefined)[];
};

/**
 * A react hook for TripTimeline, simply apply the props and get all the states and methods in return
 */
const useTripTimelineLogic = ({
  trip,
  token,
  queryKey,
}: useTripTimelineLogicProps) => {
  const startDefault = dayjs().hour(8).minute(0).second(0);
  const endDefault = dayjs().hour(20).minute(0).second(0);
  // open form status
  const [addDay, setAddDay] = useState<boolean>(false);
  const [editDay, setEditDay] = useState<number | undefined>();
  const [deleteDay, setDeleteDay] = useState<Day | undefined>();
  const [openEditTao, setOpenEditTao] = useState<boolean>(false);
  // day form attributes
  const [dayFormData, setDayFormData] = useState<DayFormParams>({
    name: undefined,
    description: undefined,
    start: null,
    end: null,
  });
  const [errorParams, setErrorParams] = useState<string[]>([]);
  // tao form attributes
  const [editTao, setEditTao] = useState<number | undefined>();
  const [editTaoOrder, setEditTaoOrder] = useState<number>(0);
  // acummulated times in days
  const [dayAcummulatedTimes, setDayAcummulatedTimes] = useState<string[][]>(
    []
  );

  const { mutationAddDay, mutationUpdateDay, mutationRemoveDay } =
    useDayMutations({
      trip,
      token,
      editDay,
      queryKey,
    });

  /** useEffect */

  // rerender on addDay to update day form attributes
  useEffect(() => {
    if (addDay) initAddDayForm();
    else clearDayForm();
  }, [addDay]);

  // rerender on editDay to update day form attributes
  useEffect(() => {
    if (editDay) initEditDayForm(TripUtils.getDayFromTrip(trip, editDay));
    else clearDayForm();
  }, [editDay]);

  useEffect(() => {
    setDayAcummulatedTimes(getDayCummulatedTimes(trip));
  }, [trip]);

  const handleUpdateDay = async () => {
    let invalidParams = isDayValid(dayFormData);
    if (invalidParams.length > 0) setErrorParams(invalidParams);
    else {
      if (!isDayUnchanged(dayFormData, trip, editDay))
        mutationUpdateDay.mutate({
          id: editDay,
          ...dayFormData,
        });
      setEditDay(undefined);
    }
  };

  const handleDeleteDay = async (id: number) => {
    mutationRemoveDay.mutate({ id });
    setDeleteDay(undefined);
  };

  const handleDayFormChange = (key: string, value: any) =>
    setDayFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

  /** edit day */

  const initAddDayForm = () => {
    setDayFormData({
      ...dayFormData,
      start: startDefault,
      end: endDefault,
    });
  };

  const initEditDayForm = (day: Day | undefined) => {
    if (day) {
      setEditDay(day.id);
      setDayFormData({
        name: day.name,
        description: day.description,
        start: TimeUtils.stringToDayjs(day.start),
        end: TimeUtils.stringToDayjs(day.end),
      });
    }
  };

  const clearDayForm = () => {
    // close all day forms
    setAddDay(false);
    setEditDay(undefined);

    setDayFormData({
      name: undefined,
      description: undefined,
      start: null,
      end: null,
    });
  };

  const handleAddDay = async () => {
    let invalidParams = isDayValid(dayFormData);
    if (invalidParams.length > 0) setErrorParams(invalidParams);
    else {
      mutationAddDay.mutate({ ...dayFormData });
      clearDayForm();
    }
  };

  /** edit tao */

  const updateOpenEditTao = (taoId: number | undefined, order?: number) => {
    setEditTao(taoId);
    setEditTaoOrder(order ?? 0);
    setOpenEditTao(true);
  };

  return {
    // day
    addDay,
    setAddDay,
    editDay,
    setEditDay,
    deleteDay,
    setDeleteDay,
    dayFormData,
    handleDayFormChange,
    errorParams,
    handleAddDay,
    handleUpdateDay,
    handleDeleteDay,
    // tao
    editTao,
    editTaoOrder,
    openEditTao,
    setOpenEditTao,
    updateOpenEditTao,
    // utils
    clearDayForm,
    dayAcummulatedTimes,
  };
};

export default useTripTimelineLogic;
