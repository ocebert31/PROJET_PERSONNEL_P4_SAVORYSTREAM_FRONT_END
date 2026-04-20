import type { ButtonHTMLAttributes, ReactNode } from "react";

type ChipButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  children: ReactNode;
};

function ChipButton({ selected = false, className, type = "button", children, ...props }: ChipButtonProps) {
  const stateClassName = selected
    ? "bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/40 ring-offset-2 ring-offset-surface"
    : "bg-background text-foreground hover:bg-border/80";

  const classes = [
    "ds-chip-radius px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-border disabled:text-muted",
    stateClassName,
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

export default ChipButton;
