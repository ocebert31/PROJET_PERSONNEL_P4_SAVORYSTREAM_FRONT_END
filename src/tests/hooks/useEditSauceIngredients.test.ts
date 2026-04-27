import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEditSauceIngredients } from "../../hooks/useEditSauceIngredients";
import {
  createSauceIngredient,
  deleteSauceIngredient,
  updateSauceIngredient,
} from "../../services/sauces/sauceService";
import type { EditSauceIngredientRows } from "../../types/ingredient";

vi.mock("../../services/sauces/sauceService", () => ({
  createSauceIngredient: vi.fn(),
  deleteSauceIngredient: vi.fn(),
  updateSauceIngredient: vi.fn(),
}));

const CREATE_INGREDIENT_MOCK = vi.mocked(createSauceIngredient);
const DELETE_INGREDIENT_MOCK = vi.mocked(deleteSauceIngredient);
const UPDATE_INGREDIENT_MOCK = vi.mocked(updateSauceIngredient);

type IngredientRow = { serverId?: string; name: string; quantity: string };

const SAUCE_ID = "22222222-2222-2222-2222-222222222222";

function makeGetValues(rows: IngredientRow[]) {
  return ((path: string) => {
    const match = /^ingredients\.(\d+)$/.exec(path);
    if (!match) return undefined;
    const index = Number.parseInt(match[1], 10);
    return rows[index];
  }) as unknown as (path: `ingredients.${number}`) => IngredientRow;
}

function setupHook(rows: IngredientRow[]) {
  const removeIngredient = vi.fn();
  const getValues = makeGetValues(rows);
  const hook = renderHook(() =>
    useEditSauceIngredients({
      sauceId: SAUCE_ID,
      getValues: getValues as never,
      removeIngredient,
    }),
  );
  return { ...hook, removeIngredient };
}

