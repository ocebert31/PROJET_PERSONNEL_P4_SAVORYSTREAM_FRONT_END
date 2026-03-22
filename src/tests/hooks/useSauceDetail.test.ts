import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useSauceDetail } from "../../hooks/useSauceDetail";

vi.mock("../../data/sauces.json", () => ({
  default: [
    {
      id: 1,
      name: "Sauce One",
      description: "d1",
      image_url: "/1.jpg",
      is_available: true,
      conditionnements: [
        { id: 10, volume: "500ml", prix: 5 },
        { id: 11, volume: "250ml", prix: 3 },
      ],
    },
    {
      id: 2,
      name: "Sauce Two",
      description: "d2",
      image_url: "/2.jpg",
      is_available: true,
      conditionnements: [{ id: 20, volume: "750ml", prix: 12 }],
    },
    {
      id: 99,
      name: "Sans format",
      description: "d",
      image_url: "/x.jpg",
      is_available: true,
      conditionnements: [],
    },
  ],
}));

describe("useSauceDetail", () => {
  it("returns no sauce when id is undefined", () => {
    const { result } = renderHook(() => useSauceDetail(undefined));
    expect(result.current.sauce).toBeUndefined();
    expect(result.current.selected).toBeUndefined();
    expect(result.current.selectedCond).toBeNull();
    expect(result.current.quantity).toBe(1);
  });

  it("returns no sauce when id does not match any product", () => {
    const { result } = renderHook(() => useSauceDetail("404"));
    expect(result.current.sauce).toBeUndefined();
    expect(result.current.selected).toBeUndefined();
    expect(result.current.selectedCond).toBeNull();
  });

  it("parses numeric id and returns the matching sauce", () => {
    const { result } = renderHook(() => useSauceDetail("1"));
    expect(result.current.sauce?.id).toBe(1);
    expect(result.current.sauce?.name).toBe("Sauce One");
  });

  it("selects the conditioning with the smallest numeric volume", () => {
    const { result } = renderHook(() => useSauceDetail("1"));
    expect(result.current.selectedCond).toBe(11);
    expect(result.current.selected?.volume).toBe("250ml");
    expect(result.current.selected?.id).toBe(11);
  });

  it("uses null selection when there are no conditionnements", () => {
    const { result } = renderHook(() => useSauceDetail("99"));
    expect(result.current.sauce?.id).toBe(99);
    expect(result.current.selectedCond).toBeNull();
    expect(result.current.selected).toBeUndefined();
  });

  it("resets selectedCond and quantity when route id changes to another sauce", async () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: string | undefined }) => useSauceDetail(id),
      { initialProps: { id: "1" as string | undefined } }
    );

    expect(result.current.selectedCond).toBe(11);

    act(() => {
      result.current.setQuantity(7);
      result.current.setSelectedCond(10);
    });
    expect(result.current.quantity).toBe(7);
    expect(result.current.selectedCond).toBe(10);

    rerender({ id: "2" });

    await waitFor(() => {
      expect(result.current.sauce?.id).toBe(2);
      expect(result.current.selectedCond).toBe(20);
      expect(result.current.quantity).toBe(1);
    });
  });
});
