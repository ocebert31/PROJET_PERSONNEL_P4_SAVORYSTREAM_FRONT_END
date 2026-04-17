import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useForm } from "react-hook-form";
import { IngredientFieldsSection } from "../../../../components/Dashboard/Sauce/IngredientFieldsSection";
import { sauceCreateDefaultValues, type SauceCreateFormValues } from "../../../../schemas/sauceCreateSchema";

type InputFieldCall = {
  name: string;
  type?: string;
};

const inputFieldCalls: InputFieldCall[] = [];

vi.mock("../../../../common/fields/inputFieldForm", () => ({
  default: (props: InputFieldCall) => {
    inputFieldCalls.push(props);
    return <div data-testid={`input-field-form-${props.name}`} />;
  },
}));

type HarnessProps = {
  fieldIds: string[];
  onAppend?: () => void;
  onRemove?: (index: number) => void;
};

function Harness({ fieldIds, onAppend = vi.fn(), onRemove = vi.fn() }: HarnessProps) {
  const { register, formState } = useForm<SauceCreateFormValues>({
    defaultValues: sauceCreateDefaultValues,
  });

  const fields = fieldIds.map((id) => ({ id })) as Array<{ id: string }>;

  return (
    <IngredientFieldsSection
      register={register}
      errors={formState.errors}
      fields={fields as never}
      onAppend={onAppend}
      onRemove={onRemove}
    />
  );
}

describe("IngredientFieldsSection", () => {
  beforeEach(() => {
    inputFieldCalls.length = 0;
  });

  describe("nominal case", () => {
    it("renders fields for each ingredient row and add button", () => {
      render(<Harness fieldIds={["i-1", "i-2"]} />);

      expect(screen.getByTestId("input-field-form-ingredients.0.name")).toBeInTheDocument();
      expect(screen.getByTestId("input-field-form-ingredients.0.quantity")).toBeInTheDocument();
      expect(screen.getByTestId("input-field-form-ingredients.1.name")).toBeInTheDocument();
      expect(screen.getByTestId("input-field-form-ingredients.1.quantity")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Ajouter un ingrédient/i })).toBeInTheDocument();
    });

    it("passes expected field names to InputFieldForm", () => {
      render(<Harness fieldIds={["i-1"]} />);

      expect(inputFieldCalls).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "ingredients.0.name" }),
          expect.objectContaining({ name: "ingredients.0.quantity" }),
        ]),
      );
    });
  });

  describe("variations", () => {
    it("calls onAppend when add button is clicked", async () => {
      const user = userEvent.setup();
      const onAppend = vi.fn();
      render(<Harness fieldIds={["i-1"]} onAppend={onAppend} />);

      await user.click(screen.getByRole("button", { name: /Ajouter un ingrédient/i }));

      expect(onAppend).toHaveBeenCalledTimes(1);
    });

    it("shows remove buttons when more than one row and calls onRemove with row index", async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(<Harness fieldIds={["i-1", "i-2"]} onRemove={onRemove} />);

      const removeButtons = screen.getAllByRole("button", { name: /Supprimer cet ingrédient/i });
      expect(removeButtons).toHaveLength(2);

      await user.click(removeButtons[1]!);
      expect(onRemove).toHaveBeenCalledWith(1);
    });

    it("hides remove button when there is a single row", () => {
      render(<Harness fieldIds={["i-1"]} />);
      expect(screen.queryByRole("button", { name: /Supprimer cet ingrédient/i })).not.toBeInTheDocument();
    });
  });
});
