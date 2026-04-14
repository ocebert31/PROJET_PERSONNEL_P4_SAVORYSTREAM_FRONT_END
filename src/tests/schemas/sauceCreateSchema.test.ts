import { describe, it, expect, beforeAll } from "vitest";
import { ValidationError } from "yup";
import {
  SauceCreateSchema,
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

function validPayload(overrides: Partial<SauceCreateFormValues> = {}): SauceCreateFormValues {
  return {
    name: "Sauce barbecue",
    tagline: "Fumée et équilibrée",
    description: "Une sauce pour viandes grillées.",
    characteristic: "Fumée",
    image: fileListFromFile(new File(["x"], "sauce.png", { type: "image/png" })),
    is_available: true,
    category_id: "cat-1",
    stock_quantity: 24,
    conditioning_volume: "250 ml",
    conditioning_price: "6.90",
    ingredient_name: "Piment chipotle",
    ingredient_quantity: "5 %",
    ...overrides,
  };
}

let schema: ReturnType<typeof SauceCreateSchema>;

async function expectRejectedWithMessage(data: unknown, expectedMessage: string) {
  try {
    await schema.validate(data, { abortEarly: false });
    expect.fail("expected Yup validation to reject");
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError);
    expect((error as ValidationError).errors).toContain(expectedMessage);
  }
}

