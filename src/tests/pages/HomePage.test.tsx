import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../../pages/HomePage"; 

describe("HomePage", () => {
    it("should render the main title", () => {
        render(<HomePage />)
        const title = screen.getByText("Page d'Accueil");
        expect(title).toBeInTheDocument();
    });
});
