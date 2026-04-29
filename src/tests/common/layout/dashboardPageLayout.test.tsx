import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import DashboardPageLayout from "../../../common/layout/dashboardPageLayout";

const pageShellSpy = vi.fn();

vi.mock("../../../common/layout/pageShell", () => ({
  default: (props: {
    title: string;
    eyebrow?: string;
    description?: ReactNode;
    containerClassName?: string;
    headerAction?: ReactNode;
    isBusy?: boolean;
    splitHeader?: boolean;
    children: ReactNode;
  }) => {
    pageShellSpy(props);
    return <div data-testid="page-shell-mock">{props.children}</div>;
  },
}));

describe("DashboardPageLayout", () => {
  it("passes default props contract to PageShell", () => {
    pageShellSpy.mockClear();

    render(
      <DashboardPageLayout title="Gestion des sauces">
        <p>Dashboard content</p>
      </DashboardPageLayout>
    );

    expect(pageShellSpy).toHaveBeenCalledTimes(1);
    const callProps = pageShellSpy.mock.calls[0]?.[0];
    expect(callProps).toMatchObject({
      title: "Gestion des sauces",
      eyebrow: "Administration",
      splitHeader: true,
    });
  });

  it("forwards optional props to PageShell", () => {
    pageShellSpy.mockClear();

    render(
      <DashboardPageLayout
        title="Gestion"
        eyebrow="Backoffice"
        description={<p>Description personnalisée</p>}
        action={<button type="button">Nouvelle sauce</button>}
        isBusy
      >
        <p>Dashboard content</p>
      </DashboardPageLayout>
    );

    const callProps = pageShellSpy.mock.calls[0]?.[0];
    expect(callProps).toMatchObject({
      title: "Gestion",
      eyebrow: "Backoffice",
      isBusy: true,
      splitHeader: true,
    });
    expect(callProps?.description).toBeTruthy();
    expect(callProps?.headerAction).toBeTruthy();
  });

  it("forwards contentClassName to PageShell containerClassName", () => {
    pageShellSpy.mockClear();

    render(
      <DashboardPageLayout title="Gestion" contentClassName="max-w-7xl mx-auto">
        <p>Dashboard content</p>
      </DashboardPageLayout>
    );

    const callProps = pageShellSpy.mock.calls[0]?.[0];
    expect(callProps?.containerClassName).toBe("max-w-7xl mx-auto");
  });
});
