import type { ReactNode } from "react";

type DashboardEntityListSectionProps<TItem> = {
  items: TItem[];
  emptyMessage: string;
  sectionClassName?: string;
  sectionTitle?: string;
  sectionTitleClassName?: string;
  emptyMessageClassName?: string;
  listClassName?: string;
  renderItem: (item: TItem) => ReactNode;
};

function DashboardEntityListSection<TItem>({ items, emptyMessage, sectionClassName = "mt-8", sectionTitle, sectionTitleClassName = "text-label text-foreground", emptyMessageClassName = "text-body-sm text-muted", listClassName = "mt-3 space-y-2", renderItem }: DashboardEntityListSectionProps<TItem>) {
  return (
    <div className={sectionClassName}>
      {sectionTitle ? <h2 className={sectionTitleClassName}>{sectionTitle}</h2> : null}
      {items.length === 0 ? (
        <p className={emptyMessageClassName}>{emptyMessage}</p>
      ) : (
        <div className={listClassName}>{items.map((item) => renderItem(item))}</div>
      )}
    </div>
  );
}

export default DashboardEntityListSection;
