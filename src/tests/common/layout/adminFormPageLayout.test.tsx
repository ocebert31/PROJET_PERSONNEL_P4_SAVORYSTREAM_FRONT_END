import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import AdminFormPageLayout from "../../../common/layout/adminFormPageLayout";

const pageShellSpy = vi.fn();

vi.mock("../../../common/layout/pageShell", () => ({
  default: (props: {
    title: string;
    eyebrow?: string;
    description?: ReactNode;
    containerClassName?: string;
    headerSuffix?: ReactNode;
    children: ReactNode;
  }) => {
    pageShellSpy(props);
    return <div data-testid="page-shell-mock">{props.children}</div>;
  },
}));

describe("AdminFormPageLayout", () => {
  it("passes default props contract to PageShell", () => {
    pageShellSpy.mockClear();

    render(
      <AdminFormPageLayout title="Nouvelle sauce">
        <p>Form content</p>
      </AdminFormPageLayout>
    );

    expect(pageShellSpy).toHaveBeenCalledTimes(1);
    const callProps = pageShellSpy.mock.calls[0]?.[0];
    expect(callProps).toMatchObject({
      title: "Nouvelle sauce",
      eyebrow: "Administration",
      containerClassName: "mx-auto max-w-7xl",
    });
  });

  it("forwards optional props to PageShell", () => {
    pageShellSpy.mockClear();

    render(
      <AdminFormPageLayout
        title="Edition"
        eyebrow="Backoffice"
        description={<p>Description personnalisée</p>}
        headerContent={<p>Header helper</p>}
      >
        <p>Form content</p>
      </AdminFormPageLayout>
    );

    const callProps = pageShellSpy.mock.calls[0]?.[0];
    expect(callProps).toMatchObject({
      title: "Edition",
      eyebrow: "Backoffice",
      containerClassName: "mx-auto max-w-7xl",
    });
    expect(callProps?.description).toBeTruthy();
    expect(callProps?.headerSuffix).toBeTruthy();
  });

  it("uses custom contentClassName instead of default", () => {
    pageShellSpy.mockClear();

    render(
      <AdminFormPageLayout title="Edition" contentClassName="max-w-5xl mx-auto">
        <p>Form content</p>
      </AdminFormPageLayout>
    );

    const callProps = pageShellSpy.mock.calls[0]?.[0];
    expect(callProps?.containerClassName).toBe("max-w-5xl mx-auto");
  });
});
