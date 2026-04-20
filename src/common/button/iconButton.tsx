import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "ghost" | "subtle" | "destructive";
type IconButtonSize = "sm" | "md";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  children: ReactNode;
};

const BASE_CLASSES = "inline-flex items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60";

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  ghost: "text-foreground/70 hover:bg-background hover:text-foreground",
  subtle: "border border-border bg-surface text-foreground/75 hover:bg-muted/30 hover:text-foreground",
  destructive:
    "border border-destructive-border bg-destructive-background text-destructive-foreground hover:bg-destructive/15",
};

const SIZE_CLASSES: Record<IconButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
};

function IconButton({ variant = "ghost", size = "sm", className, type = "button", children, ...props }: IconButtonProps) {
  const classes = [BASE_CLASSES, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default IconButton;
