import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEditSauceConditionings } from "../../hooks/useEditSauceConditionings";
import {
  createSauceConditioning,
  deleteSauceConditioning,
  updateSauceConditioning,
} from "../../services/sauces/sauceService";
import type { EditSauceConditioningRows } from "../../types/conditioning";

vi.mock("../../services/sauces/sauceService", () => ({
  createSauceConditioning: vi.fn(),
  deleteSauceConditioning: vi.fn(),
  updateSauceConditioning: vi.fn(),
}));

const CREATE_CONDITIONING_MOCK = vi.mocked(createSauceConditioning);
const DELETE_CONDITIONING_MOCK = vi.mocked(deleteSauceConditioning);
const UPDATE_CONDITIONING_MOCK = vi.mocked(updateSauceConditioning);

type ConditioningRow = { serverId?: string; volume: string; price: string };

const SAUCE_ID = "11111111-1111-1111-1111-111111111111";

function makeGetValues(rows: ConditioningRow[]) {
  return ((path: string) => {
    const match = /^conditionings\.(\d+)$/.exec(path);
    if (!match) return undefined;
    const index = Number.parseInt(match[1], 10);
    return rows[index];
  }) as unknown as (path: `conditionings.${number}`) => ConditioningRow;
}

function setupHook(rows: ConditioningRow[]) {
  const removeConditioning = vi.fn();
  const getValues = makeGetValues(rows);
  const hook = renderHook(() =>
    useEditSauceConditionings({
      sauceId: SAUCE_ID,
      getValues: getValues as never,
      removeConditioning,
    }),
  );
  return { ...hook, removeConditioning };
}

