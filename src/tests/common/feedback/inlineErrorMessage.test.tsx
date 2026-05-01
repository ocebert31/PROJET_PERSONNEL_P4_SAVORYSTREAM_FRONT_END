import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InlineErrorMessage from "../../../common/feedback/inlineErrorMessage";

describe("InlineErrorMessage", () => {
  it("renders error message with default classes", () => {
    render(<InlineErrorMessage>Une erreur est survenue</InlineErrorMessage>);

    const message = screen.getByText("Une erreur est survenue");
    expect(message).toBeInTheDocument();
    expect(message.tagName).toBe("P");
    expect(message).toHaveClass("text-body-sm", "text-destructive");
  });

  it("applies custom className in addition to default classes", () => {
    render(<InlineErrorMessage className="mt-4">Erreur API</InlineErrorMessage>);

    const message = screen.getByText("Erreur API");
    expect(message).toHaveClass("text-body-sm", "text-destructive", "mt-4");
  });

  it("renders complex children content", () => {
    render(
      <InlineErrorMessage>
        <span>Erreur :</span> <strong>requête invalide</strong>
      </InlineErrorMessage>
    );

    expect(screen.getByText("Erreur :")).toBeInTheDocument();
    expect(screen.getByText("requête invalide")).toBeInTheDocument();
  });
});
