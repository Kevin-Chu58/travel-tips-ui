import {
  subscriptionsService,
  type Subscription,
} from "@services/plan/subscriptions";
import FormBase from "../FormBases/FormBase";
import { useEffect, useRef, useState } from "react";
import { enqueueSnackbar } from "notistack";
import SubscriptionCard from "@components/Cards/SubscriptionCard";
import { useCursorScrollOnLoadingState } from "@hooks/useCursorScroll";
import { Box, CircularProgress } from "@mui/material";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    setIsLoading(false);
  };

  /// handle events

  const handleScroll = useCursorScrollOnLoadingState(
    containerRef,
    isLoading,
    setIsLoading,
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
      {!isLoading ? (
        <Box
          className="sub-history-content"
          ref={containerRef}
          onScroll={handleScroll}
        >
          {subHistory.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
        </Box>
      ) : (
        <Box className="column center v-center flex">
          <CircularProgress aria-label="Loading…" />
        </Box>
      )}
    </FormBase>
  );
};

export default SubscriptionHistoryForm;
