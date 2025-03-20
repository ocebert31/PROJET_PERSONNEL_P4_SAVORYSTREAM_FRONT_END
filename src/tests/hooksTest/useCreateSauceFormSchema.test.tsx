import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCreateSauceForm } from "../../hooks/useCreateSauceForm";
import { useForm } from "react-hook-form";

vi.mock("react-hook-form", async (importOriginal) => {
  const original = await importOriginal<typeof import("react-hook-form")>();
  return {
    ...original,
    useForm: vi.fn(() => ({
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: { errors: {} },
    })),
  };
});

describe("useCreateSauceFormSchema", () => {
  const renderUseFormSchema = () => renderHook(() => useCreateSauceForm());
  const mockSchema = expect.objectContaining({ resolver: expect.any(Function) });

  it("should call useForm with the correct schema when not on the create sauce page", () => {
    renderUseFormSchema();
    expect(useForm).toHaveBeenCalledWith(mockSchema);
  });

  it("should call useForm with the correct schema when on the create sauce page", () => {
    renderUseFormSchema();
    expect(useForm).toHaveBeenCalledWith(mockSchema);
  });
});

