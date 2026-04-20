import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import {
  defaultConditioningId,
  errorMessageFromUnknown,
  isBlankSauceId,
  useSauceDetail,
  useSauceDetailQuery,
  useSaucePurchaseSelection,
} from "../../hooks/useSauceDetail";
import { ApiError } from "../../services/apiRequest/apiError";
import type { Sauce, SauceApiSerialized } from "../../types/sauce";
import { fetchSauce } from "../../services/sauces/sauceService";

vi.mock("../../services/sauces/sauceService", () => ({
  fetchSauce: vi.fn(),
}));

const FETCH_SAUCE_MOCK = vi.mocked(fetchSauce);
type QUERY_PROPS = { id: string | undefined };
type PURCHASE_PROPS = { sauce: Sauce | undefined };

const SAUCE_IDS = {
  TWO_FORMATS: "11111111-1111-1111-1111-111111111111",
  ONE_FORMAT: "22222222-2222-2222-2222-222222222222",
  NO_FORMATS: "99999999-9999-9999-9999-999999999999",
  NOT_IN_CATALOG: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
} as const;

function minimalApiSauce(overrides: Partial<SauceApiSerialized> & Pick<SauceApiSerialized, "id" | "name">): SauceApiSerialized {
  return {
    tagline: "",
    description: null,
    characteristic: null,
    image_url: null,
    is_available: true,
    category: null,
    stock: null,
    conditionings: [],
    ingredients: [],
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

const SAUCE_API_BY_ID: Record<string, SauceApiSerialized> = {
  [SAUCE_IDS.TWO_FORMATS]: minimalApiSauce({
    id: SAUCE_IDS.TWO_FORMATS,
    name: "Sauce One",
    description: "d1",
    image_url: "/1.jpg",
    conditionings: [
      { id: "cond-10", volume: "500ml", price: "5" },
      { id: "cond-11", volume: "250ml", price: "3" },
    ],
  }),
  [SAUCE_IDS.ONE_FORMAT]: minimalApiSauce({
    id: SAUCE_IDS.ONE_FORMAT,
    name: "Sauce Two",
    description: "d2",
    image_url: "/2.jpg",
    conditionings: [{ id: "cond-20", volume: "750ml", price: "12" }],
  }),
  [SAUCE_IDS.NO_FORMATS]: minimalApiSauce({
    id: SAUCE_IDS.NO_FORMATS,
    name: "Sans format",
    description: "d",
    image_url: "/x.jpg",
    conditionings: [],
  }),
};

function makeSauceFromApi(apiId: keyof typeof SAUCE_IDS): Sauce {
  const api = SAUCE_API_BY_ID[SAUCE_IDS[apiId]];
  return {
    id: api.id,
    name: api.name,
    description: api.description ?? "",
    image_url: api.image_url ?? "/assets/bbq.jpg",
    conditionnements: api.conditionings.map((c) => ({
      id: c.id,
      volume: c.volume,
      prix: Number.parseFloat(c.price),
    })),
  };
}

function installDefaultCatalogMock() {
  FETCH_SAUCE_MOCK.mockImplementation(async (id: string) => {
    const sauce = SAUCE_API_BY_ID[id];
    if (sauce) return { sauce };
    throw new ApiError("Not found", 404);
  });
}

describe("errorMessageFromUnknown", () => {
  it("should return ApiError message on the happy path", () => {
    expect(errorMessageFromUnknown(new ApiError("Service unavailable", 503))).toBe("Service unavailable");
  });

  it("should return native Error message", () => {
    expect(errorMessageFromUnknown(new Error("network down"))).toBe("network down");
  });

  it("should return fallback message for non-Error values", () => {
    expect(errorMessageFromUnknown("plain-string-failure")).toBe("Impossible de charger la sauce.");
  });
});

describe("isBlankSauceId", () => {
  it("should return false on the happy path with a non-empty id", () => {
    expect(isBlankSauceId(SAUCE_IDS.TWO_FORMATS)).toBe(false);
  });

  it.each([
    { caseName: "undefined", id: undefined as string | undefined },
    { caseName: "empty string", id: "" },
    { caseName: "whitespace only", id: "   \t" },
  ])("should return true when id is $caseName", ({ id }) => {
    expect(isBlankSauceId(id)).toBe(true);
  });
});

describe("defaultConditioningId", () => {
  it("should return the id with the smallest numeric volume on the happy path", () => {
    const conditionnements = makeSauceFromApi("TWO_FORMATS").conditionnements;
    expect(defaultConditioningId(conditionnements)).toBe("cond-11");
  });

  it("should return null when the list is empty", () => {
    expect(defaultConditioningId([])).toBeNull();
  });

  it("should keep the first item when two volumes are numerically equal", () => {
    const equalVolumes: Sauce["conditionnements"] = [
      { id: "cond-a", volume: "250ml", prix: 5 },
      { id: "cond-b", volume: "250ml", prix: 7 },
    ];
    expect(defaultConditioningId(equalVolumes)).toBe("cond-a");
  });
});

describe("useSauceDetailQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installDefaultCatalogMock();
  });

  it("should load sauce data on the happy path", async () => {
    const { result } = renderHook(() => useSauceDetailQuery(SAUCE_IDS.TWO_FORMATS));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.sauce?.id).toBe(SAUCE_IDS.TWO_FORMATS));

    expect(result.current.sauce?.name).toBe("Sauce One");
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it.each([
    { caseName: "undefined", id: undefined as string | undefined },
    { caseName: "empty string", id: "" },
    { caseName: "whitespace only", id: "   \t" },
  ])("should stay idle and skip API calls when id is $caseName", ({ id }) => {
    const { result } = renderHook(() => useSauceDetailQuery(id));

    expect(result.current.sauce).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(FETCH_SAUCE_MOCK).not.toHaveBeenCalled();
  });

  it("should trim id before calling the API", async () => {
    const { result } = renderHook(() => useSauceDetailQuery(`  ${SAUCE_IDS.TWO_FORMATS}  `));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(FETCH_SAUCE_MOCK).toHaveBeenCalledWith(SAUCE_IDS.TWO_FORMATS);
  });

  it("should keep error undefined for a 404 response", async () => {
    const { result } = renderHook(() => useSauceDetailQuery(SAUCE_IDS.NOT_IN_CATALOG));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.sauce).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it.each([
    {
      caseName: "ApiError with non-404 status",
      rejection: new ApiError("Service unavailable", 503),
      expectedMessage: "Service unavailable",
    },
    {
      caseName: "native Error",
      rejection: new Error("network down"),
      expectedMessage: "network down",
    },
    {
      caseName: "non-Error value",
      rejection: "plain-string-failure",
      expectedMessage: "Impossible de charger la sauce.",
    },
  ])("should expose a readable message when fetch rejects with $caseName", async ({ rejection, expectedMessage }) => {
    FETCH_SAUCE_MOCK.mockRejectedValueOnce(rejection);

    const { result } = renderHook(() => useSauceDetailQuery(SAUCE_IDS.TWO_FORMATS));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.sauce).toBeUndefined();
    expect(result.current.error).toBe(expectedMessage);
  });

  it("should clear previous sauce while loading a new id", async () => {
    const { result, rerender } = renderHook(
      ({ id }: QUERY_PROPS) => useSauceDetailQuery(id),
      { initialProps: { id: SAUCE_IDS.TWO_FORMATS } as QUERY_PROPS }
    );

    await waitFor(() => expect(result.current.sauce?.id).toBe(SAUCE_IDS.TWO_FORMATS));

    rerender({ id: SAUCE_IDS.ONE_FORMAT });

    expect(result.current.sauce).toBeUndefined();
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.sauce?.id).toBe(SAUCE_IDS.ONE_FORMAT));
  });

  it("should ignore pending response if id becomes blank before resolve", async () => {
    let resolveFetch: ((value: { sauce: SauceApiSerialized }) => void) | undefined;

    FETCH_SAUCE_MOCK.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    const { result, rerender } = renderHook(
      ({ id }: QUERY_PROPS) => useSauceDetailQuery(id),
      { initialProps: { id: SAUCE_IDS.TWO_FORMATS } as QUERY_PROPS }
    );

    rerender({ id: "   " });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.sauce).toBeUndefined();

    act(() => {
      resolveFetch?.({ sauce: SAUCE_API_BY_ID[SAUCE_IDS.TWO_FORMATS] });
    });

    expect(result.current.sauce).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it("should retry with a new request after a recoverable failure", async () => {
    FETCH_SAUCE_MOCK.mockRejectedValueOnce(new ApiError("Service unavailable", 503));

    const { result } = renderHook(() => useSauceDetailQuery(SAUCE_IDS.TWO_FORMATS));

    await waitFor(() => expect(result.current.error).toBe("Service unavailable"));

    act(() => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.sauce?.id).toBe(SAUCE_IDS.TWO_FORMATS));

    expect(result.current.error).toBeUndefined();
  });

  it("should not fire a retry request when id is blank", () => {
    const { result } = renderHook(() => useSauceDetailQuery(undefined));

    act(() => {
      result.current.retry();
    });

    expect(FETCH_SAUCE_MOCK).not.toHaveBeenCalled();
  });
});

