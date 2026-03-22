import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FooterColumn from "../../../components/Footer/FooterColumn";

describe("FooterColumn", () => {
  it("renders the title", () => {
    render(
      <FooterColumn title="Section title">
        <span>content</span>
      </FooterColumn>
    );
    expect(screen.getByText("Section title")).toBeInTheDocument();
  });

  it("renders children below the title", () => {
    render(
      <FooterColumn title="Boutique">
        <ul>
          <li>Link one</li>
          <li>Link two</li>
        </ul>
      </FooterColumn>
    );
    expect(screen.getByText("Link one")).toBeInTheDocument();
    expect(screen.getByText("Link two")).toBeInTheDocument();
  });
});
