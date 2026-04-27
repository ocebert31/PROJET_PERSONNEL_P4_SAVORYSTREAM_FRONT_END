import { describe, it, expect } from "vitest";
import { ValidationError } from "yup";
import {
  sauceCreateSchema,
  sauceCreateDefaultValues,
  type SauceCreateFormValues,
} from "../../schemas/sauceCreateSchema";

function fileListFromFile(file: File): FileList {
  return {
    0: file,
    length: 1,
    item: (index: number) => (index === 0 ? file : null),
    *[Symbol.iterator]() {
      yield file;
    },
  } as unknown as FileList;
}

function emptyFileList(): FileList {
  return {
    length: 0,
    item: () => null,
    *[Symbol.iterator]() {
      /* empty */
    },
  } as unknown as FileList;
}

function buildValidPayload(overrides: Partial<SauceCreateFormValues> = {}): SauceCreateFormValues {
  return {
    name: "Sauce barbecue",
    tagline: "Fumee et equilibree",
    description: "Une sauce pour viandes grillees.",
    characteristic: "Fumee",
    image: fileListFromFile(new File(["x"], "sauce.png", { type: "image/png" })),
    is_available: true,
    category_id: "cat-1",
    stock_quantity: 24,
    conditionings: [ { volume: "250 ml", price: "6.90" } ],
    ingredients: [ { name: "Piment chipotle", quantity: "5 %" } ],
    ...overrides,
  };
}

async function expectValidationError(data: unknown, expectedMessage: string) {
  try {
    await sauceCreateSchema.validate(data, { abortEarly: false });
    expect.fail("expected Yup validation to reject");
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError);
    expect((error as ValidationError).errors).toContain(expectedMessage);
  }
}

