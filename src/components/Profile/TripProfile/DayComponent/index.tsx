import { Box, Divider } from "@mui/material";
import { type Day } from "@services/days";
import type { GeoCoordinate, NavTab } from "@constants/Types";
import { useIsMobile } from "@hooks/useIsMobile";
import DaySchedule from "@components/Schedule/DaySchedule";
import DayEvent from "@components/Schedule/DayEvent";
import type { Tao } from "@services/taos";
import TTTabs from "@components/TTTabs";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import TTButton from "@components/TTButton";
import ToolTip from "@components/ToolTip";
import TTIconButton from "@components/TTIconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import TaoForm from "@components/Forms/TaoForm";
import clsx from "clsx";
import "./index.scss";
import DeleteTaoForm from "@components/Forms/DeleteTaoForm";

type DayComponentProps = {
  day: Day | undefined;
  taos: Tao[] | undefined;
  setTao: (state: Tao) => void;
  asyncAddDayTaos: (state: Tao) => void;
  asyncEditDayTaos: (state: Tao) => void;
  asyncDeleteDayTaos: (tao: Tao | undefined) => void;
  lastGeoCoordinate?: GeoCoordinate | undefined;
  setLastGeoCoordinate?: (state: GeoCoordinate) => void;
  readonly?: boolean;
};

const DayComponent = ({
  day,
  taos,
  setTao,
  asyncAddDayTaos,
  asyncEditDayTaos,
  asyncDeleteDayTaos,
  lastGeoCoordinate,
  setLastGeoCoordinate,
  readonly = false,
}: DayComponentProps) => {
  // tao focused - in delete tao form
  const [taoFocus, setTaoFocus] = useState<Tao>();
  // open form status
  const [openForm, setOpenForm] = useState<"postTao" | "deleteTao" | null>(
    null,
  );

  // window
  const isMobile = useIsMobile();
  // view - nav tabs
  const [viewNavTabValue, setViewNavTabValue] = useState<number>(0);
  // behavior
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  // others
  const { dayId } = useParams(); // dayId - day index in days, not day.id
  const navigate = useNavigate();

  const viewNavTabs = useMemo(
    () =>
      [
        {
          name: "event",
          label: "Event",
        },
        {
          name: "calendar",
          label: "Calendar",
        },
      ] as NavTab[],
    [],
  );

  // handle functions

  const handleOpenTaoForm = useCallback(() => {
    setOpenForm("postTao");
  }, [setOpenForm]);

  const handleCloseForm = useCallback(() => {
    setOpenForm(null);
  }, [setOpenForm]);

  const handleDeleteMode = useCallback(() => {
    setDeleteMode((prev) => !prev);
  }, []);

  const handleDeleteTao = useCallback((e: MouseEvent, tao: Tao) => {
    e.stopPropagation();

    setTaoFocus(tao);
    setOpenForm("deleteTao");
  }, []);

  const handleUpdateDeleteTao = useCallback(() => {
    asyncDeleteDayTaos(taoFocus);
  }, [taoFocus, setTao, asyncDeleteDayTaos]);

  return (
    <React.Fragment>
      <Divider flexItem />

      <Box className="trip-profile-day-comp-content-box">
        {/* nav button back */}
        <TTButton
          className="nav-back-button"
          size="small"
          onClick={() => navigate(-1)}
          disableRipple
        >
          back
        </TTButton>

        {/* view nav tabs - switch variant */}
        <Box className="trip-profile-day-comp-view-tab-box">
          <TTTabs
            navTabs={viewNavTabs}
            navTabValue={viewNavTabValue}
            setNavTabValue={setViewNavTabValue}
            variant="switch"
          />
        </Box>

        {/* add day button */}
        {!readonly && (
          <Box className="row right">
            <ToolTip title="Add new event" offsetY={-8}>
              <Box>
                <TTIconButton size="small" onClick={handleOpenTaoForm} noBorder>
                  <AddIcon fontSize="small" />
                </TTIconButton>
              </Box>
            </ToolTip>
            <Divider orientation="vertical" variant="middle" flexItem />
            <ToolTip title="Delete event" offsetY={-8}>
              <Box>
                <TTIconButton size="small" onClick={handleDeleteMode} noBorder>
                  <RemoveIcon fontSize="small" />
                </TTIconButton>
              </Box>
            </ToolTip>
          </Box>
        )}

        {/* views */}
        <Box
          className={clsx(
            "trip-profile-day-comp-schedule-box",
            viewNavTabValue === 1 && "day-schedule",
            isMobile && "mobile",
          )}
        >
          {viewNavTabValue === 0 ? (
            <DayEvent
              taos={taos}
              setTao={setTao}
              deleteMode={deleteMode}
              onDeleteClick={handleDeleteTao}
            />
          ) : viewNavTabValue === 1 ? (
            <DaySchedule
              dayIndex={Number(dayId)}
              dayId={day?.id}
              taos={taos}
              setTao={setTao}
              asyncAddDayTaos={asyncAddDayTaos}
              asyncEditDayTaos={asyncEditDayTaos}
              lastGeoCoordinate={lastGeoCoordinate}
              setLastGeoCoordinate={setLastGeoCoordinate}
              deleteMode={deleteMode}
              onDeleteClick={handleDeleteTao}
              readonly={readonly}
            />
          ) : undefined}
        </Box>

        {openForm === "postTao" && (
          <TaoForm
            open
            onClose={handleCloseForm}
            dayIndex={Number(dayId)}
            dayId={day?.id}
            lastGeoCoordinate={lastGeoCoordinate}
            setLastGeoCoordinate={setLastGeoCoordinate}
            asyncAddDayTaos={asyncAddDayTaos}
            asyncEditDayTaos={asyncEditDayTaos}
          />
        )}

        {openForm === "deleteTao" && (
          <DeleteTaoForm
            open
            onClose={handleCloseForm}
            tao={taoFocus}
            setIsParentUpdated={handleUpdateDeleteTao}
          />
        )}
      </Box>
    </React.Fragment>
  );
};

export default DayComponent;
