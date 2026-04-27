import { describe, it, expect } from "vitest";
import { appendSauceFormData } from "../../mappers/appendSauceFormData";

type SauceFormDataInput = {
  name: string;
  tagline: string;
  description: string;
  characteristic: string;
  is_available: boolean;
  category_id: string;
  stock_quantity: number;
  image?: FileList;
};

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

function nominalValues(overrides: Partial<SauceFormDataInput> = {}): SauceFormDataInput {
  return {
    name: "  Nom sauce  ",
    tagline: "  Accroche  ",
    description: "  Description  ",
    characteristic: "  Piquante  ",
    is_available: true,
    category_id: "  cat-99  ",
    stock_quantity: 42,
    image: fileListFromFile(new File(["x"], "pic.png", { type: "image/png" })),
    ...overrides,
  };
}

describe("appendSauceFormData", () => {
  describe("nominal case", () => {
    it("appends all scalar fields with trimming and appends first image file", () => {
      const data = new FormData();
      const values = nominalValues();

      appendSauceFormData(data, values);

      expect(data.get("name")).toBe("Nom sauce");
      expect(data.get("tagline")).toBe("Accroche");
      expect(data.get("description")).toBe("Description");
      expect(data.get("characteristic")).toBe("Piquante");
      expect(data.get("is_available")).toBe("true");
      expect(data.get("category_id")).toBe("cat-99");
      expect(data.get("stock[quantity]")).toBe("42");
      expect(data.get("image")).toBeInstanceOf(File);
      expect((data.get("image") as File).name).toBe("pic.png");
    });
  });

  describe("variations", () => {
    it("serializes is_available false as string false", () => {
      const data = new FormData();
      appendSauceFormData(data, nominalValues({ is_available: false }));
      expect(data.get("is_available")).toBe("false");
    });

    it("serializes stock_quantity 0 as string 0", () => {
      const data = new FormData();
      appendSauceFormData(data, nominalValues({ stock_quantity: 0 }));
      expect(data.get("stock[quantity]")).toBe("0");
    });

    it("does not append image when image is undefined", () => {
      const data = new FormData();
      appendSauceFormData(data, nominalValues({ image: undefined }));
      expect(data.get("image")).toBeNull();
    });

    it("does not append image when file list is empty", () => {
      const data = new FormData();
      appendSauceFormData(data, nominalValues({ image: emptyFileList() }));
      expect(data.get("image")).toBeNull();
    });

    it("keeps existing FormData entries and appends new values", () => {
      const data = new FormData();
      data.append("name", "Ancien nom");

      appendSauceFormData(data, nominalValues({ name: " Nouveau nom " }));

      expect(data.getAll("name")).toEqual(["Ancien nom", "Nouveau nom"]);
    });
  });
});
