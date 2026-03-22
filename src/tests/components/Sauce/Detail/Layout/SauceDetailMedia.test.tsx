import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SauceDetailMedia from "../../../../../components/Sauce/Detail/Layout/SauceDetailMedia";

describe("SauceDetailMedia", () => {
  it("renders image with src and alt from props", () => {
    render(<SauceDetailMedia imageUrl="/photos/sauce.png" name="Sauce Picante" />);
    const img = screen.getByRole("img", { name: "Sauce Picante" });
    expect(img).toHaveAttribute("src", "/photos/sauce.png");
  });
});
