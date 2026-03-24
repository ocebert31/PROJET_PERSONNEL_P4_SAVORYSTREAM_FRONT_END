import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomeTrustStrip from "@/components/home/HomeTrustStrip";

describe("HomeTrustStrip", () => {
  it("renders all trust items with title and body", () => {
    render(<HomeTrustStrip />);

    expect(screen.getByText("Paiement sécurisé")).toBeInTheDocument();
    expect(
      screen.getByText("Transactions protégées et données confidentielles.")
    ).toBeInTheDocument();

    expect(screen.getByText("Envoi rapide")).toBeInTheDocument();
    expect(screen.getByText("Préparation soignée et expédition suivie.")).toBeInTheDocument();

    expect(screen.getByText("Une question ?")).toBeInTheDocument();
    expect(
      screen.getByText("Notre équipe vous répond avec le sourire.")
    ).toBeInTheDocument();
  });
});
