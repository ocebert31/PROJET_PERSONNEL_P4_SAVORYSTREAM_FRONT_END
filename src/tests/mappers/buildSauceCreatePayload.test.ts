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
    conditioning_volume: "  250 ml  ",
    conditioning_price: "  6.90  ",
    ingredient_name: "  Piment  ",
    ingredient_quantity: "  5 g  ",
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

      expect(data.get("conditionings[][volume]")).toBe("250 ml");
      expect(data.get("conditionings[][price]")).toBe("6.90");
      expect(data.get("ingredients[][name]")).toBe("Piment");
      expect(data.get("ingredients[][quantity]")).toBe("5 g");

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
  });
});
