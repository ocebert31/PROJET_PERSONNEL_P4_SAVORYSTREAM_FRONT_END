import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../../pages/homePage";
import { MemoryRouter } from "react-router-dom"; 

vi.mock("../../data/sauces.json", () => ({
    default: [
        {
            id: 1,
            name: "Sauce Barbecue",
            accroche: "Une sauce fumée et légèrement sucrée",
            image_url: "test-image1.jpg",
            is_available: true,
            conditionnements: [{ prix: 3.99 }],
        },
        {
            id: 2,
            name: "Sauce Samurai",
            accroche: "Une sauce épicée qui réveille les papilles",
            image_url: "test-image2.jpg",
            is_available: false, 
            conditionnements: [{ prix: 4.49 }],
        },
        {
            id: 3,
            name: "Sauce Mystère",
            accroche: "Une sauce dont on ne révèle jamais le secret...",
            image_url: "test-image3.jpg",
            is_available: true,
            conditionnements: [], 
        },
    ],
}));

describe("HomePage", () => {
    const renderHomePage = () => render(
        <MemoryRouter> 
            <HomePage /> 
        </MemoryRouter>
    );

    it("should render the main title", () => {
        renderHomePage();
        const title = screen.getByText("Nos Sauces Maison 🍶");
        expect(title).toBeInTheDocument();
    });

    it("should render all sauces from the JSON", () => {
        renderHomePage();
        expect(screen.getByText("Sauce Barbecue")).toBeInTheDocument();
        expect(screen.getByText("Sauce Samurai")).toBeInTheDocument();
        expect(screen.getByText("Sauce Mystère")).toBeInTheDocument();
    });
    
        it("should render sauce images with correct alt text", () => {
        renderHomePage();
        const images = screen.getAllByRole("img");
        expect(images).toHaveLength(3);
        expect(images[0]).toHaveAttribute("alt", "Sauce Barbecue");
        expect(images[1]).toHaveAttribute("alt", "Sauce Samurai");
        expect(images[2]).toHaveAttribute("alt", "Sauce Mystère");
    });

    it("should display the price for sauces with conditionnements", () => {
        renderHomePage();
        expect(screen.getByText("3.99 €")).toBeInTheDocument();
        expect(screen.getByText("4.49 €")).toBeInTheDocument();
    });

    it("should display 'N/A €' when no conditionnement is available", () => {
        renderHomePage();
        expect(screen.getByText("N/A €")).toBeInTheDocument();
    });

    it("should display 'Disponible' for available sauces", () => {
        renderHomePage();
        const availableBadges = screen.getAllByText("Disponible");
        expect(availableBadges.length).toBeGreaterThanOrEqual(1);
    });

    it("should display 'En rupture' for unavailable sauces", () => {
        renderHomePage();
        expect(screen.getByText("En rupture")).toBeInTheDocument();
    });
});
