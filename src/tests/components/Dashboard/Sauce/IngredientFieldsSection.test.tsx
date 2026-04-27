import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useForm } from "react-hook-form";
import { IngredientFieldsSection } from "../../../../components/Dashboard/Sauce/IngredientFieldsSection";
import {
  sauceCreateDefaultValues,
  type SauceCreateFormValues,
  type SauceIngredientListFormSlice,
} from "../../../../schemas/sauceCreateSchema";

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
  rowMeta?: Array<{ serverId?: string }>;
  mode?: "create" | "edit";
  onAppend?: () => void;
  onRemove?: (index: number) => void;
  onDeletePersistedRow?: (index: number) => void;
  listActionsDisabled?: boolean;
  deletingRowIndex?: number | null;
};

function Harness({
  fieldIds,
  rowMeta,
  mode = "create",
  onAppend = vi.fn(),
  onRemove = vi.fn(),
  onDeletePersistedRow,
  listActionsDisabled,
  deletingRowIndex,
}: HarnessProps) {
  const { register, formState } = useForm<SauceCreateFormValues>({
    defaultValues: sauceCreateDefaultValues,
  });

  const fields = fieldIds.map((id, index) => ({
    id,
    name: "x",
    quantity: "1",
    ...rowMeta?.[index],
  })) as never;

  return (
    <IngredientFieldsSection
      register={register as unknown as UseFormRegister<SauceIngredientListFormSlice>}
      errors={formState.errors as unknown as FieldErrors<SauceIngredientListFormSlice>}
      fields={fields}
      onAppend={onAppend}
      onRemove={onRemove}
      mode={mode}
      onDeletePersistedRow={onDeletePersistedRow}
      listActionsDisabled={listActionsDisabled}
      deletingRowIndex={deletingRowIndex}
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

      const removeButtons = screen.getAllByRole("button", { name: /Retirer l'ingrédient/i });
      expect(removeButtons).toHaveLength(2);

      await user.click(removeButtons[1]!);
      expect(onRemove).toHaveBeenCalledWith(1);
    });

    it("hides remove button when there is a single row", () => {
      render(<Harness fieldIds={["i-1"]} />);
      expect(screen.queryByRole("button", { name: /Retirer l'ingrédient/i })).not.toBeInTheDocument();
    });
  });

  describe("edit mode", () => {
    it("shows delete action for a row with serverId", () => {
      render(<Harness fieldIds={["i-1"]} rowMeta={[{ serverId: "ing-99" }]} mode="edit" onDeletePersistedRow={vi.fn()} />);

      expect(screen.getByRole("button", { name: /Supprimer l'ingrédient #1/i })).toBeInTheDocument();
    });

    it("calls onDeletePersistedRow directly when clicking persisted delete", async () => {
      const user = userEvent.setup();
      const onDeletePersistedRow = vi.fn();
      render(
        <Harness
          fieldIds={["i-1"]}
          rowMeta={[{ serverId: "ing-99" }]}
          mode="edit"
          onDeletePersistedRow={onDeletePersistedRow}
        />,
      );

      await user.click(screen.getByRole("button", { name: /Supprimer l'ingrédient #1/i }));
      expect(onDeletePersistedRow).toHaveBeenCalledWith(0);
    });

    it("shows draft remove for a row without serverId when there are multiple rows", () => {
      render(
        <Harness
          fieldIds={["i-1", "i-2"]}
          rowMeta={[{ serverId: "ing-99" }, {}]}
          mode="edit"
          onDeletePersistedRow={vi.fn()}
          onRemove={vi.fn()}
        />,
      );

      expect(screen.getByRole("button", { name: /Retirer l'ingrédient #2/i })).toBeInTheDocument();
    });

    it("disables list actions when listActionsDisabled is true", () => {
      render(
        <Harness
          fieldIds={["i-1", "i-2"]}
          rowMeta={[{ serverId: "ing-99" }, {}]}
          mode="edit"
          onDeletePersistedRow={vi.fn()}
          onRemove={vi.fn()}
          listActionsDisabled
        />,
      );

      expect(screen.getByRole("button", { name: /Ajouter un ingrédient/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /Retirer l'ingrédient #2/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /Supprimer l'ingrédient #1/i })).toBeDisabled();
    });

    it("shows deleting label while a row is deleting", () => {
      render(
        <Harness
          fieldIds={["i-1"]}
          rowMeta={[{ serverId: "ing-99" }]}
          mode="edit"
          onDeletePersistedRow={vi.fn()}
          deletingRowIndex={0}
        />,
      );

      expect(screen.getByRole("button", { name: /Suppression de l'ingrédient #1/i })).toBeDisabled();
    });
  });
});
