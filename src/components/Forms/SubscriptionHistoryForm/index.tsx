import {
  subscriptionsService,
  type Subscription,
} from "@services/plan/subscriptions";
import FormBase from "../FormBase";
import { useEffect, useRef, useState } from "react";
import { enqueueSnackbar } from "notistack";
import SubscriptionCard from "@components/Cards/SubscriptionCard";
import { useCursorScroll } from "@hooks/useCursorScroll";
import { Box } from "@mui/material";
import "./index.scss";

type SubscriptionHistoryFormProps = {
  open: boolean;
  onClose: () => void;
};

const SubscriptionHistoryForm = ({
  open,
  onClose,
}: SubscriptionHistoryFormProps) => {
  // subscription history
  const [subHistory, setSubHistory] = useState<Subscription[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  // infinite scrolling
  const containerRef = useRef<HTMLDivElement | null>(null);
  // behavior
  const [isInit, setIsInit] = useState<boolean>(false);
  const isLoadingRef = useRef<boolean>(false);

  // init when open the first time
  useEffect(() => {
    if (open && !isInit) {
      initSubHistory();
      setIsInit(true);
    }
  }, [open]);

  const initSubHistory = async () => {
    if (isInit && !cursor) return;
    try {
      const subHistory =
        await subscriptionsService.getMySubscriptionHistory(cursor);
      setSubHistory((prev) => [...prev, ...subHistory.results]);
      setCursor(subHistory.cursor);
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  /// handle events

  const handleScroll = useCursorScroll(
    containerRef,
    isLoadingRef,
    cursor,
    initSubHistory,
  );

  return (
    <FormBase
      open={open}
      onClose={onClose}
      className="subscription-history-form"
      title="Subscription History"
      closeButtonLabel="close"
      panel
    >
      <Box className="sub-history-content" ref={containerRef} onScroll={handleScroll}>
        {subHistory.map((sub) => (
          <SubscriptionCard key={sub.id} subscription={sub} />
        ))}
      </Box>
    </FormBase>
  );
};

export default SubscriptionHistoryForm;