describe("sauceCreateSchema", () => {
  describe("global validation", () => {
    it("validates a complete and valid payload", async () => {
      const values = buildValidPayload();
      await expect(sauceCreateSchema.validate(values)).resolves.toEqual(
        expect.objectContaining({
          name: values.name,
          tagline: values.tagline,
          category_id: "cat-1",
          stock_quantity: 24,
        }),
      );
    });

    it("validates defaults once required fields are filled", async () => {
      const values = buildValidPayload({
        ...sauceCreateDefaultValues,
        name: "Nom",
        tagline: "Tag",
        description: "Desc",
        characteristic: "Car",
        image: fileListFromFile(new File(["b"], "x.png", { type: "image/png" })),
        category_id: "c1",
        conditionings: [ { volume: "200ml", price: "4" } ],
        ingredients: [ { name: "Sel", quantity: "1g" } ],
      });
      await expect(sauceCreateSchema.validate(values)).resolves.toBeDefined();
    });
  });

  describe("name field", () => {
    it("accepts a valid name", async () => {
      const result = await sauceCreateSchema.validate(buildValidPayload({ name: "Sauce tomate" }));
      expect(result.name).toBe("Sauce tomate");
    });

    it("rejects empty name", async () => {
      await expectValidationError(buildValidPayload({ name: "" }), "Le nom est requis.");
    });

    it("rejects name over max length", async () => {
      await expectValidationError(buildValidPayload({ name: "a".repeat(51) }), "50 caractères maximum.");
    });
  });

  describe("tagline field", () => {
    it("accepts a valid tagline", async () => {
      const result = await sauceCreateSchema.validate(buildValidPayload({ tagline: "Douce et epicee" }));
      expect(result.tagline).toBe("Douce et epicee");
    });

    it("rejects empty tagline", async () => {
      await expectValidationError(buildValidPayload({ tagline: "   " }), "L’accroche est requise.");
    });

    it("rejects tagline over max length", async () => {
      await expectValidationError(buildValidPayload({ tagline: "b".repeat(121) }), "120 caractères maximum.");
    });
  });

  describe("description field", () => {
    it("accepts a valid description", async () => {
      const result = await sauceCreateSchema.validate(buildValidPayload({ description: "Une description claire." }));
      expect(result.description).toBe("Une description claire.");
    });

    it("rejects empty description", async () => {
      await expectValidationError(buildValidPayload({ description: "" }), "La description est requise.");
    });

    it("rejects description over max length", async () => {
      await expectValidationError(buildValidPayload({ description: "c".repeat(5001) }), "Texte trop long.");
    });
  });

  describe("characteristic field", () => {
    it("accepts a valid characteristic", async () => {
      const result = await sauceCreateSchema.validate(buildValidPayload({ characteristic: "Intense" }));
      expect(result.characteristic).toBe("Intense");
    });

    it("rejects empty characteristic", async () => {
      await expectValidationError(buildValidPayload({ characteristic: "" }), "La caractéristique est requise.");
    });

    it("rejects characteristic over max length", async () => {
      await expectValidationError(buildValidPayload({ characteristic: "d".repeat(256) }), "255 caractères maximum.");
    });
  });

  describe("image field", () => {
    it("accepts a valid image file", async () => {
      const image = fileListFromFile(new File(["img"], "ok.png", { type: "image/png" }));
      const result = await sauceCreateSchema.validate(buildValidPayload({ image }));
      expect(result.image?.item(0)?.name).toBe("ok.png");
    });

    it("rejects undefined image", async () => {
      await expectValidationError(buildValidPayload({ image: undefined }), "L’image est requise.");
    });

    it("rejects empty file list", async () => {
      await expectValidationError(buildValidPayload({ image: emptyFileList() }), "L’image est requise.");
    });

    it("rejects files above 5 MiB", async () => {
      const huge = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.png", { type: "image/png" });
      await expectValidationError(
        buildValidPayload({ image: fileListFromFile(huge) }),
        "Image trop volumineuse (max 5 Mo).",
      );
    });

    it("rejects unsupported mime types", async () => {
      const pdf = new File(["%PDF"], "x.pdf", { type: "application/pdf" });
      await expectValidationError(
        buildValidPayload({ image: fileListFromFile(pdf) }),
        "Format d'image non supporté.",
      );
    });
  });

  describe("is_available field", () => {
    it("accepts false value", async () => {
      const result = await sauceCreateSchema.validate(buildValidPayload({ is_available: false }));
      expect(result.is_available).toBe(false);
    });

    it("rejects undefined value", async () => {
      await expectValidationError(
        buildValidPayload({ is_available: undefined as unknown as boolean }),
        "Disponibilité requise.",
      );
    });
  });

  describe("category_id field", () => {
    it("accepts a valid category id", async () => {
      const result = await sauceCreateSchema.validate(buildValidPayload({ category_id: "cat-2" }));
      expect(result.category_id).toBe("cat-2");
    });

    it("rejects empty category id", async () => {
      await expectValidationError(buildValidPayload({ category_id: "" }), "Choisissez une catégorie.");
    });
  });

  describe("stock_quantity field", () => {
    it("accepts stock quantity at zero", async () => {
      const result = await sauceCreateSchema.validate(buildValidPayload({ stock_quantity: 0 }));
      expect(result.stock_quantity).toBe(0);
    });

    it("rejects undefined stock quantity", async () => {
      await expectValidationError(
        buildValidPayload({ stock_quantity: undefined as unknown as number }),
        "Stock requis.",
      );
    });

    it("rejects null stock quantity", async () => {
      await expectValidationError(buildValidPayload({ stock_quantity: null as unknown as number }), "Stock requis.");
    });

    it("rejects non-integer stock quantity", async () => {
      await expectValidationError(
        buildValidPayload({ stock_quantity: 1.5 as unknown as number }),
        "Entier uniquement.",
      );
    });

    it("rejects negative stock quantity", async () => {
      await expectValidationError(buildValidPayload({ stock_quantity: -1 }), "Minimum 0.");
    });

    it("rejects non-numeric stock quantity", async () => {
      await expectValidationError(
        buildValidPayload({ stock_quantity: "x" as unknown as number }),
        "Quantité invalide.",
      );
    });
  });

  describe("conditionings field", () => {
    it("accepts one valid conditioning row", async () => {
      const result = await sauceCreateSchema.validate(
        buildValidPayload({ conditionings: [ { volume: "250 ml", price: "6.90" } ] }),
      );
      expect(result.conditionings).toEqual([ { volume: "250 ml", price: "6.90" } ]);
    });

    it("accepts valid decimal variations for price", async () => {
      const prices = ["10", "0.5", "0"] as const;
      for (const price of prices) {
        const result = await sauceCreateSchema.validate(
          buildValidPayload({ conditionings: [ { volume: "250 ml", price } ] }),
        );
        expect(result.conditionings[0]?.price).toBe(price);
      }
    });

    it("accepts optional serverId on row", async () => {
      const result = await sauceCreateSchema.validate(
        buildValidPayload({ conditionings: [ { volume: "250 ml", price: "6.90", serverId: "cond-api-1" } ] }),
      );
      expect(result.conditionings[0]).toEqual(
        expect.objectContaining({ serverId: "cond-api-1", volume: "250 ml", price: "6.90" }),
      );
    });

    it("rejects empty conditionings array", async () => {
      await expectValidationError(buildValidPayload({ conditionings: [] }), "Ajoutez au moins un conditionnement.");
    });

    it("rejects empty volume", async () => {
      await expectValidationError(
        buildValidPayload({ conditionings: [ { volume: "", price: "6.90" } ] }),
        "Le volume est requis.",
      );
    });

    it("rejects volume over max length", async () => {
      await expectValidationError(
        buildValidPayload({ conditionings: [ { volume: "e".repeat(21), price: "6.90" } ] }),
        "20 caractères max.",
      );
    });

    it("rejects empty price", async () => {
      await expectValidationError(
        buildValidPayload({ conditionings: [ { volume: "250 ml", price: "" } ] }),
        "Le prix est requis.",
      );
    });

    it("rejects invalid price format", async () => {
      await expectValidationError(
        buildValidPayload({ conditionings: [ { volume: "250 ml", price: "12.999" } ] }),
        "Prix invalide (ex. 6.90).",
      );
      await expectValidationError(
        buildValidPayload({ conditionings: [ { volume: "250 ml", price: "abc" } ] }),
        "Prix invalide (ex. 6.90).",
      );
    });
  });

  describe("ingredients field", () => {
    it("accepts one valid ingredient row", async () => {
      const result = await sauceCreateSchema.validate(
        buildValidPayload({ ingredients: [ { name: "Sel", quantity: "1g" } ] }),
      );
      expect(result.ingredients).toEqual([ { name: "Sel", quantity: "1g" } ]);
    });

    it("accepts optional serverId on row", async () => {
      const result = await sauceCreateSchema.validate(
        buildValidPayload({ ingredients: [ { name: "Piment", quantity: "5 %", serverId: "ing-api-1" } ] }),
      );
      expect(result.ingredients[0]).toEqual(
        expect.objectContaining({ serverId: "ing-api-1", name: "Piment", quantity: "5 %" }),
      );
    });

    it("rejects empty ingredients array", async () => {
      await expectValidationError(buildValidPayload({ ingredients: [] }), "Ajoutez au moins un ingrédient.");
    });

    it("rejects empty ingredient name", async () => {
      await expectValidationError(
        buildValidPayload({ ingredients: [ { name: "", quantity: "5 %" } ] }),
        "Le nom de l’ingrédient est requis.",
      );
    });

    it("rejects empty ingredient quantity", async () => {
      await expectValidationError(
        buildValidPayload({ ingredients: [ { name: "Piment", quantity: "" } ] }),
        "La quantité de l’ingrédient est requise.",
      );
    });

    it("rejects ingredient name over max length", async () => {
      await expectValidationError(
        buildValidPayload({ ingredients: [ { name: "f".repeat(101), quantity: "5 %" } ] }),
        "100 caractères maximum.",
      );
    });

    it("rejects ingredient quantity over max length", async () => {
      await expectValidationError(
        buildValidPayload({ ingredients: [ { name: "Piment", quantity: "g".repeat(101) } ] }),
        "100 caractères maximum.",
      );
    });
  });
});
