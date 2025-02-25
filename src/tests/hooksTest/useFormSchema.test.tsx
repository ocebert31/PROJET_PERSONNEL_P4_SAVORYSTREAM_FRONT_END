import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { useFormSchema } from "../../hooks/useFormSchema";

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

describe("useFormSchema", () => {
  it("should call useForm with the yupResolver of the registerSchema", () => {
    renderHook(() => useFormSchema());
    expect(useForm).toHaveBeenCalledWith(
        expect.objectContaining({ resolver: expect.any(Function) })
    );  
  });
});
