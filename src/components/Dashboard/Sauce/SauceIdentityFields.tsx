import InputFieldForm from "../../../common/fields/inputFieldForm";
import ImageFieldForm from "./ImageFieldForm";
import type { SauceIdentityFieldsProps } from "../../../types/sauce";

export function SauceIdentityFields({ register, errors, imageOptional = false }: SauceIdentityFieldsProps) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <InputFieldForm label="Nom" name="name" htmlFor="sauce-name" id="sauce-name" register={register} errors={errors} required autoComplete="off" />
        <InputFieldForm label="Accroche" name="tagline" htmlFor="sauce-tagline" id="sauce-tagline" register={register} errors={errors} required autoComplete="off" />
      </div>
      <InputFieldForm label="Description" name="description" htmlFor="sauce-description" id="sauce-description" register={register} errors={errors} type="textarea" required />
      <div className="grid gap-6 sm:grid-cols-2">
        <InputFieldForm label="Caractéristique" name="characteristic" htmlFor="sauce-char" id="sauce-char" register={register} errors={errors} required autoComplete="off" />
        <ImageFieldForm register={register} errors={errors} imageOptional={imageOptional} />
      </div>
    </>
  );
}
