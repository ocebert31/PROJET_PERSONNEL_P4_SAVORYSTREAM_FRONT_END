import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuthentication } from "../../hooks/useAuthentication";
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

describe("useAuthentication", () => {
  const renderUseAuthentication = (isLoginPage: boolean) => renderHook(() => useAuthentication(isLoginPage));
  const mockSchema = expect.objectContaining({
    resolver: expect.any(Function),
    mode: "all",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  it("should call useForm with the correct schema when not on the login page", () => {
    renderUseAuthentication(false);
    expect(useForm).toHaveBeenCalledWith(mockSchema);
  });

  it("should call useForm with the correct schema when on the login page", () => {
    renderUseAuthentication(true);
    expect(useForm).toHaveBeenCalledWith(mockSchema);
  });
});
