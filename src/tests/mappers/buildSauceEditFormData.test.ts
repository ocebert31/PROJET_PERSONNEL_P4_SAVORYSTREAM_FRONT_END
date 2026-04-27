import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildSauceEditFormData } from "../../mappers/buildSauceEditFormData";
import { appendSauceFormData } from "../../mappers/appendSauceFormData";

vi.mock("../../mappers/appendSauceFormData", () => ({
  appendSauceFormData: vi.fn(),
}));

const APPEND_SAUCE_FORM_DATA_MOCK = vi.mocked(appendSauceFormData);

type SauceEditFormSlice = {
  name: string;
  tagline: string;
  description: string;
  characteristic: string;
  is_available: boolean;
  category_id: string;
  stock_quantity: number;
  image?: FileList;
};

function buildNominalValues(overrides: Partial<SauceEditFormSlice> = {}): SauceEditFormSlice {
  return {
    name: "Nom",
    tagline: "Accroche",
    description: "Description",
    characteristic: "Piquant",
    is_available: true,
    category_id: "cat-1",
    stock_quantity: 7,
    image: undefined,
    ...overrides,
  };
}

describe("buildSauceEditFormData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("nominal case", () => {
    it("creates a FormData and delegates append to appendSauceFormData", () => {
      const values = buildNominalValues();
      const fd = buildSauceEditFormData(values);

      expect(fd).toBeInstanceOf(FormData);
      expect(APPEND_SAUCE_FORM_DATA_MOCK).toHaveBeenCalledTimes(1);
      expect(APPEND_SAUCE_FORM_DATA_MOCK).toHaveBeenCalledWith(fd, values);
    });
  });

  describe("variations", () => {
    it("delegates the exact input when an image is provided", () => {
      const file = new File([""], "pic.png", { type: "image/png" });
      const image = {
        0: file,
        length: 1,
        item: (index: number) => (index === 0 ? file : null),
        [Symbol.iterator]: function* fileListIterator() {
          yield file;
        },
      } as unknown as FileList;
      const values = buildNominalValues({ image, is_available: false, stock_quantity: 0 });
      const fd = buildSauceEditFormData(values);

      expect(fd).toBeInstanceOf(FormData);
      expect(APPEND_SAUCE_FORM_DATA_MOCK).toHaveBeenCalledTimes(1);
      expect(APPEND_SAUCE_FORM_DATA_MOCK).toHaveBeenCalledWith(fd, values);
    });
  });
});
