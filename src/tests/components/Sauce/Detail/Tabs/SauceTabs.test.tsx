import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SauceTabs from "../../../../../components/Sauce/Detail/Tabs/SauceTabs";

describe("SauceTabs", () => {
  it("shows caracteristique by default", () => {
    render(<SauceTabs caracteristique="Goût fumé" ingredients={[{ id: "1", name: "Tomate", quantité: "100g" }]} />);
    expect(screen.getByText("Goût fumé")).toBeInTheDocument();
  });

  it("switches to ingredients tab", async () => {
    render(<SauceTabs caracteristique="Carac" ingredients={[{ id: "1", name: "Sel", quantité: "1g" }]} />);
    await userEvent.click(screen.getByRole("button", { name: /Ingrédients/i }));
    expect(screen.getByText("Sel")).toBeInTheDocument();
    expect(screen.getByText("1g")).toBeInTheDocument();
  });
});