describe("useSaucePurchaseSelection", () => {
  it("should select the smallest packaging by default and start quantity at 1", async () => {
    const { result } = renderHook(() => useSaucePurchaseSelection(makeSauceFromApi("TWO_FORMATS")));

    await waitFor(() => expect(result.current.selectedCond).toBe("cond-11"));

    expect(result.current.selected?.id).toBe("cond-11");
    expect(result.current.selected?.volume).toBe("250ml");
    expect(result.current.quantity).toBe(1);
  });

  it.each([
    { caseName: "no sauce", sauce: undefined as Sauce | undefined },
    { caseName: "sauce without packagings", sauce: makeSauceFromApi("NO_FORMATS") },
  ])("should keep selection empty when there is $caseName", async ({ sauce }) => {
    const { result } = renderHook(() => useSaucePurchaseSelection(sauce));

    await waitFor(() => expect(result.current.quantity).toBe(1));
    expect(result.current.selectedCond).toBeNull();
    expect(result.current.selected).toBeUndefined();
  });

  it("should update selected to matching packaging when setSelectedCond is called", async () => {
    const { result } = renderHook(() => useSaucePurchaseSelection(makeSauceFromApi("TWO_FORMATS")));

    await waitFor(() => expect(result.current.selectedCond).toBe("cond-11"));

    act(() => {
      result.current.setSelectedCond("cond-10");
    });

    expect(result.current.selectedCond).toBe("cond-10");
    expect(result.current.selected?.id).toBe("cond-10");
  });

  it("should set selected undefined when selectedCond does not exist in packagings", async () => {
    const { result } = renderHook(() => useSaucePurchaseSelection(makeSauceFromApi("TWO_FORMATS")));

    await waitFor(() => expect(result.current.selectedCond).toBe("cond-11"));

    act(() => {
      result.current.setSelectedCond("unknown-cond");
    });

    expect(result.current.selectedCond).toBe("unknown-cond");
    expect(result.current.selected).toBeUndefined();
  });

  it("should update quantity when setQuantity is called", () => {
    const { result } = renderHook(() => useSaucePurchaseSelection(makeSauceFromApi("ONE_FORMAT")));

    act(() => {
      result.current.setQuantity(4);
    });

    expect(result.current.quantity).toBe(4);
  });

  it.each([
    {
      caseName: "to a sauce with one packaging",
      nextSauce: makeSauceFromApi("ONE_FORMAT"),
      expectedCond: "cond-20",
    },
    {
      caseName: "to a sauce without packagings",
      nextSauce: makeSauceFromApi("NO_FORMATS"),
      expectedCond: null,
    },
    {
      caseName: "to no sauce",
      nextSauce: undefined as Sauce | undefined,
      expectedCond: null,
    },
  ])("should reset quantity and default selection when navigating $caseName", async ({ nextSauce, expectedCond }) => {
    const { result, rerender } = renderHook(
      ({ sauce }: PURCHASE_PROPS) => useSaucePurchaseSelection(sauce),
      { initialProps: { sauce: makeSauceFromApi("TWO_FORMATS") } as PURCHASE_PROPS }
    );

    await waitFor(() => expect(result.current.selectedCond).toBe("cond-11"));

    act(() => {
      result.current.setQuantity(8);
      result.current.setSelectedCond("cond-10");
    });

    rerender({ sauce: nextSauce });

    expect(result.current.quantity).toBe(1);
    expect(result.current.selectedCond).toBe(expectedCond);
  });

  it("should keep current quantity when sauce changes but default selected id stays the same", async () => {
    const initialSauce = makeSauceFromApi("ONE_FORMAT");
    const equivalentSauce: Sauce = {
      ...makeSauceFromApi("ONE_FORMAT"),
      name: "Sauce Two v2",
    };

    const { result, rerender } = renderHook(
      ({ sauce }: PURCHASE_PROPS) => useSaucePurchaseSelection(sauce),
      { initialProps: { sauce: initialSauce } as PURCHASE_PROPS }
    );

    await waitFor(() => expect(result.current.selectedCond).toBe("cond-20"));

    act(() => {
      result.current.setQuantity(6);
    });

    rerender({ sauce: equivalentSauce });

    expect(result.current.selectedCond).toBe("cond-20");
    expect(result.current.quantity).toBe(6);
  });
});

