import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteAction from "../../../../common/button/delete/deleteAction";

describe("DeleteAction", () => {
  describe("nominal case", () => {
    it("opens inline confirmation and confirms deletion", async () => {
      const onConfirmDelete = vi.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<DeleteAction itemName="la sauce BBQ" onConfirmDelete={onConfirmDelete} />);

      await user.click(screen.getByRole("button", { name: "Supprimer la sauce BBQ" }));
      expect(screen.getByRole("button", { name: "Confirmer la suppression de la sauce BBQ" })).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Confirmer la suppression de la sauce BBQ" }));

      expect(onConfirmDelete).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("button", { name: "Confirmer la suppression de la sauce BBQ" })).not.toBeInTheDocument();
    });
  });

  describe("variations", () => {
    it("cancels inline confirmation without calling delete", async () => {
      const onConfirmDelete = vi.fn();
      const user = userEvent.setup();
      render(<DeleteAction itemName="la sauce BBQ" onConfirmDelete={onConfirmDelete} />);

      await user.click(screen.getByRole("button", { name: "Supprimer la sauce BBQ" }));
      await user.click(screen.getByRole("button", { name: "Annuler la suppression de la sauce BBQ" }));

      expect(onConfirmDelete).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: "Supprimer la sauce BBQ" })).toBeInTheDocument();
    });

    it("calls onOpenConfirm before showing confirmation", async () => {
      const onOpenConfirm = vi.fn();
      const user = userEvent.setup();
      render(
        <DeleteAction
          itemName="la sauce BBQ"
          onConfirmDelete={vi.fn()}
          onOpenConfirm={onOpenConfirm}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Supprimer la sauce BBQ" }));

      expect(onOpenConfirm).toHaveBeenCalledTimes(1);
      expect(screen.getByRole("button", { name: "Confirmer la suppression de la sauce BBQ" })).toBeInTheDocument();
    });

    it("disables delete trigger when isDeleting is true", () => {
      render(
        <DeleteAction
          itemName="la sauce BBQ"
          onConfirmDelete={vi.fn()}
          isDeleting
        />,
      );

      expect(screen.getByRole("button", { name: "Supprimer la sauce BBQ" })).toBeDisabled();
    });
  });
});