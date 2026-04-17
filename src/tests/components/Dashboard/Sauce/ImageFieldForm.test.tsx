import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useForm, type FieldErrors } from "react-hook-form";
import ImageFieldForm from "../../../../components/Dashboard/Sauce/ImageFieldForm";
import { sauceCreateDefaultValues, type SauceCreateFormValues } from "../../../../schemas/sauceCreateSchema";

const fieldWrapperProps: { label?: string; htmlFor?: string; error: string | null }[] = [];

vi.mock("../../../../common/fields/fieldWrapper", () => ({
  default: (props: { label?: string; htmlFor?: string; error: string | null; children: ReactNode }) => {
    fieldWrapperProps.push({ label: props.label, htmlFor: props.htmlFor, error: props.error });
    return (
      <div data-testid="field-wrapper">
        {props.label ? <span data-testid="wrapper-label">{props.label}</span> : null}
        {props.error ? <span data-testid="wrapper-error">{props.error}</span> : null}
        {props.children}
      </div>
    );
  },
}));

function Harness({ errors }: { errors?: Pick<FieldErrors<SauceCreateFormValues>, "image"> }) {
  const { register, formState } = useForm<SauceCreateFormValues>({
    defaultValues: sauceCreateDefaultValues,
  });

  const mergedErrors = { ...formState.errors, ...errors } as FieldErrors<SauceCreateFormValues>;

  return <ImageFieldForm register={register} errors={mergedErrors} />;
}

describe("ImageFieldForm", () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    fieldWrapperProps.length = 0;
    URL.createObjectURL = vi.fn(() => "blob:preview") as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL;
  });

  afterEach(() => {
    vi.restoreAllMocks();

    URL.createObjectURL =
      typeof originalCreateObjectURL === "function"
        ? originalCreateObjectURL
        : (() => "blob:stub") as unknown as typeof URL.createObjectURL;

    URL.revokeObjectURL =
      typeof originalRevokeObjectURL === "function"
        ? originalRevokeObjectURL
        : (() => {}) as unknown as typeof URL.revokeObjectURL;
  });

  describe("nominal case", () => {
    it("shows browse UI and no error when image field is valid", () => {
      render(<Harness />);

      expect(screen.getByTestId("wrapper-label")).toHaveTextContent("Image (fichier)");
      const lastWrapper = fieldWrapperProps[fieldWrapperProps.length - 1];
      expect(lastWrapper?.htmlFor).toBe("sauce-image-file");
      expect(screen.getByText("Parcourir")).toBeInTheDocument();
      expect(screen.getByText("Aucun fichier sélectionné")).toBeInTheDocument();
      expect(screen.queryByTestId("wrapper-error")).not.toBeInTheDocument();
    });

    it("shows file name and preview after selecting an image", async () => {
      const user = userEvent.setup();
      render(<Harness />);

      const file = new File(["x"], "sauce.png", { type: "image/png" });
      const input = document.getElementById("sauce-image-file") as HTMLInputElement;

      await user.upload(input, file);

      expect(screen.getByText("sauce.png")).toBeInTheDocument();
      await waitFor(() => {
        const img = screen.getByRole("img", { name: /Aperçu/i });
        expect(img).toHaveAttribute("src", "blob:preview");
      });
      expect(URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe("variations", () => {
    it("revokes previous preview URL when selecting a different file", async () => {
      const user = userEvent.setup();
      const createSpy = vi
        .mocked(URL.createObjectURL)
        .mockReturnValueOnce("blob:first")
        .mockReturnValueOnce("blob:second");

      render(<Harness />);

      const input = document.getElementById("sauce-image-file") as HTMLInputElement;
      await user.upload(input, new File(["a"], "first.png", { type: "image/png" }));

      await waitFor(() => {
        expect(screen.getByRole("img", { name: /Aperçu/i })).toHaveAttribute("src", "blob:first");
      });

      await user.upload(input, new File(["b"], "second.png", { type: "image/png" }));

      await waitFor(() => {
        expect(screen.getByRole("img", { name: /Aperçu/i })).toHaveAttribute("src", "blob:second");
      });

      expect(createSpy).toHaveBeenCalledTimes(2);
      expect(vi.mocked(URL.revokeObjectURL)).toHaveBeenCalledWith("blob:first");
    });

    it("clears preview and filename when the file input is cleared", async () => {
      const user = userEvent.setup();
      vi.mocked(URL.createObjectURL).mockReturnValueOnce("blob:only");

      render(<Harness />);

      const input = document.getElementById("sauce-image-file") as HTMLInputElement;
      await user.upload(input, new File(["a"], "only.png", { type: "image/png" }));

      await waitFor(() => {
        expect(screen.getByRole("img", { name: /Aperçu/i })).toBeInTheDocument();
      });

      fireEvent.change(input, { target: { files: null } });

      await waitFor(() => {
        expect(screen.queryByRole("img", { name: /Aperçu/i })).not.toBeInTheDocument();
      });
      expect(screen.getByText("Aucun fichier sélectionné")).toBeInTheDocument();
      expect(vi.mocked(URL.revokeObjectURL)).toHaveBeenCalledWith("blob:only");
    });

    it("shows validation error message from errors.image", () => {
      render(
        <Harness
          errors={{
            image: { message: "Image is required", type: "validate" },
          }}
        />,
      );

      expect(screen.getByTestId("wrapper-error")).toHaveTextContent("Image is required");
    });

    it("treats non-string error message as no error text", () => {
      render(
        <Harness
          errors={{
            image: { message: 123 as unknown as string, type: "validate" },
          }}
        />,
      );

      expect(screen.queryByTestId("wrapper-error")).not.toBeInTheDocument();
    });
  });
});
