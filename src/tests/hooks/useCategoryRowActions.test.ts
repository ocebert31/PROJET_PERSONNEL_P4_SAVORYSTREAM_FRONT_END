import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { SauceCategory } from "../../types/sauceCategory";
import { useCategoryRowActions } from "../../hooks/useCategoryRowActions";
import { useDeleteCategory } from "../../hooks/useDeleteCategory";

vi.mock("../../hooks/useDeleteCategory", () => ({
  useDeleteCategory: vi.fn(),
}));

const mockedUseDeleteCategory = vi.mocked(useDeleteCategory);
const deleteCategoryByIdMock = vi.fn<(id: string) => Promise<boolean>>();
const clearDeleteErrorMock = vi.fn();

function makeCategory(id: string, name: string): SauceCategory {
  return {
    id,
    name,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("useCategoryRowActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseDeleteCategory.mockReturnValue({
      deleteCategoryById: deleteCategoryByIdMock,
      deletingCategoryId: null,
      deleteErrorMessage: "",
      clearDeleteError: clearDeleteErrorMock,
    });
  });

  it("passes through delete helpers from useDeleteCategory", () => {
    const setCategories = vi.fn();
    mockedUseDeleteCategory.mockReturnValue({
      deleteCategoryById: deleteCategoryByIdMock,
      deletingCategoryId: "c-2",
      deleteErrorMessage: "Suppression impossible.",
      clearDeleteError: clearDeleteErrorMock,
    });

    const { result } = renderHook(() => useCategoryRowActions(setCategories));

    expect(result.current.deleteErrorMessage).toBe("Suppression impossible.");
    expect(result.current.clearDeleteError).toBe(clearDeleteErrorMock);
  });

  it("builds row action props with expected labels and deleting state", () => {
    const setCategories = vi.fn();
    mockedUseDeleteCategory.mockReturnValue({
      deleteCategoryById: deleteCategoryByIdMock,
      deletingCategoryId: "c-2",
      deleteErrorMessage: "",
      clearDeleteError: clearDeleteErrorMock,
    });
    const category = makeCategory("c-2", "Douce");

    const { result } = renderHook(() => useCategoryRowActions(setCategories));
    const props = result.current.getCategoryRowActionProps(category);

    expect(props.editTo).toBe("/dashboard/categories/c-2/edit");
    expect(props.editLabel).toBe("Editer la catégorie Douce");
    expect(props.deleteItemName).toBe("la catégorie Douce");
    expect(props.deleteId).toBe("c-2");
    expect(props.onDeleteById).toBe(deleteCategoryByIdMock);
    expect(props.onOpenDeleteConfirm).toBe(clearDeleteErrorMock);
    expect(props.isDeleting).toBe(true);
  });

  it("removes deleted category from state when onDeleteSuccess is called", () => {
    const setCategories = vi.fn();
    const category = makeCategory("c-1", "Piquante");
    const otherCategory = makeCategory("c-2", "Douce");

    const { result } = renderHook(() => useCategoryRowActions(setCategories));
    const props = result.current.getCategoryRowActionProps(category);

    act(() => {
      props.onDeleteSuccess("c-1");
    });

    expect(setCategories).toHaveBeenCalledTimes(1);
    const updateFn = vi.mocked(setCategories).mock.calls[0]?.[0];
    expect(typeof updateFn).toBe("function");

    const updated = (updateFn as (list: SauceCategory[]) => SauceCategory[])([category, otherCategory]);
    expect(updated).toEqual([otherCategory]);
  });
});
