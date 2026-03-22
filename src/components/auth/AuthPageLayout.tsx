import type { ReactNode } from "react";

const gradients: Record<"primary" | "secondary", string> = {
  primary: "from-primary/15 via-background to-background",
  secondary: "from-secondary/20 via-background to-background",
};

function AuthPageLayout({ variant, children }: { variant: keyof typeof gradients; children: ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-6 py-16">
      <div className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${gradients[variant]}`} aria-hidden />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}

export default AuthPageLayout;
