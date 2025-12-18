import { Box, Step, StepLabel, Stepper } from "@mui/material";
import { type JSX } from "react";
import clsx from "clsx";
import "./index.scss";

type TTStepperProps = {
  activeStep: number;
  steps: string[];
  contents: JSX.Element[];
  completeContent?: JSX.Element;
};

const TTStepper = ({
  activeStep,
  steps,
  contents,
  completeContent,
}: TTStepperProps) => {
  // stepper
  const completed = steps.length === activeStep;

  return (
    <Box className="stepper-container">
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((step, i) => {
          const reached = i <= activeStep;

          return (
            <Step
              key={step}
              className={clsx("stepper-step", reached && "reached")}
              completed={activeStep > i}
            >
              <StepLabel className="stepper-label">{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Box className="stepper-content-container">
        {completed ? completeContent : contents?.at(activeStep)}
      </Box>
    </Box>
  );
};

export default TTStepper;
