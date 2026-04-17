import { useEffect, useMemo, useState } from "react";
import FieldWrapper from "../../../common/fields/fieldWrapper";
import type { SauceIdentityFieldsProps } from "../../../types/sauce";

type ImageFieldFormProps = Pick<SauceIdentityFieldsProps, "register" | "errors">;

function ImageFieldForm({ register, errors }: ImageFieldFormProps) {
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [selectedImageName, setSelectedImageName] = useState<string>("");

    useEffect(() => {
        return () => {
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        };
    }, [imagePreviewUrl]);

    const imageError = useMemo(() => {
        const msg = errors.image?.message;
        return typeof msg === "string" ? msg : null;
    }, [errors.image]);

    const imageRegistration = register("image", {
        onChange: (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            setSelectedImageName(file?.name ?? "");

            setImagePreviewUrl((previous) => {
                if (previous) URL.revokeObjectURL(previous);
                return file ? URL.createObjectURL(file) : null;
            });
        },
    });

    const imageErrorId = imageError ? "sauce-image-file-error" : undefined;

    return (
        <FieldWrapper label="Image (fichier)" htmlFor="sauce-image-file" required errorId={imageErrorId} error={imageError}>
            <input id="sauce-image-file" type="file" accept="image/*" required aria-describedby={imageErrorId}
                aria-invalid={Boolean(imageError) || undefined} className="hidden" {...imageRegistration}/>
            <div className="space-y-3">
                <label htmlFor="sauce-image-file" className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                    Parcourir
                </label>
                <p className="text-xs text-muted">{selectedImageName || "Aucun fichier sélectionné"}</p>
                {imagePreviewUrl && (
                <img src={imagePreviewUrl} alt="Aperçu de l’image sélectionnée"
                    className="h-28 w-28 rounded-xl border border-border object-cover"/>
                )}
            </div>
        </FieldWrapper>
    );
}

export default ImageFieldForm;
