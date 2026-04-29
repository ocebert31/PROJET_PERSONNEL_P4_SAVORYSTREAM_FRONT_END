import { NavLink, Outlet } from "react-router-dom";

type AdminNavItem = {
  label: string;
  to: string;
  end?: boolean;
};

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Sauces", to: "/dashboard/sauces" },
  { label: "Catégories", to: "/dashboard/categories" },
];

function renderNavLinks() {
  return ADMIN_NAV_ITEMS.map((item) => (
    <NavLink key={item.to} to={item.to} end={item.end}
      className={({ isActive }) =>
        `rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
          isActive ? "bg-primary text-white" : "text-foreground hover:bg-muted/40"}`}>
      {item.label}
    </NavLink>
  ));
}

function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6">
      <div className="md:hidden w-full rounded-2xl border border-border/70 bg-surface p-4">
        <p className="text-caption font-semibold uppercase tracking-wider text-primary">Dashboard admin</p>
        <nav className="mt-3 flex flex-wrap gap-2" aria-label="Navigation admin mobile">
          {renderNavLinks()}
        </nav>
      </div>
      <aside className="hidden min-h-[calc(100vh-7rem)] w-64 shrink-0 rounded-2xl border border-border/70 bg-surface p-4 md:block">
        <p className="text-caption font-semibold uppercase tracking-wider text-primary">Dashboard admin</p>
        <p className="text-caption mt-1 text-muted">Gestion Savorystream</p>
        <nav className="mt-4 flex flex-col gap-2" aria-label="Navigation admin">
          {renderNavLinks()}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 rounded-2xl border border-border/70 bg-surface/50">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardPage;
