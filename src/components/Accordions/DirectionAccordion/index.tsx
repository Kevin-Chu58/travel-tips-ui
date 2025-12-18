import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ActionSpan from "@components/ActionSpan";
import TimeUtils from "@utils/TimeUtils";
import DistanceUtils from "@utils/DistanceUtils";
import type { Section } from "@services/hereMap/hereMap";
import { useEffect, useState } from "react";
import "./index.scss";

type DirectionAccordionProps = {
  section: Section;
  taoId: number | undefined;
};

const DirectionAccordion = ({ section, taoId }: DirectionAccordionProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  let isExpandable = section.actions
    ? section.actions.some((action) => action.instruction !== null)
    : false;

  const expandAccordionOnClick = () => {
    if (isExpandable) {
      setIsOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [taoId]);

  return (
    <Accordion
      key={`direction-accordion-section-${section.id}`}
      className="direction-accordion"
      expanded={isOpen}
    >
      <AccordionSummary
        className="direction-accordion-summary"
        expandIcon={isExpandable ? <ExpandMoreIcon /> : undefined}
        onClick={expandAccordionOnClick}
      >
        <Box className="direction-accordion-summary-box">
          <Box className="direction-accordion-summary-inner-box">
            {/* transport mode */}
            <Typography>
              <ActionSpan
                className="direction-accordion-summary-transport-mode"
                textColor={section.transport?.textColor}
                fillColor={section.transport?.color}
              >
                {section.transport?.name ?? section.transport?.mode}
              </ActionSpan>
            </Typography>
            {/* agency name */}
            <Typography
              component="a"
              href={section.agency?.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {section.agency?.name}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            {/* distance */}
            <Typography>
              {DistanceUtils.meterToKmStr(
                section.summary?.length ?? section.travelSummary?.length!
              )}
            </Typography>
            {/* time */}
            <Typography>
              {TimeUtils.secondToTimeStr(
                section.summary?.duration ?? section.travelSummary?.duration!
              )}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {section.actions?.map((action) => (
          <Typography key={`action-${action.offset}`}>
            {action.instruction}
          </Typography>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default DirectionAccordion;
