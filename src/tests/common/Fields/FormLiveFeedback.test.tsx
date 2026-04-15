import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FormLiveFeedback from "../../../common/Fields/FormLiveFeedback";

describe("FormLiveFeedback", () => {
  it("renders error message with alert role when touched fields have errors", () => {
    render(<FormLiveFeedback touchedCount={3} touchedErrorCount={2} isValid={false} />);

    const message = screen.getByRole("alert");
    expect(message).toHaveTextContent("2 champs à corriger.");
    expect(message).toHaveClass("text-xs", "font-medium", "text-rose-700");
  });

  it("renders valid message with status role when touched fields are valid", () => {
    render(<FormLiveFeedback touchedCount={2} touchedErrorCount={0} isValid />);

    const message = screen.getByRole("status");
    expect(message).toHaveTextContent("Formulaire valide pour l'instant.");
    expect(message).toHaveClass("text-xs", "text-muted");
  });

  it("renders neutral message with status role before interaction", () => {
    render(<FormLiveFeedback touchedCount={0} touchedErrorCount={0} isValid={false} />);

    const message = screen.getByRole("status");
    expect(message).toHaveTextContent("Le formulaire est valide au fur et à mesure de votre saisie.");
    expect(message).toHaveClass("text-xs", "text-muted");
  });
});
