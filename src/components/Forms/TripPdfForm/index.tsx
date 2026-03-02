import { Box } from "@mui/material";
import FormBase from "../FormBase";
import type { Trip } from "@services/trips";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import OverviewPdfPage from "./OverviewPdfPage";
import DayPdfPage from "./DayPdfPage";
import type { Marker } from "@constants/Types";
import type { Day } from "@services/days";
import type { Tao } from "@services/taos";
import type { HereRoutingResponse } from "@services/hereMap/hereMap";
import DownloadIcon from "@mui/icons-material/Download";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import "./index.scss";

type TripPdfFormProps = {
  open: boolean;
  onClose: () => void;
  tripRef: React.RefObject<Trip | undefined>;
  days: Day[];
  taosMap: Map<number, Tao[]> | undefined;
  routeResponsesMap: Map<number, HereRoutingResponse[]> | undefined;
  geoMarkers: Marker[] | undefined;
  fetchAllDays: () => void;
};

const A4_WIDTH = 210;
const A4_HEIGHT = 297;

const TripPdfForm = ({
  open,
  onClose,
  tripRef,
  days,
  taosMap,
  routeResponsesMap,
  geoMarkers,
  fetchAllDays,
}: TripPdfFormProps) => {
  // behavior
  const [isDownloading, setIsDownLoading] = useState<boolean>(false);

  // enforce all details to trip on opening the form
  useEffect(() => {
    if (open) fetchAllDays();
  }, [open]);

  // enfore rerender on taosMap, since taosMap does not trigger UI update because it's a map
  useEffect(() => {}, [taosMap?.keys.length]);

  const handleDownloadPdf = async () => {
    setIsDownLoading(true);
    enqueueSnackbar("Generating the PDF may take a few minutes.", {
      variant: "info",
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pages = document.querySelectorAll(".pdf-page");

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i] as HTMLElement;

      // 1. Capture image
      const dataUrl = await toPng(pageEl, {
        quality: 1,
        pixelRatio: 2,
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, A4_WIDTH, A4_HEIGHT);

      // 2. Manually find and add links
      const links = pageEl.querySelectorAll("a");
      const rootRect = pageEl.getBoundingClientRect();

      links.forEach((link) => {
        const linkRect = link.getBoundingClientRect();

        // Calculate relative position (0 to 1 scale)
        const x = ((linkRect.left - rootRect.left) / rootRect.width) * pdfWidth;
        const y = ((linkRect.top - rootRect.top) / rootRect.height) * pdfHeight;
        const w = (linkRect.width / rootRect.width) * pdfWidth;
        const h = (linkRect.height / rootRect.height) * pdfHeight;

        // Add invisible link annotation
        pdf.link(x, y, w, h, { url: link.href });
      });

      if (i < pages.length - 1) pdf.addPage();

      // 3. Yield to browser to avoid freezing
      await new Promise((resolve) => setTimeout(resolve, 50));

      enqueueSnackbar(`Processed page ${i + 1} of ${pages.length}`, {
        variant: "info",
      });
    }

    setIsDownLoading(false);

    pdf.save(`${tripRef.current?.title ?? "trip"}.pdf`);
  };

  return (
    <FormBase
      className="trip-pdf-form"
      open={open}
      onClose={!isDownloading ? onClose : () => {}}
      width="60vw"
      height="80vh"
      maxHeight="80vh"
      title="Preview PDF"
      actionButtonLabel="download PDF"
      actionButtonStartIcon={<DownloadIcon />}
      actionButtonOnClick={handleDownloadPdf}
      isLoading={isDownloading}
      panel
    >
      <Box className="pdf-pages-box">
        <OverviewPdfPage tripRef={tripRef} markers={geoMarkers} />
        {days.map((day, i) => (
          <DayPdfPage
            key={`day-pdf-${day.id}`}
            dayIndex={i}
            taos={taosMap?.get(day.id)}
            routingResponses={routeResponsesMap?.get(day.id)}
          />
        ))}
      </Box>
    </FormBase>
  );
};

export default TripPdfForm;