describe("useEditSauceConditionings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    CREATE_CONDITIONING_MOCK.mockResolvedValue(undefined as never);
    DELETE_CONDITIONING_MOCK.mockResolvedValue(undefined as never);
    UPDATE_CONDITIONING_MOCK.mockResolvedValue(undefined as never);
  });

  describe("resetPendingConditioningDeletes", () => {
    it("clears queued deletes on the happy path", async () => {
      const { result } = setupHook([{ serverId: "cond-reset", volume: "250 ml", price: "6.90" }]);

      act(() => {
        result.current.deleteConditioningRow(0);
      });
      act(() => {
        result.current.resetPendingConditioningDeletes();
      });

      await act(async () => {
        await result.current.applyConditioningDeletes();
      });
      expect(DELETE_CONDITIONING_MOCK).not.toHaveBeenCalled();
    });

    it("is safe when called with empty queue", async () => {
      const { result } = setupHook([{ volume: "250 ml", price: "6.90" }]);

      act(() => {
        result.current.resetPendingConditioningDeletes();
      });

      await act(async () => {
        await result.current.applyConditioningDeletes();
      });
      expect(DELETE_CONDITIONING_MOCK).not.toHaveBeenCalled();
    });
  });

  describe("deleteConditioningRow", () => {
    it("removes a local row with no serverId on the happy path", async () => {
      const { result, removeConditioning } = setupHook([{ volume: "250 ml", price: "6.90" }]);

      act(() => {
        result.current.deleteConditioningRow(0);
      });

      expect(removeConditioning).toHaveBeenCalledWith(0);
      await act(async () => {
        await result.current.applyConditioningDeletes();
      });
      expect(DELETE_CONDITIONING_MOCK).not.toHaveBeenCalled();
    });

    it("queues persisted row deletion and removes row", async () => {
      const { result, removeConditioning } = setupHook([{ serverId: "cond-1", volume: "250 ml", price: "6.90" }]);

      act(() => {
        result.current.deleteConditioningRow(0);
      });

      expect(removeConditioning).toHaveBeenCalledWith(0);
      await act(async () => {
        await result.current.applyConditioningDeletes();
      });
      expect(DELETE_CONDITIONING_MOCK).toHaveBeenCalledWith(SAUCE_ID, "cond-1");
    });

    it("trims serverId before enqueueing persisted deletion", async () => {
      const { result } = setupHook([{ serverId: "  cond-2  ", volume: "250 ml", price: "6.90" }]);

      act(() => {
        result.current.deleteConditioningRow(0);
      });

      await act(async () => {
        await result.current.applyConditioningDeletes();
      });
      expect(DELETE_CONDITIONING_MOCK).toHaveBeenCalledWith(SAUCE_ID, "cond-2");
    });

    it("does not enqueue duplicate serverId when deleting twice", async () => {
      const { result } = setupHook([{ serverId: "cond-3", volume: "250 ml", price: "6.90" }]);

      act(() => {
        result.current.deleteConditioningRow(0);
        result.current.deleteConditioningRow(0);
      });

      await act(async () => {
        await result.current.applyConditioningDeletes();
      });
      expect(DELETE_CONDITIONING_MOCK).toHaveBeenCalledTimes(1);
      expect(DELETE_CONDITIONING_MOCK).toHaveBeenCalledWith(SAUCE_ID, "cond-3");
    });

    it("treats whitespace-only serverId as local row", async () => {
      const { result } = setupHook([{ serverId: "   ", volume: "250 ml", price: "6.90" }]);

      act(() => {
        result.current.deleteConditioningRow(0);
      });

      await act(async () => {
        await result.current.applyConditioningDeletes();
      });
      expect(DELETE_CONDITIONING_MOCK).not.toHaveBeenCalled();
    });
  });

  describe("applyConditioningDeletes", () => {
    it("applies all queued deletes on the happy path", async () => {
      const { result } = setupHook([
        { serverId: "cond-a", volume: "250 ml", price: "6.90" },
        { serverId: "cond-b", volume: "500 ml", price: "9.50" },
      ]);

      act(() => {
        result.current.deleteConditioningRow(0);
        result.current.deleteConditioningRow(1);
      });

      await act(async () => {
        await result.current.applyConditioningDeletes();
      });

      expect(DELETE_CONDITIONING_MOCK).toHaveBeenCalledTimes(2);
      expect(DELETE_CONDITIONING_MOCK).toHaveBeenNthCalledWith(1, SAUCE_ID, "cond-a");
      expect(DELETE_CONDITIONING_MOCK).toHaveBeenNthCalledWith(2, SAUCE_ID, "cond-b");
    });

    it("does nothing when no ids are queued", async () => {
      const { result } = setupHook([{ volume: "250 ml", price: "6.90" }]);

      await act(async () => {
        await result.current.applyConditioningDeletes();
      });

      expect(DELETE_CONDITIONING_MOCK).not.toHaveBeenCalled();
    });
  });

  describe("syncConditioningRows", () => {
    it("updates existing rows and creates new complete rows on the happy path", async () => {
      const { result } = setupHook([]);
      const rows: EditSauceConditioningRows = [
        { serverId: "cond-10", volume: "250 ml", price: "6.90" },
        { volume: " 500 ml ", price: " 9.50 " },
      ];

      await act(async () => {
        await result.current.syncConditioningRows(rows);
      });

      expect(UPDATE_CONDITIONING_MOCK).toHaveBeenCalledTimes(1);
      expect(UPDATE_CONDITIONING_MOCK).toHaveBeenCalledWith(SAUCE_ID, "cond-10", {
        volume: "250 ml",
        price: "6.90",
      });
      expect(CREATE_CONDITIONING_MOCK).toHaveBeenCalledTimes(1);
      expect(CREATE_CONDITIONING_MOCK).toHaveBeenCalledWith(SAUCE_ID, {
        volume: "500 ml",
        price: "9.50",
      });
    });

    it("trims serverId before update", async () => {
      const { result } = setupHook([]);
      const rows: EditSauceConditioningRows = [{ serverId: "  cond-20  ", volume: "750 ml", price: "12.00" }];

      await act(async () => {
        await result.current.syncConditioningRows(rows);
      });

      expect(UPDATE_CONDITIONING_MOCK).toHaveBeenCalledWith(SAUCE_ID, "cond-20", {
        volume: "750 ml",
        price: "12.00",
      });
    });

    it("skips creation when a new row is incomplete", async () => {
      const { result } = setupHook([]);
      const rows: EditSauceConditioningRows = [
        { volume: "500 ml", price: "" },
        { volume: "", price: "9.50" },
      ];

      await act(async () => {
        await result.current.syncConditioningRows(rows);
      });

      expect(CREATE_CONDITIONING_MOCK).not.toHaveBeenCalled();
      expect(UPDATE_CONDITIONING_MOCK).not.toHaveBeenCalled();
    });

    it("treats whitespace-only serverId as a new row and creates when complete", async () => {
      const { result } = setupHook([]);
      const rows: EditSauceConditioningRows = [{ serverId: "   ", volume: "330 ml", price: "4.20" }];

      await act(async () => {
        await result.current.syncConditioningRows(rows);
      });

      expect(UPDATE_CONDITIONING_MOCK).not.toHaveBeenCalled();
      expect(CREATE_CONDITIONING_MOCK).toHaveBeenCalledWith(SAUCE_ID, {
        volume: "330 ml",
        price: "4.20",
      });
    });
  });
});
