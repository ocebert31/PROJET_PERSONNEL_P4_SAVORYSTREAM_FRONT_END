import { describe, it, expect } from "vitest";
import { ValidationError } from "yup";
import {
  sauceEditOptionalImageSchema,
  sauceEditListsSchema,
  sauceEditFormSchema,
  buildSauceEditListsDefaultsFromApi,
  buildSauceEditFormDefaultsFromApi,
  emptySauceEditFormValues,
  type SauceApiEditFormSource,
} from "../../schemas/sauceUpdateSchema";

function fileListFromFile(file: File): FileList {
  return { 0: file, length: 1, item: (i: number) => (i === 0 ? file : null) } as unknown as FileList;
}

function emptyFileList(): FileList {
  return { length: 0, item: () => null } as unknown as FileList;
}

type ValidatableSchema = {
  validate: (value: unknown, options?: { abortEarly?: boolean }) => Promise<unknown>;
};

async function expectValidationError(schema: ValidatableSchema, data: unknown, expectedMessage: string) {
  try {
    await schema.validate(data, { abortEarly: false });
    expect.fail("expected schema validation to fail");
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError);
    expect((error as ValidationError).errors).toContain(expectedMessage);
  }
}

describe("sauceEditOptionalImageSchema", () => {
  describe("nominal case", () => {
    it("accepts undefined and valid image file", async () => {
      await expect(sauceEditOptionalImageSchema.validate(undefined)).resolves.toBeUndefined();
      const image = fileListFromFile(new File(["x"], "ok.png", { type: "image/png" }));
      await expect(sauceEditOptionalImageSchema.validate(image)).resolves.toBeDefined();
    });
  });

  describe("variations", () => {
    it("accepts empty file list", async () => {
      await expect(sauceEditOptionalImageSchema.validate(emptyFileList())).resolves.toBeDefined();
    });

    it("rejects oversized image", async () => {
      const huge = fileListFromFile(new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.png", { type: "image/png" }));
      await expectValidationError(sauceEditOptionalImageSchema, huge, "Image trop volumineuse (max 5 Mo).");
    });

    it("rejects unsupported mime type", async () => {
      const pdf = fileListFromFile(new File(["%PDF"], "doc.pdf", { type: "application/pdf" }));
      await expectValidationError(sauceEditOptionalImageSchema, pdf, "Format d'image non supporte.");
    });
  });
});

describe("sauceEditListsSchema", () => {
  const validLists = {
    conditionings: [{ serverId: "cond-1", volume: "250ml", price: "6.90" }],
    ingredients: [{ serverId: "ing-1", name: "Sel", quantity: "1g" }],
  };

  describe("nominal case", () => {
    it("validates minimal lists payload", async () => {
      await expect(sauceEditListsSchema.validate(validLists)).resolves.toEqual(validLists);
    });
  });

  describe("variations", () => {
    it("rejects empty conditionings list", async () => {
      await expectValidationError(
        sauceEditListsSchema,
        { ...validLists, conditionings: [] },
        "Ajoutez au moins un conditionnement.",
      );
    });

    it("rejects empty ingredients list", async () => {
      await expectValidationError(
        sauceEditListsSchema,
        { ...validLists, ingredients: [] },
        "Ajoutez au moins un ingrédient.",
      );
    });
  });
});

describe("sauceEditFormSchema", () => {
  const validForm = {
    name: "Sauce update",
    tagline: "Accroche",
    description: "Description",
    characteristic: "Epicee",
    image: undefined,
    is_available: true,
    category_id: "cat-1",
    stock_quantity: 8,
    conditionings: [{ serverId: "cond-1", volume: "250ml", price: "6.90" }],
    ingredients: [{ serverId: "ing-1", name: "Poivre", quantity: "2g" }],
  };

  describe("nominal case", () => {
    it("validates full payload with and without image", async () => {
      await expect(sauceEditFormSchema.validate(validForm)).resolves.toEqual(validForm);
      const withImage = { ...validForm, image: fileListFromFile(new File(["x"], "ok.png", { type: "image/png" })) };
      await expect(sauceEditFormSchema.validate(withImage)).resolves.toBeDefined();
    });
  });

  describe("variations", () => {
    it("rejects required/core invalid fields", async () => {
      await expectValidationError(sauceEditFormSchema, { ...validForm, name: "" }, "Le nom est requis.");
      await expectValidationError(sauceEditFormSchema, { ...validForm, stock_quantity: -1 }, "Minimum 0.");
      await expectValidationError(sauceEditFormSchema, { ...validForm, conditionings: [] }, "Ajoutez au moins un conditionnement.");
      await expectValidationError(sauceEditFormSchema, { ...validForm, ingredients: [] }, "Ajoutez au moins un ingrédient.");
    });
  });
});

describe("buildSauceEditListsDefaultsFromApi", () => {
  describe("nominal case", () => {
    it("maps api rows and preserves server ids", () => {
      const values = buildSauceEditListsDefaultsFromApi({
        conditionings: [{ id: "cond-api-1", volume: "200ml", price: "4" }],
        ingredients: [{ id: "ing-api-1", name: "Sel", quantity: "1g" }],
      });
      expect(values).toEqual({
        conditionings: [{ serverId: "cond-api-1", volume: "200ml", price: "4" }],
        ingredients: [{ serverId: "ing-api-1", name: "Sel", quantity: "1g" }],
      });
    });
  });

  describe("variations", () => {
    it("returns placeholders when arrays are empty", () => {
      expect(buildSauceEditListsDefaultsFromApi({ conditionings: [], ingredients: [] })).toEqual({
        conditionings: [{ volume: "", price: "" }],
        ingredients: [{ name: "", quantity: "" }],
      });
    });
  });
});

describe("buildSauceEditFormDefaultsFromApi", () => {
  const apiBase: SauceApiEditFormSource = {
    name: "Sauce API",
    tagline: "Tag API",
    description: "Desc API",
    characteristic: "Car API",
    is_available: true,
    category: { id: "cat-1", name: "Categorie 1" },
    stock: { id: "stock-1", quantity: 9 },
    conditionings: [{ id: "cond-api-1", volume: "500ml", price: "10" }],
    ingredients: [{ id: "ing-api-1", name: "Sel", quantity: "1g" }],
  };

  describe("nominal case", () => {
    it("builds edit defaults from complete API payload", () => {
      expect(buildSauceEditFormDefaultsFromApi(apiBase)).toEqual({
        name: "Sauce API",
        tagline: "Tag API",
        description: "Desc API",
        characteristic: "Car API",
        image: undefined,
        is_available: true,
        category_id: "cat-1",
        stock_quantity: 9,
        conditionings: [{ serverId: "cond-api-1", volume: "500ml", price: "10" }],
        ingredients: [{ serverId: "ing-api-1", name: "Sel", quantity: "1g" }],
      });
    });
  });

  describe("variations", () => {
    it("applies fallbacks for nullable fields", () => {
      const values = buildSauceEditFormDefaultsFromApi({
        ...apiBase,
        description: null,
        characteristic: null,
        category: null,
        stock: null,
        conditionings: [],
        ingredients: [],
      });
      expect(values.description).toBe("");
      expect(values.characteristic).toBe("");
      expect(values.category_id).toBe("");
      expect(values.stock_quantity).toBe(0);
      expect(values.conditionings).toEqual([{ volume: "", price: "" }]);
      expect(values.ingredients).toEqual([{ name: "", quantity: "" }]);
    });
  });
});

describe("emptySauceEditFormValues", () => {
  describe("nominal case", () => {
    it("exposes expected empty defaults", () => {
      expect(emptySauceEditFormValues).toEqual({
        name: "",
        tagline: "",
        description: "",
        characteristic: "",
        image: undefined,
        is_available: true,
        category_id: "",
        stock_quantity: 0,
        conditionings: [{ volume: "", price: "" }],
        ingredients: [{ name: "", quantity: "" }],
      });
    });
  });

  describe("variations", () => {
    it("becomes valid once required fields are filled", async () => {
      const values = {
        ...emptySauceEditFormValues,
        name: "Nom",
        tagline: "Tag",
        description: "Desc",
        characteristic: "Car",
        category_id: "cat-1",
        conditionings: [{ volume: "250ml", price: "6.90" }],
        ingredients: [{ name: "Sel", quantity: "1g" }],
      };
      await expect(sauceEditFormSchema.validate(values)).resolves.toBeDefined();
    });
  });
});
