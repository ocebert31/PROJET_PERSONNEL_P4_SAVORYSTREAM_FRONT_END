import { Trash2 } from "lucide-react";
import InputFieldForm from "../../../common/fields/inputFieldForm";
import Button from "../../../common/button/button";
import IconButton from "../../../common/button/iconButton";
import type { ConditioningFieldsSectionProps } from "../../../types/conditioning";

export function ConditioningFieldsSection({ register, errors, fields, onAppend, onRemove, mode = "create", onDeletePersistedRow, listActionsDisabled = false, deletingRowIndex = null }: ConditioningFieldsSectionProps) {
  const isEdit = mode === "edit";
  const getRemoveDraftAriaLabel = (index: number) => `Retirer le conditionnement #${index + 1}`;
  const getDeletePersistedAriaLabel = (index: number) => `Supprimer le conditionnement #${index + 1}`;

  return (
    <div className="mt-4 space-y-4">
      {fields.map((field, index) => {
        const serverId = "serverId" in field && typeof field.serverId === "string" ? field.serverId : undefined;
        const showLocalRemove = fields.length > 1;
        const showPersistedDelete = isEdit && Boolean(serverId);
        const showCreateRemove = !isEdit && showLocalRemove;
        const showEditDraftRemove = isEdit && !serverId && showLocalRemove;

        return (
          <div key={field.id} className="grid gap-4 rounded-2xl border border-border/70 p-4 sm:grid-cols-2">
            <div className="flex items-center justify-between sm:col-span-2">
              <p className="text-sm font-semibold text-foreground/80">Conditionnement #{index + 1}</p>
              {showCreateRemove || showEditDraftRemove ? (
                <IconButton type="button" variant="ghost" size="sm" disabled={listActionsDisabled} aria-label={getRemoveDraftAriaLabel(index)} title={getRemoveDraftAriaLabel(index)}onClick={() => onRemove(index)}>
                  <Trash2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                </IconButton>
              ) : null}
              {showPersistedDelete && onDeletePersistedRow ? (
                <IconButton type="button" variant="destructive" size="sm" disabled={deletingRowIndex === index || listActionsDisabled} aria-label={deletingRowIndex === index ? `Suppression du conditionnement #${index + 1}` : getDeletePersistedAriaLabel(index)} title={deletingRowIndex === index ? "Suppression…" : getDeletePersistedAriaLabel(index)} onClick={() => void onDeletePersistedRow(index)}>
                  <Trash2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                </IconButton>
              ) : null}
            </div>
            <InputFieldForm label={`Volume #${index + 1} (ex. 250ml)`} name={`conditionings.${index}.volume`} htmlFor={`cond-vol-${index}`} id={`cond-vol-${index}`} register={register} errors={errors} required autoComplete="off"/>
            <InputFieldForm label={`Prix #${index + 1} (ex. 6.90)`} name={`conditionings.${index}.price`} htmlFor={`cond-price-${index}`} id={`cond-price-${index}`} register={register} errors={errors} type="number" required min={0} step="0.01" inputMode="decimal"/>
          </div>
        );
      })}
      <Button type="button" variant="secondary" size="md" disabled={listActionsDisabled} onClick={onAppend}>
        Ajouter un conditionnement
      </Button>
    </div>
  );
}
