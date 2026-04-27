import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import EntityRowActions from "../../../common/button/EntityRowActions";

describe("EntityRowActions", () => {
  describe("nominal case", () => {
    it("renders edit and delete actions and confirms delete", async () => {
      const onDeleteById = vi.fn().mockResolvedValue(true);
      const onDeleteSuccess = vi.fn();
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <EntityRowActions
            editTo="/dashboard/sauces/s-1/edit"
            editLabel="Editer la sauce BBQ"
            deleteItemName="la sauce BBQ"
            deleteId="s-1"
            onDeleteById={onDeleteById}
            onDeleteSuccess={onDeleteSuccess}
          />
        </MemoryRouter>,
      );

      expect(screen.getByRole("link", { name: "Editer la sauce BBQ" })).toHaveAttribute("href", "/dashboard/sauces/s-1/edit");
      await user.click(screen.getByRole("button", { name: "Supprimer la sauce BBQ" }));
      await user.click(screen.getByRole("button", { name: "Confirmer la suppression de la sauce BBQ" }));
      expect(onDeleteById).toHaveBeenCalledWith("s-1");
      expect(onDeleteSuccess).toHaveBeenCalledWith("s-1");
    });
  });

  describe("variations", () => {
    it("calls onOpenDeleteConfirm when delete flow opens", async () => {
      const onOpenDeleteConfirm = vi.fn();
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <EntityRowActions
            editTo="/dashboard/users/u-1/edit"
            editLabel="Editer l'utilisateur"
            deleteItemName="l'utilisateur"
            deleteId="u-1"
            onDeleteById={vi.fn().mockResolvedValue(true)}
            onOpenDeleteConfirm={onOpenDeleteConfirm}
          />
        </MemoryRouter>,
      );

      await user.click(screen.getByRole("button", { name: "Supprimer l'utilisateur" }));
      expect(onOpenDeleteConfirm).toHaveBeenCalledTimes(1);
    });

    it("does not call onDeleteSuccess when delete fails", async () => {
      const onDeleteSuccess = vi.fn();
      const onDeleteById = vi.fn().mockResolvedValue(false);
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <EntityRowActions
            editTo="/dashboard/categories/c-1/edit"
            editLabel="Editer la catégorie"
            deleteItemName="la catégorie"
            deleteId="c-1"
            onDeleteById={onDeleteById}
            onDeleteSuccess={onDeleteSuccess}
          />
        </MemoryRouter>,
      );

      await user.click(screen.getByRole("button", { name: "Supprimer la catégorie" }));
      await user.click(screen.getByRole("button", { name: "Confirmer la suppression de la catégorie" }));

      expect(onDeleteById).toHaveBeenCalledWith("c-1");
      expect(onDeleteSuccess).not.toHaveBeenCalled();
    });
  });
});
