import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useForm } from "react-hook-form";
import { ConditioningFieldsSection } from "../../../../components/Dashboard/Sauce/ConditioningFieldsSection";
import {
  sauceCreateDefaultValues,
  type SauceConditioningListFormSlice,
  type SauceCreateFormValues,
} from "../../../../schemas/sauceCreateSchema";

type InputFieldCall = {
  name: string;
  type?: string;
  min?: number | string;
  step?: number | string;
  inputMode?: string;
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
    volume: "",
    price: "1",
    ...rowMeta?.[index],
  })) as never;

  return (
    <ConditioningFieldsSection
      register={register as unknown as UseFormRegister<SauceConditioningListFormSlice>}
      errors={formState.errors as unknown as FieldErrors<SauceConditioningListFormSlice>}
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

describe("ConditioningFieldsSection", () => {
  beforeEach(() => {
    inputFieldCalls.length = 0;
  });

  describe("nominal case", () => {
    it("renders fields for each conditioning row and add button", () => {
      render(<Harness fieldIds={["c-1", "c-2"]} />);

      expect(screen.getByTestId("input-field-form-conditionings.0.volume")).toBeInTheDocument();
      expect(screen.getByTestId("input-field-form-conditionings.0.price")).toBeInTheDocument();
      expect(screen.getByTestId("input-field-form-conditionings.1.volume")).toBeInTheDocument();
      expect(screen.getByTestId("input-field-form-conditionings.1.price")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Ajouter un conditionnement/i })).toBeInTheDocument();
    });
  });

  describe("variations", () => {
    it("calls onAppend when add button is clicked", async () => {
      const user = userEvent.setup();
      const onAppend = vi.fn();
      render(<Harness fieldIds={["c-1"]} onAppend={onAppend} />);

      await user.click(screen.getByRole("button", { name: /Ajouter un conditionnement/i }));

      expect(onAppend).toHaveBeenCalledTimes(1);
    });

    it("shows remove buttons when more than one row and calls onRemove with row index", async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(<Harness fieldIds={["c-1", "c-2"]} onRemove={onRemove} />);

      const removeButtons = screen.getAllByRole("button", { name: /Retirer le conditionnement/i });
      expect(removeButtons).toHaveLength(2);

      await user.click(removeButtons[1]!);
      expect(onRemove).toHaveBeenCalledWith(1);
    });

    it("hides remove button when there is a single row", () => {
      render(<Harness fieldIds={["c-1"]} />);
      expect(screen.queryByRole("button", { name: /Retirer le conditionnement/i })).not.toBeInTheDocument();
    });
  });

  describe("edit mode", () => {
    it("shows delete action for a row with serverId", () => {
      render(<Harness fieldIds={["c-1"]} rowMeta={[{ serverId: "cond-99" }]} mode="edit" onDeletePersistedRow={vi.fn()} />);

      expect(screen.getByRole("button", { name: /Supprimer le conditionnement #1/i })).toBeInTheDocument();
    });

    it("calls onDeletePersistedRow directly when clicking persisted delete", async () => {
      const user = userEvent.setup();
      const onDeletePersistedRow = vi.fn();
      render(
        <Harness
          fieldIds={["c-1"]}
          rowMeta={[{ serverId: "cond-99" }]}
          mode="edit"
          onDeletePersistedRow={onDeletePersistedRow}
        />,
      );

      await user.click(screen.getByRole("button", { name: /Supprimer le conditionnement #1/i }));
      expect(onDeletePersistedRow).toHaveBeenCalledWith(0);
    });

    it("disables list actions when listActionsDisabled is true", () => {
      render(
        <Harness
          fieldIds={["c-1", "c-2"]}
          rowMeta={[{ serverId: "cond-99" }, {}]}
          mode="edit"
          onDeletePersistedRow={vi.fn()}
          onRemove={vi.fn()}
          listActionsDisabled
        />,
      );

      expect(screen.getByRole("button", { name: /Ajouter un conditionnement/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /Retirer le conditionnement #2/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /Supprimer le conditionnement #1/i })).toBeDisabled();
    });

    it("shows deleting label while a row is deleting", () => {
      render(
        <Harness
          fieldIds={["c-1"]}
          rowMeta={[{ serverId: "cond-99" }]}
          mode="edit"
          onDeletePersistedRow={vi.fn()}
          deletingRowIndex={0}
        />,
      );

      expect(screen.getByRole("button", { name: /Suppression du conditionnement #1/i })).toBeDisabled();
    });
  });
});
