import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useForm } from "react-hook-form";
import { SauceIdentityFields } from "../../../../components/Dashboard/Sauce/SauceIdentityFields";
import { sauceCreateDefaultValues, type SauceCreateFormValues } from "../../../../schemas/sauceCreateSchema";

const inputFieldCalls: { name: string; type?: string }[] = [];

vi.mock("../../../../common/Fields/InputFieldForm", () => ({
  default: (props: { name: string; type?: string }) => {
    inputFieldCalls.push({ name: props.name, type: props.type });
    return <div data-testid={`input-field-form-${props.name}`} />;
  },
}));

vi.mock("../../../../components/Dashboard/Sauce/ImageFieldForm", () => ({
  default: () => <div data-testid="image-field-form" />,
}));

function Harness() {
  const { register, formState } = useForm<SauceCreateFormValues>({
    defaultValues: sauceCreateDefaultValues,
  });

  return <SauceIdentityFields register={register} errors={formState.errors} />;
}

describe("SauceIdentityFields", () => {
  beforeEach(() => {
    inputFieldCalls.length = 0;
  });

  describe("nominal case", () => {
    it("renders identity inputs and image field", () => {
      const { getByTestId } = render(<Harness />);

      expect(getByTestId("input-field-form-name")).toBeInTheDocument();
      expect(getByTestId("input-field-form-tagline")).toBeInTheDocument();
      expect(getByTestId("input-field-form-description")).toBeInTheDocument();
      expect(getByTestId("input-field-form-characteristic")).toBeInTheDocument();
      expect(getByTestId("image-field-form")).toBeInTheDocument();
    });

    it("passes correct field names and textarea type to InputFieldForm", () => {
      render(<Harness />);

      expect(inputFieldCalls).toEqual(
        expect.arrayContaining([
          { name: "name" },
          { name: "tagline" },
          { name: "description", type: "textarea" },
          { name: "characteristic" },
        ]),
      );
    });
  });

  describe("variations", () => {
    it("does not render unexpected field names", () => {
      render(<Harness />);

      const names = inputFieldCalls.map((c) => c.name);
      expect(names).not.toContain("stock_quantity");
      expect(names).not.toContain("category_id");
    });
  });
});
