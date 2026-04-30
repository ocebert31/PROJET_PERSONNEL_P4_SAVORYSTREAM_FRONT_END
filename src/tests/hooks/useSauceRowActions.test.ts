import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { SauceApiSerialized } from "../../types/sauce";
import { useSauceRowActions } from "../../hooks/useSauceRowActions";
import { useDeleteSauce } from "../../hooks/useDeleteSauce";

vi.mock("../../hooks/useDeleteSauce", () => ({
  useDeleteSauce: vi.fn(),
}));

const mockedUseDeleteSauce = vi.mocked(useDeleteSauce);
const deleteSauceByIdMock = vi.fn<(id: string) => Promise<boolean>>();
const clearDeleteErrorMock = vi.fn();

function makeSauce(id: string, name: string): SauceApiSerialized {
  return {
    id,
    name,
    tagline: "tagline",
    description: "description",
    characteristic: "characteristic",
    image_url: null,
    is_available: true,
    category: { id: "cat-1", name: "Catégorie test" },
    stock: { id: "stock-1", quantity: 4 },
    conditionings: [],
    ingredients: [],
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("useSauceRowActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseDeleteSauce.mockReturnValue({
      deleteSauceById: deleteSauceByIdMock,
      deletingSauceId: null,
      deleteErrorMessage: "",
      clearDeleteError: clearDeleteErrorMock,
    });
  });

  it("passes through delete helpers from useDeleteSauce", () => {
    const setSauces = vi.fn();
    mockedUseDeleteSauce.mockReturnValue({
      deleteSauceById: deleteSauceByIdMock,
      deletingSauceId: "s-2",
      deleteErrorMessage: "Suppression impossible.",
      clearDeleteError: clearDeleteErrorMock,
    });

    const { result } = renderHook(() => useSauceRowActions(setSauces));

    expect(result.current.deleteErrorMessage).toBe("Suppression impossible.");
    expect(result.current.clearDeleteError).toBe(clearDeleteErrorMock);
  });

  it("builds row action props with expected labels and deleting state", () => {
    const setSauces = vi.fn();
    mockedUseDeleteSauce.mockReturnValue({
      deleteSauceById: deleteSauceByIdMock,
      deletingSauceId: "s-2",
      deleteErrorMessage: "",
      clearDeleteError: clearDeleteErrorMock,
    });
    const sauce = makeSauce("s-2", "Chipotle");

    const { result } = renderHook(() => useSauceRowActions(setSauces));
    const props = result.current.getSauceRowActionProps(sauce);

    expect(props.editTo).toBe("/dashboard/sauces/s-2/edit");
    expect(props.editLabel).toBe("Editer la sauce Chipotle");
    expect(props.deleteItemName).toBe("la sauce Chipotle");
    expect(props.deleteId).toBe("s-2");
    expect(props.onDeleteById).toBe(deleteSauceByIdMock);
    expect(props.onOpenDeleteConfirm).toBe(clearDeleteErrorMock);
    expect(props.isDeleting).toBe(true);
  });

  it("removes deleted sauce from state when onDeleteSuccess is called", () => {
    const setSauces = vi.fn();
    const sauce = makeSauce("s-1", "Chipotle");
    const otherSauce = makeSauce("s-2", "Habanero");

    const { result } = renderHook(() => useSauceRowActions(setSauces));
    const props = result.current.getSauceRowActionProps(sauce);

    act(() => {
      props.onDeleteSuccess("s-1");
    });

    expect(setSauces).toHaveBeenCalledTimes(1);
    const updateFn = vi.mocked(setSauces).mock.calls[0]?.[0];
    expect(typeof updateFn).toBe("function");

    const updated = (updateFn as (list: SauceApiSerialized[]) => SauceApiSerialized[])([sauce, otherSauce]);
    expect(updated).toEqual([otherSauce]);
  });
});