describe("sauceCreateSchema", () => {
  beforeAll(() => {
    schema = SauceCreateSchema();
  });

  describe("nominal case", () => {
    it("validates a full valid admin payload", async () => {
      const values = validPayload();
      await expect(schema.validate(values)).resolves.toEqual(
        expect.objectContaining({
          name: values.name,
          tagline: values.tagline,
          category_id: "cat-1",
          stock_quantity: 24,
          conditioning_price: "6.90",
        }),
      );
    });

    it("validates when starting from default values and filling required fields only", async () => {
      const data = {
        ...sauceCreateDefaultValues,
        name: "Nom",
        tagline: "Tag",
        description: "Desc",
        characteristic: "Car",
        image: fileListFromFile(new File(["b"], "x.png", { type: "image/png" })),
        category_id: "c1",
        conditioning_volume: "200ml",
        conditioning_price: "4",
        ingredient_name: "Sel",
        ingredient_quantity: "1g",
      };
      await expect(schema.validate(data)).resolves.toBeDefined();
    });

    it("accepts is_available false", async () => {
      const result = await schema.validate(validPayload({ is_available: false }));
      expect(result.is_available).toBe(false);
    });

    it("accepts stock_quantity 0", async () => {
      const result = await schema.validate(validPayload({ stock_quantity: 0 }));
      expect(result.stock_quantity).toBe(0);
    });

    it.each([
      ["10", "10"],
      ["0.5", "0.5"],
      ["0", "0"],
    ] as const)("accepts conditioning_price %s as valid", async (input, expected) => {
      const result = await schema.validate(validPayload({ conditioning_price: input }));
      expect(result.conditioning_price).toBe(expected);
    });
  });

  describe("variations", () => {
    describe("required text and select fields", () => {
      it.each([
        ["name", { ...validPayload(), name: "" }, "Le nom est requis."],
        ["tagline", { ...validPayload(), tagline: "   " }, "L’accroche est requise."],
        ["description", { ...validPayload(), description: "" }, "La description est requise."],
        ["characteristic", { ...validPayload(), characteristic: "" }, "La caractéristique est requise."],
        ["category_id", { ...validPayload(), category_id: "" }, "Choisissez une catégorie."],
        ["conditioning_volume", { ...validPayload(), conditioning_volume: "" }, "Le volume est requis."],
        ["conditioning_price", { ...validPayload(), conditioning_price: "" }, "Le prix est requis."],
        ["ingredient_name", { ...validPayload(), ingredient_name: "" }, "Le nom de l’ingrédient est requis."],
        ["ingredient_quantity", { ...validPayload(), ingredient_quantity: "" }, "La quantité de l’ingrédient est requise."],
      ] as const)("rejects empty %s", async (_field, data, message) => {
        await expectRejectedWithMessage(data, message);
      });
    });

    describe("image", () => {
      it("rejects when image is undefined", async () => {
        await expectRejectedWithMessage({ ...validPayload(), image: undefined }, "L’image est requise.");
      });

      it("rejects when file list is empty", async () => {
        await expectRejectedWithMessage({ ...validPayload(), image: emptyFileList() }, "L’image est requise.");
      });

      it("rejects file over 5 MiB", async () => {
        const huge = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.png", { type: "image/png" });
        await expectRejectedWithMessage({ ...validPayload(), image: fileListFromFile(huge) }, "Image trop volumineuse (max 5 Mo).");
      });

      it("rejects non-image MIME type", async () => {
        const pdf = new File(["%PDF"], "x.pdf", { type: "application/pdf" });
        await expectRejectedWithMessage({ ...validPayload(), image: fileListFromFile(pdf) }, "Format d'image non supporte.");
      });
    });

    describe("is_available", () => {
      it("rejects when undefined", async () => {
        await expectRejectedWithMessage(
          { ...validPayload(), is_available: undefined as unknown as boolean },
          "Disponibilité requise.",
        );
      });

      it("rejects when the key is absent", async () => {
        const data = { ...validPayload() } as Record<string, unknown>;
        delete data.is_available;
        await expectRejectedWithMessage(data as SauceCreateFormValues, "Disponibilité requise.");
      });
    });

    describe("stock_quantity", () => {
      it("rejects when undefined", async () => {
        await expectRejectedWithMessage(
          { ...validPayload(), stock_quantity: undefined as unknown as number },
          "Stock requis.",
        );
      });

      it("rejects when null", async () => {
        await expectRejectedWithMessage({ ...validPayload(), stock_quantity: null as unknown as number }, "Stock requis.");
      });

      it("rejects non-integer", async () => {
        await expectRejectedWithMessage({ ...validPayload(), stock_quantity: 1.5 as unknown as number }, "Entier uniquement.");
      });

      it("rejects negative values", async () => {
        await expectRejectedWithMessage({ ...validPayload(), stock_quantity: -1 }, "Minimum 0.");
      });

      it("rejects non-numeric values", async () => {
        await expectRejectedWithMessage({ ...validPayload(), stock_quantity: "x" as unknown as number }, "Quantité invalide.");
      });
    });

    describe("max string lengths", () => {
      it.each([
        ["name", { ...validPayload(), name: "a".repeat(51) }, "50 caractères maximum."],
        ["tagline", { ...validPayload(), tagline: "b".repeat(121) }, "120 caractères maximum."],
        ["description", { ...validPayload(), description: "c".repeat(5001) }, "Texte trop long."],
        ["characteristic", { ...validPayload(), characteristic: "d".repeat(256) }, "255 caractères maximum."],
        ["conditioning_volume", { ...validPayload(), conditioning_volume: "e".repeat(21) }, "20 caractères max."],
        ["ingredient_name", { ...validPayload(), ingredient_name: "f".repeat(101) }, "100 caractères maximum."],
        ["ingredient_quantity", { ...validPayload(), ingredient_quantity: "g".repeat(101) }, "100 caractères maximum."],
      ] as const)("rejects %s over max length", async (_field, data, message) => {
        await expectRejectedWithMessage(data, message);
      });
    });

    describe("conditioning_price format", () => {
      it("rejects too many decimal places", async () => {
        await expectRejectedWithMessage({ ...validPayload(), conditioning_price: "12.999" }, "Prix invalide (ex. 6.90).");
      });

      it("rejects non-numeric string", async () => {
        await expectRejectedWithMessage({ ...validPayload(), conditioning_price: "abc" }, "Prix invalide (ex. 6.90).");
      });
    });
  });
});
