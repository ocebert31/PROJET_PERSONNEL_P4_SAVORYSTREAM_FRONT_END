import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AsyncStateView from "../../../common/feedback/asyncStateView";

describe("AsyncStateView", () => {
  it("renders loading state with status role", () => {
    render(<AsyncStateView isLoading isError={false} loadingLabel="Chargement..." />);

    expect(screen.getByRole("status")).toHaveTextContent("Chargement...");
  });

  it("renders error message without retry button when onRetry is not provided", () => {
    render(
      <AsyncStateView
        isLoading={false}
        isError
        loadingLabel=""
        errorMessage="Une erreur est survenue"
      />
    );

    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Réessayer" })).not.toBeInTheDocument();
  });

  it("renders retry button and triggers callback in error state", () => {
    const onRetry = vi.fn();

    render(
      <AsyncStateView
        isLoading={false}
        isError
        loadingLabel=""
        errorMessage="Erreur réseau"
        onRetry={onRetry}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders custom retry label when provided", () => {
    const onRetry = vi.fn();

    render(
      <AsyncStateView
        isLoading={false}
        isError
        loadingLabel=""
        errorMessage="Erreur réseau"
        onRetry={onRetry}
        retryLabel="Recharger"
      />
    );

    expect(screen.getByRole("button", { name: "Recharger" })).toBeInTheDocument();
  });

  it("renders empty state message when provided", () => {
    render(
      <AsyncStateView
        isLoading={false}
        isError={false}
        loadingLabel=""
        emptyMessage="Aucune donnée disponible"
      />
    );

    expect(screen.getByText("Aucune donnée disponible")).toBeInTheDocument();
  });

  it("renders nothing when there is no loading, no error and no empty message", () => {
    const { container } = render(<AsyncStateView isLoading={false} isError={false} loadingLabel="" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("applies minHeightClass to state wrapper", () => {
    const { container } = render(
      <AsyncStateView
        isLoading
        isError={false}
        loadingLabel="Chargement..."
        minHeightClass="min-h-[12rem]"
      />
    );

    expect(container.firstChild).toHaveClass("min-h-[12rem]");
  });
});