describe("useEditSauceIngredients", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    CREATE_INGREDIENT_MOCK.mockResolvedValue(undefined as never);
    DELETE_INGREDIENT_MOCK.mockResolvedValue(undefined as never);
    UPDATE_INGREDIENT_MOCK.mockResolvedValue(undefined as never);
  });

  describe("resetPendingIngredientDeletes", () => {
    it("clears queued deletes on the happy path", async () => {
      const { result } = setupHook([{ serverId: "ing-reset", name: "Sel", quantity: "1g" }]);

      act(() => {
        result.current.deleteIngredientRow(0);
      });
      act(() => {
        result.current.resetPendingIngredientDeletes();
      });

      await act(async () => {
        await result.current.applyIngredientDeletes();
      });
      expect(DELETE_INGREDIENT_MOCK).not.toHaveBeenCalled();
    });

    it("is safe when called with empty queue", async () => {
      const { result } = setupHook([{ name: "Sel", quantity: "1g" }]);

      act(() => {
        result.current.resetPendingIngredientDeletes();
      });

      await act(async () => {
        await result.current.applyIngredientDeletes();
      });
      expect(DELETE_INGREDIENT_MOCK).not.toHaveBeenCalled();
    });
  });

  describe("deleteIngredientRow", () => {
    it("removes a local row with no serverId on the happy path", async () => {
      const { result, removeIngredient } = setupHook([{ name: "Sel", quantity: "1g" }]);

      act(() => {
        result.current.deleteIngredientRow(0);
      });

      expect(removeIngredient).toHaveBeenCalledWith(0);
      await act(async () => {
        await result.current.applyIngredientDeletes();
      });
      expect(DELETE_INGREDIENT_MOCK).not.toHaveBeenCalled();
    });

    it("queues persisted row deletion and removes row", async () => {
      const { result, removeIngredient } = setupHook([{ serverId: "ing-1", name: "Sel", quantity: "1g" }]);

      act(() => {
        result.current.deleteIngredientRow(0);
      });

      expect(removeIngredient).toHaveBeenCalledWith(0);
      await act(async () => {
        await result.current.applyIngredientDeletes();
      });
      expect(DELETE_INGREDIENT_MOCK).toHaveBeenCalledWith(SAUCE_ID, "ing-1");
    });

    it("trims serverId before enqueueing persisted deletion", async () => {
      const { result } = setupHook([{ serverId: "  ing-2  ", name: "Sel", quantity: "1g" }]);

      act(() => {
        result.current.deleteIngredientRow(0);
      });

      await act(async () => {
        await result.current.applyIngredientDeletes();
      });
      expect(DELETE_INGREDIENT_MOCK).toHaveBeenCalledWith(SAUCE_ID, "ing-2");
    });

    it("does not enqueue duplicate serverId when deleting twice", async () => {
      const { result } = setupHook([{ serverId: "ing-3", name: "Sel", quantity: "1g" }]);

      act(() => {
        result.current.deleteIngredientRow(0);
        result.current.deleteIngredientRow(0);
      });

      await act(async () => {
        await result.current.applyIngredientDeletes();
      });
      expect(DELETE_INGREDIENT_MOCK).toHaveBeenCalledTimes(1);
      expect(DELETE_INGREDIENT_MOCK).toHaveBeenCalledWith(SAUCE_ID, "ing-3");
    });

    it("treats whitespace-only serverId as local row", async () => {
      const { result } = setupHook([{ serverId: "   ", name: "Sel", quantity: "1g" }]);

      act(() => {
        result.current.deleteIngredientRow(0);
      });

      await act(async () => {
        await result.current.applyIngredientDeletes();
      });
      expect(DELETE_INGREDIENT_MOCK).not.toHaveBeenCalled();
    });
  });

  describe("applyIngredientDeletes", () => {
    it("applies all queued deletes on the happy path", async () => {
      const { result } = setupHook([
        { serverId: "ing-a", name: "Sel", quantity: "1g" },
        { serverId: "ing-b", name: "Poivre", quantity: "2g" },
      ]);

      act(() => {
        result.current.deleteIngredientRow(0);
        result.current.deleteIngredientRow(1);
      });

      await act(async () => {
        await result.current.applyIngredientDeletes();
      });

      expect(DELETE_INGREDIENT_MOCK).toHaveBeenCalledTimes(2);
      expect(DELETE_INGREDIENT_MOCK).toHaveBeenNthCalledWith(1, SAUCE_ID, "ing-a");
      expect(DELETE_INGREDIENT_MOCK).toHaveBeenNthCalledWith(2, SAUCE_ID, "ing-b");
    });

    it("does nothing when no ids are queued", async () => {
      const { result } = setupHook([{ name: "Sel", quantity: "1g" }]);

      await act(async () => {
        await result.current.applyIngredientDeletes();
      });

      expect(DELETE_INGREDIENT_MOCK).not.toHaveBeenCalled();
    });
  });

  describe("syncIngredientRows", () => {
    it("updates existing rows and creates new complete rows on the happy path", async () => {
      const { result } = setupHook([]);
      const rows: EditSauceIngredientRows = [
        { serverId: "ing-10", name: "Sel", quantity: "1g" },
        { name: "  Poivre  ", quantity: " 2g " },
      ];

      await act(async () => {
        await result.current.syncIngredientRows(rows);
      });

      expect(UPDATE_INGREDIENT_MOCK).toHaveBeenCalledTimes(1);
      expect(UPDATE_INGREDIENT_MOCK).toHaveBeenCalledWith(SAUCE_ID, "ing-10", {
        name: "Sel",
        quantity: "1g",
      });
      expect(CREATE_INGREDIENT_MOCK).toHaveBeenCalledTimes(1);
      expect(CREATE_INGREDIENT_MOCK).toHaveBeenCalledWith(SAUCE_ID, {
        name: "Poivre",
        quantity: "2g",
      });
    });

    it("trims serverId before update", async () => {
      const { result } = setupHook([]);
      const rows: EditSauceIngredientRows = [{ serverId: "  ing-20  ", name: "Ail", quantity: "3g" }];

      await act(async () => {
        await result.current.syncIngredientRows(rows);
      });

      expect(UPDATE_INGREDIENT_MOCK).toHaveBeenCalledWith(SAUCE_ID, "ing-20", {
        name: "Ail",
        quantity: "3g",
      });
    });

    it("skips creation when a new row is incomplete", async () => {
      const { result } = setupHook([]);
      const rows: EditSauceIngredientRows = [
        { name: "Poivre", quantity: "" },
        { name: "", quantity: "2g" },
      ];

      await act(async () => {
        await result.current.syncIngredientRows(rows);
      });

      expect(CREATE_INGREDIENT_MOCK).not.toHaveBeenCalled();
      expect(UPDATE_INGREDIENT_MOCK).not.toHaveBeenCalled();
    });

    it("treats whitespace-only serverId as a new row and creates when complete", async () => {
      const { result } = setupHook([]);
      const rows: EditSauceIngredientRows = [{ serverId: "   ", name: "Paprika", quantity: "4g" }];

      await act(async () => {
        await result.current.syncIngredientRows(rows);
      });

      expect(UPDATE_INGREDIENT_MOCK).not.toHaveBeenCalled();
      expect(CREATE_INGREDIENT_MOCK).toHaveBeenCalledWith(SAUCE_ID, {
        name: "Paprika",
        quantity: "4g",
      });
    });
  });
});