describe("useSauceDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installDefaultCatalogMock();
  });

  it("should expose loaded sauce with default purchase selection on the happy path", async () => {
    const { result } = renderHook(() => useSauceDetail(SAUCE_IDS.TWO_FORMATS));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.sauce?.id).toBe(SAUCE_IDS.TWO_FORMATS));

    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.selectedCond).toBe("cond-11");
    expect(result.current.selected?.id).toBe("cond-11");
    expect(result.current.quantity).toBe(1);
  });

  it("should stay idle with empty selection when id is blank", () => {
    const { result } = renderHook(() => useSauceDetail("   "));

    expect(result.current.sauce).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.selectedCond).toBeNull();
    expect(result.current.selected).toBeUndefined();
    expect(result.current.quantity).toBe(1);
    expect(FETCH_SAUCE_MOCK).not.toHaveBeenCalled();
  });

  it("should expose recoverable query error and recover after retry", async () => {
    FETCH_SAUCE_MOCK.mockRejectedValueOnce(new ApiError("Service unavailable", 503));

    const { result } = renderHook(() => useSauceDetail(SAUCE_IDS.TWO_FORMATS));

    await waitFor(() => expect(result.current.error).toBe("Service unavailable"));
    expect(result.current.sauce).toBeUndefined();
    expect(result.current.selectedCond).toBeNull();

    act(() => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.sauce?.id).toBe(SAUCE_IDS.TWO_FORMATS));
    expect(result.current.error).toBeUndefined();
    expect(result.current.selectedCond).toBe("cond-11");
    expect(result.current.quantity).toBe(1);
  });
});
