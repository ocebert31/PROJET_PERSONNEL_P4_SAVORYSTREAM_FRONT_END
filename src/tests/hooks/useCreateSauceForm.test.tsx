import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateSauceForm } from "../../hooks/useCreateSauceForm";
import { SauceCreateSchema, sauceCreateDefaultValues } from "../../schemas/sauceCreateSchema";

const hoisted = vi.hoisted(() => ({
  useFormReturn: {
    register: vi.fn(),
    handleSubmit: vi.fn(),
    formState: { errors: {} },
  },
}));

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-hook-form")>();
  return {
    ...actual,
    useForm: vi.fn(() => hoisted.useFormReturn),
  };
});

vi.mock("@hookform/resolvers/yup", () => ({
  yupResolver: vi.fn(() => ({ resolver: "stub" })),
}));

vi.mock("../../schemas/sauceCreateSchema", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../schemas/sauceCreateSchema")>();
  return {
    ...actual,
    SauceCreateSchema: vi.fn(() => ({})),
  };
});

describe("useCreateSauceForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("nominal case", () => {
    it("calls SauceCreateSchema, wires yupResolver(schema) and useForm with defaultValues", () => {
      renderHook(() => useCreateSauceForm());

      expect(vi.mocked(SauceCreateSchema)).toHaveBeenCalledTimes(1);
      const builtSchema = vi.mocked(SauceCreateSchema).mock.results[0]?.value;
      expect(vi.mocked(yupResolver)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(yupResolver)).toHaveBeenCalledWith(builtSchema);

      const resolver = vi.mocked(yupResolver).mock.results[0]?.value;
      expect(vi.mocked(useForm)).toHaveBeenCalledWith({
        resolver,
        defaultValues: sauceCreateDefaultValues,
      });
    });

    it("returns the useForm return value", () => {
      const { result } = renderHook(() => useCreateSauceForm());
      expect(result.current).toBe(hoisted.useFormReturn);
    });
  });

  describe("variations", () => {
    it("invokes the wiring again on each hook mount", () => {
      renderHook(() => useCreateSauceForm());
      renderHook(() => useCreateSauceForm());

      expect(vi.mocked(SauceCreateSchema)).toHaveBeenCalledTimes(2);
      expect(vi.mocked(yupResolver)).toHaveBeenCalledTimes(2);
      expect(vi.mocked(useForm)).toHaveBeenCalledTimes(2);
    });
  });
});
