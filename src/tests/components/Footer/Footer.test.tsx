import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "../../../components/Footer/Footer";

describe("Footer", () => {
  it("renders brand and reassurance items", () => {
    render(<Footer />);
    expect(screen.getByText("SavoryStream")).toBeInTheDocument();
    expect(screen.getByText("Paiement sécurisé")).toBeInTheDocument();
    expect(screen.getByText(/© \d{4} SavoryStream/)).toBeInTheDocument();
  });
});
