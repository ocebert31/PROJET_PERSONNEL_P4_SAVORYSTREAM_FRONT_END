import { render, screen, fireEvent } from "@testing-library/react";
import ItemListManager from "../../common/ItemListManager";
import { vi, expect, test, beforeEach } from 'vitest';
import { Sauce } from "../../types/Sauce";

const setup = (props = {}) => {
    const setValueMock = vi.fn();
    const defaultProps = {
        label: "Ingrédient",
        id: "ingredient-input",
        list: [],
        field: "ingredients" as keyof Sauce,
        setValue: setValueMock,
        error: undefined,
        ...props,
    };
    render(<ItemListManager {...defaultProps} />);
    return { setValueMock };
};

const addItem = (value: string) => {
    const input = screen.getByPlaceholderText("Ajouter ingrédient");
    fireEvent.change(input, { target: { value } });
    fireEvent.keyDown(input, { key: "Enter" });
};

beforeEach(() => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
});

test("adds an item to the list", () => {
    const { setValueMock } = setup();
    addItem("Tomate");
    expect(setValueMock).toHaveBeenCalledWith("ingredients", ["Tomate"]);
});

test("does not add an empty item to the list", () => {
    const { setValueMock } = setup();
    addItem("   ");
    expect(setValueMock).not.toHaveBeenCalled();
});

test("displays an alert if the item exceeds 30 characters", () => {
    setup();
    addItem("A".repeat(31));
    expect(window.alert).toHaveBeenCalledWith("L'élément ne doit pas dépasser 30 caractères");
});

test("prevents adding a duplicate item", () => {
    const { setValueMock } = setup({ list: ["Tomate"] });
    addItem("Tomate");
    expect(setValueMock).not.toHaveBeenCalled();
});

test("removes an item from the list", () => {
    const { setValueMock } = setup({ list: ["Tomate", "Oignon"] });
    const removeButton = screen.getAllByText("x")[0];
    fireEvent.click(removeButton);
    expect(setValueMock).toHaveBeenCalledWith("ingredients", ["Oignon"]);
});

test("displays an error message if present", () => {
    setup({ error: { message: "Champ requis" } });
    expect(screen.getByText("Champ requis")).toBeInTheDocument();
});
