import { NavLink } from "react-router-dom";

type DashboardCreateActionLinkProps = {
  to: string;
  children: string;
};

function DashboardCreateActionLink({ to, children }: DashboardCreateActionLinkProps) {
  return (
    <NavLink to={to}className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
      {children}
    </NavLink>
  );
}

export default DashboardCreateActionLink;
