import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DashboardEntityListSection from "../../../common/section/dashboardEntityListSection";

describe("DashboardEntityListSection", () => {
  it("renders empty message when no item is provided", () => {
    render(
      <DashboardEntityListSection
        items={[]}
        emptyMessage="Aucune donnée."
        renderItem={(item: string) => <div key={item}>{item}</div>}
      />
    );

    expect(screen.getByText("Aucune donnée.")).toBeInTheDocument();
  });

  it("renders section title when provided", () => {
    render(
      <DashboardEntityListSection
        items={[]}
        sectionTitle="Liste des produits"
        emptyMessage="Vide"
        renderItem={(item: string) => <div key={item}>{item}</div>}
      />
    );

    expect(screen.getByRole("heading", { name: "Liste des produits", level: 2 })).toBeInTheDocument();
  });

  it("renders each item with renderItem callback", () => {
    render(
      <DashboardEntityListSection
        items={["A", "B"]}
        emptyMessage="Vide"
        renderItem={(item) => <div key={item}>Item {item}</div>}
      />
    );

    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
    expect(screen.queryByText("Vide")).not.toBeInTheDocument();
  });

  it("applies custom class names to wrappers", () => {
    const { container } = render(
      <DashboardEntityListSection
        items={["A"]}
        sectionClassName="my-section"
        listClassName="my-list"
        emptyMessageClassName="my-empty"
        emptyMessage="Vide"
        renderItem={(item) => <div key={item}>{item}</div>}
      />
    );

    expect(container.firstChild).toHaveClass("my-section");
    expect(container.querySelector(".my-list")).toBeInTheDocument();
  });
});
