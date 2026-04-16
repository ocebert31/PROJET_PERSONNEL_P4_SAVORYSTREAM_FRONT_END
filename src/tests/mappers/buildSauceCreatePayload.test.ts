import { describe, it, expect } from "vitest";
import { buildSauceCreatePayload } from "../../mappers/buildSauceCreatePayload";
import type { SauceCreateFormValues } from "../../schemas/sauceCreateSchema";

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

function nominalFormValues(): SauceCreateFormValues {
  const imageFile = new File(["x"], "pic.png", { type: "image/png" });
  return {
    name: "  Nom sauce  ",
    tagline: "  Accroche  ",
    description: "  Description  ",
    characteristic: "  Caractère  ",
    image: fileListFromFile(imageFile),
    is_available: true,
    category_id: "cat-99",
    stock_quantity: 42,
    conditionings: [ { volume: "  250 ml  ", price: "  6.90  " }, { volume: "  100 ml  ", price: "  3.40  " } ],
    ingredients: [ { name: "  Piment  ", quantity: "  5 g  " }, { name: "  Ail  ", quantity: "  2 g  " } ],
  };
}

describe("buildSauceCreatePayload", () => {
  describe("nominal case", () => {
    it("builds FormData with trimmed fields, stock, Rails-style nested keys, and image", () => {
      const values = nominalFormValues();
      const data = buildSauceCreatePayload(values);

      expect(data.get("name")).toBe("Nom sauce");
      expect(data.get("tagline")).toBe("Accroche");
      expect(data.get("description")).toBe("Description");
      expect(data.get("characteristic")).toBe("Caractère");
      expect(data.get("is_available")).toBe("true");
      expect(data.get("category_id")).toBe("cat-99");
      expect(data.get("stock[quantity]")).toBe("42");

      expect(data.getAll("conditionings[][volume]")).toEqual([ "250 ml", "100 ml" ]);
      expect(data.getAll("conditionings[][price]")).toEqual([ "6.90", "3.40" ]);
      expect(data.getAll("ingredients[][name]")).toEqual([ "Piment", "Ail" ]);
      expect(data.getAll("ingredients[][quantity]")).toEqual([ "5 g", "2 g" ]);

      const image = data.get("image");
      expect(image).toBeInstanceOf(File);
      expect((image as File).name).toBe("pic.png");
    });
  });

  describe("variations", () => {
    it("serializes is_available false as the string false", () => {
      const values = { ...nominalFormValues(), is_available: false };
      const data = buildSauceCreatePayload(values);
      expect(data.get("is_available")).toBe("false");
    });

    it("does not append image when values.image is undefined", () => {
      const values = { ...nominalFormValues(), image: undefined };
      const data = buildSauceCreatePayload(values);
      expect(data.get("image")).toBeNull();
    });

    it("does not append image when the file list is empty", () => {
      const values = { ...nominalFormValues(), image: emptyFileList() };
      const data = buildSauceCreatePayload(values);
      expect(data.get("image")).toBeNull();
    });

    it("does not append conditioning entries when conditionings is empty", () => {
      const values = { ...nominalFormValues(), conditionings: [] };
      const data = buildSauceCreatePayload(values);

      expect(data.getAll("conditionings[][volume]")).toEqual([]);
      expect(data.getAll("conditionings[][price]")).toEqual([]);
    });

    it("does not append ingredient entries when ingredients is empty", () => {
      const values = { ...nominalFormValues(), ingredients: [] };
      const data = buildSauceCreatePayload(values);

      expect(data.getAll("ingredients[][name]")).toEqual([]);
      expect(data.getAll("ingredients[][quantity]")).toEqual([]);
    });
  });
});
