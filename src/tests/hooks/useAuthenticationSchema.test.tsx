import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuthenticationSchema } from "../../hooks/useAuthenticationSchema";
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

describe("useFormSchema", () => {
  const renderUseFormSchema = (isLoginPage: boolean) => renderHook(() => useAuthenticationSchema(isLoginPage));
  const mockSchema = expect.objectContaining({ resolver: expect.any(Function) });

  it("should call useForm with the correct schema when not on the login page", () => {
    renderUseFormSchema(false);
    expect(useForm).toHaveBeenCalledWith(mockSchema);
  });

  it("should call useForm with the correct schema when on the login page", () => {
    renderUseFormSchema(true);
    expect(useForm).toHaveBeenCalledWith(mockSchema);
  });
});

