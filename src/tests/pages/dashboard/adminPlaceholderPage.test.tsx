import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminPlaceholderPage from "../../../pages/dashboard/adminPlaceholderPage";

describe("AdminPlaceholderPage", () => {
  it("renders section title and helper text", () => {
    render(<AdminPlaceholderPage sectionName="Catégories" />);

    expect(screen.getByRole("heading", { name: "Catégories" })).toBeInTheDocument();
    expect(
      screen.getByText(/gestion implémentée concerne la création et la modification des sauces/i),
    ).toBeInTheDocument();
  });
});
