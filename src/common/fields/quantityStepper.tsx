import StepperButton from "@/common/button/stepperButton";

export type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  decreaseAriaLabel: string;
  increaseAriaLabel: string;
  disabled?: boolean;
  groupAriaLabel?: string;
  quantityAriaLive?: "off" | "polite" | "assertive";
};

export default function QuantityStepper({ quantity, onIncrement, onDecrement, decreaseAriaLabel, increaseAriaLabel, disabled = false, groupAriaLabel, quantityAriaLive }: QuantityStepperProps) {
  const wrapperClass = "inline-flex items-center overflow-hidden rounded-full border border-border bg-background";

  const stepper = (
    <>
      <StepperButton disabled={disabled} onClick={onDecrement} aria-label={decreaseAriaLabel}>
        −
      </StepperButton>
      <span className="min-w-[3rem] px-2 py-2.5 text-center text-sm font-semibold tabular-nums" {...(quantityAriaLive !== undefined ? { "aria-live": quantityAriaLive } : {})}>
        {quantity}
      </span>
      <StepperButton disabled={disabled} onClick={onIncrement} aria-label={increaseAriaLabel}>
        +
      </StepperButton>
    </>
  );

  if (groupAriaLabel) {
    return (
      <div className={wrapperClass} role="group" aria-label={groupAriaLabel}>
        {stepper}
      </div>
    );
  }

  return <div className={wrapperClass}>{stepper}</div>;
}
