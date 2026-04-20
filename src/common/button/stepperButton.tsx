import type { ButtonHTMLAttributes, ReactNode } from "react";

type StepperButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

function StepperButton({ className, type = "button", children, ...props }: StepperButtonProps) {
  const classes = [
    "min-h-11 px-4 py-2.5 text-lg font-medium text-foreground transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default StepperButton;
