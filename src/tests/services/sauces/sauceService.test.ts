import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authentication from "../../../services/users/authentication";
import * as fetchRequestModule from "../../../services/apiRequest/fetchRequest";
import { createSauce, deleteSauce, fetchSauce, fetchSauces, updateSauce } from "../../../services/sauces/sauceService";
import type { SauceApiSerialized, SauceCreateResponse } from "../../../types/sauce";

vi.mock("../../../services/users/authentication", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../services/users/authentication")>();
  return {
    ...actual,
    fetchSessionRequest: vi.fn(),
  };
});

vi.mock("../../../services/apiRequest/fetchRequest", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../services/apiRequest/fetchRequest")>();
  return {
    ...actual,
    fetchRequest: vi.fn(),
  };
});

function minimalCreateResponse(overrides: Partial<SauceCreateResponse> = {}): SauceCreateResponse {
  const iso = "2026-01-01T00:00:00.000Z";
  return {
    message: "Sauce créée.",
    sauce: {
      id: "sauce-new",
      name: "Test",
      tagline: "Tag",
      description: null,
      characteristic: null,
      image_url: null,
      is_available: true,
      category: null,
      stock: null,
      conditionings: [],
      ingredients: [],
      created_at: iso,
      updated_at: iso,
    },
    ...overrides,
  };
}

function minimalApiSauce(
  overrides: Partial<SauceApiSerialized> & Pick<SauceApiSerialized, "id" | "name">
): SauceApiSerialized {
  const iso = "2026-01-01T00:00:00.000Z";
  return {
    id: overrides.id,
    name: overrides.name,
    tagline: overrides.tagline ?? "Tag",
    description: overrides.description ?? null,
    characteristic: overrides.characteristic ?? null,
    image_url: overrides.image_url ?? null,
    is_available: overrides.is_available ?? true,
    category: overrides.category ?? null,
    stock: overrides.stock ?? null,
    conditionings: overrides.conditionings ?? [],
    ingredients: overrides.ingredients ?? [],
    created_at: overrides.created_at ?? iso,
    updated_at: overrides.updated_at ?? iso,
  };
}

describe("sauceService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSauce", () => {
    describe("nominal case", () => {
      it("posts FormData to sauces via fetchSessionRequest and returns the response", async () => {
        const payload = new FormData();
        payload.append("name", "Ma sauce");
        const response = minimalCreateResponse();
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await createSauce(payload);

        expect(authentication.fetchSessionRequest).toHaveBeenCalledTimes(1);
        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces", {
          method: "POST",
          body: payload,
        });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchSessionRequest", async () => {
        const payload = new FormData();
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("422 validation"));

        await expect(createSauce(payload)).rejects.toThrow("422 validation");
      });
    });
  });

  describe("fetchSauces", () => {
    describe("nominal case", () => {
      it("calls fetchRequest with sauces endpoint and returns list response", async () => {
        const response = {
          sauces: [minimalApiSauce({ id: "s1", name: "Sauce 1" })],
        };
        vi.mocked(fetchRequestModule.fetchRequest).mockResolvedValue(response);

        const result = await fetchSauces();

        expect(fetchRequestModule.fetchRequest).toHaveBeenCalledTimes(1);
        expect(fetchRequestModule.fetchRequest).toHaveBeenCalledWith("sauces");
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchRequest", async () => {
        vi.mocked(fetchRequestModule.fetchRequest).mockRejectedValue(new Error("network down"));

        await expect(fetchSauces()).rejects.toThrow("network down");
      });
    });
  });

  describe("fetchSauce", () => {
    describe("nominal case", () => {
      it("calls fetchRequest with sauce detail endpoint and returns item response", async () => {
        const id = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
        const response = {
          sauce: minimalApiSauce({ id, name: "Sauce detail" }),
        };
        vi.mocked(fetchRequestModule.fetchRequest).mockResolvedValue(response);

        const result = await fetchSauce(id);

        expect(fetchRequestModule.fetchRequest).toHaveBeenCalledTimes(1);
        expect(fetchRequestModule.fetchRequest).toHaveBeenCalledWith(`sauces/${id}`);
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchRequest", async () => {
        vi.mocked(fetchRequestModule.fetchRequest).mockRejectedValue(new Error("404 not found"));

        await expect(fetchSauce("missing-id")).rejects.toThrow("404 not found");
      });
    });
  });

  describe("deleteSauce", () => {
    describe("nominal case", () => {
      it("calls fetchSessionRequest with delete method and returns response", async () => {
        const response = { message: "Sauce supprimée." };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await deleteSauce("sauce-id");

        expect(authentication.fetchSessionRequest).toHaveBeenCalledTimes(1);
        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/sauce-id", {
          method: "DELETE",
        });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchSessionRequest", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("403 forbidden"));

        await expect(deleteSauce("sauce-id")).rejects.toThrow("403 forbidden");
      });
    });
  });

  describe("updateSauce", () => {
    describe("nominal case", () => {
      it("sends multipart FormData when a FormData body is provided", async () => {
        const response = { message: "Sauce mise à jour." };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const fd = new FormData();
        fd.append("name", "Nom sauce");
        fd.append("tagline", "Accroche");

        const result = await updateSauce("sauce-id", fd, { version: 4 });

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/sauce-id", {
          method: "PATCH",
          body: expect.any(FormData),
          headers: {},
        });
        const options = vi.mocked(authentication.fetchSessionRequest).mock.calls[0][1] as {
          body: FormData;
        };
        const sent = options.body;
        expect(sent.get("version")).toBe("4");
        expect(sent.get("name")).toBe("Nom sauce");
        expect(result).toEqual(response);
      });

      it("calls nested patch endpoint with versioning payload and If-Match header", async () => {
        const response = { message: "Sauce updated." };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await updateSauce(
          "sauce-id",
          { name: "Updated sauce", tagline: "Updated", description: "updated desc" },
          { version: 3, eTag: "\"etag-v3\"" },
        );

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/sauce-id", {
          method: "PATCH",
          body: { name: "Updated sauce", tagline: "Updated", description: "updated desc", version: 3 },
          headers: { "If-Match": "\"etag-v3\"" },
        });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("maps blank optional fields to null in payload", async () => {
        const response = { message: "Sauce updated." };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        await updateSauce("sauce-id", { description: "  ", characteristic: "  ", category_id: "  " });

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/sauce-id", {
          method: "PATCH",
          body: { description: null, characteristic: null, category_id: null },
          headers: {},
        });
      });

      it("propagates rejection from fetchSessionRequest", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("409 conflict"));

        await expect(updateSauce("sauce-id", { name: "Updated sauce" })).rejects.toThrow("409 conflict");
      });
    });
  });
});
