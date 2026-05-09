import { Box } from "@mui/material";
import FormBase from "../FormBases/FormBase";
import type { Trip } from "@services/trips";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import OverviewPdfPage from "./OverviewPdfPage";
import DayPdfPage from "./DayPdfPage";
import type { Marker } from "@constants/Types";
import type { Day } from "@services/days";
import type { Tao } from "@services/taos";
import type { HereRoutingResponse } from "@services/hereMap/hereMap";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import DownloadIcon from "@mui/icons-material/Download";
import { useCallback, useEffect, useMemo, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { usersService } from "@services/users";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import ProgressBar from "@components/ProgressBar";
import { setUser } from "@redux/userSlice";
import "./index.scss";

type TripPdfFormProps = {
  open: boolean;
  onClose: () => void;
  trip: Trip | undefined;
  days: Day[];
  taosMapRef: React.RefObject<Map<number, Tao[]>>;
  routeResponsesMapRef: React.RefObject<Map<number, HereRoutingResponse[]>>;
  geoMarkers: Marker[] | undefined;
  fetchAllDays: () => Promise<void>;
};

const A4_WIDTH = 210;
const A4_HEIGHT = 297;

const TripPdfForm = ({
  open,
  onClose,
  trip,
  days,
  taosMapRef,
  routeResponsesMapRef,
  geoMarkers,
  fetchAllDays,
}: TripPdfFormProps) => {
  const userSubExtend = useSelector(
    (state: RootState) => state.user.userSubExtend,
  );
  const dispatch = useDispatch();
  const [isDownloading, setIsDownLoading] = useState<boolean>(false);
  const [allDaysFetched, setAllDaysFetched] = useState(false);

  // derived from userSubExtend — no need for separate state
  const current = userSubExtend?.pdfDownloadCount ?? 0;
  const max = userSubExtend?.maxPdfDownloadCount ?? 0;

  useEffect(() => {
    if (open) {
      setAllDaysFetched(false);
      fetchAllDays().then(() => setAllDaysFetched(true));
    }
  }, [open, fetchAllDays]);

  const subTitleContent = useMemo(
    () => (
      <Box className="row primary">
        <LocalActivityIcon fontSize="small" /> Member Only
      </Box>
    ),
    [],
  );

  const actionButtonStartIcon = useMemo(() => <DownloadIcon />, []);

  const handleClose = useCallback(() => {
    if (!isDownloading) onClose();
  }, [isDownloading, onClose]);

  const handleDownloadPdf = useCallback(async () => {
    setIsDownLoading(true);

    try {
      enqueueSnackbar("Generating the PDF may take a few minutes.", {
        variant: "info",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pages = document.querySelectorAll(".pdf-page");

      // then add to PDF sequentially
      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i] as HTMLElement;

        const dataUrl = await toPng(pageEl, {
          quality: 1,
          pixelRatio: 2,
          skipFonts: true,
          filter: (node) => !node.classList?.contains("map-box"),
        });

        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataUrl, "PNG", 0, 0, A4_WIDTH, A4_HEIGHT);

        const links = pageEl.querySelectorAll("a");
        const rootRect = pageEl.getBoundingClientRect();

        links.forEach((link) => {
          const linkRect = link.getBoundingClientRect();
          const x =
            ((linkRect.left - rootRect.left) / rootRect.width) * pdfWidth;
          const y =
            ((linkRect.top - rootRect.top) / rootRect.height) * pdfHeight;
          const w = (linkRect.width / rootRect.width) * pdfWidth;
          const h = (linkRect.height / rootRect.height) * pdfHeight;
          pdf.link(x, y, w, h, { url: link.href });
        });

        if (i < pages.length - 1) pdf.addPage();

        await new Promise((resolve) => setTimeout(resolve, 50));

        enqueueSnackbar(`Processed page ${i + 1} of ${pages.length}`, {
          variant: "info",
        });
      }

      setIsDownLoading(false);
      pdf.save(`${trip?.title ?? "trip"}.pdf`);

      if (userSubExtend) {
        dispatch(
          setUser({
            userSubExtend: {
              ...userSubExtend,
              pdfDownloadCount: userSubExtend.pdfDownloadCount + 1,
            },
          }),
        );
      }

      await usersService.generatePdf();
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
      setIsDownLoading(false);
      return;
    }
  }, [trip, userSubExtend, dispatch]);

  const dayPages = useMemo(
    () =>
      days.map((day, i) => (
        <DayPdfPage
          key={`day-pdf-${day.id}`}
          dayIndex={i}
          taos={taosMapRef.current.get(day.id)}
          routingResponses={routeResponsesMapRef.current.get(day.id)}
        />
      )),
    [days, allDaysFetched],
  );

  return (
    <FormBase
      className="trip-pdf-form"
      open={open}
      onClose={handleClose}
      width="60vw"
      height="80vh"
      maxHeight="80vh"
      title="Preview PDF"
      subTitle={subTitleContent}
      actionButtonLabel="download PDF"
      actionButtonStartIcon={actionButtonStartIcon}
      actionButtonOnClick={handleDownloadPdf}
      isLoading={isDownloading}
      panel
    >
      <Box className="column">
        <ProgressBar current={current} max={max} object="PDFs" />
        <Box className="pdf-pages-box">
          <OverviewPdfPage
            key={geoMarkers?.length}
            trip={trip}
            markers={geoMarkers}
          />
          {dayPages}
        </Box>
      </Box>
    </FormBase>
  );
};

export default TripPdfForm;
