import { useState, useMemo, useEffect } from "react";
import saucesData from "../data/sauces.json";
import { Conditioning, Sauce } from "../types/sauce";

export function useSauceDetail(id: string | undefined) {
    const numericId = id ? parseInt(id, 10) : NaN;

    const sauce = useMemo<Sauce | undefined>(
        () => saucesData.find((s) => s.id === numericId),
        [numericId]
    );

    const smallestCondId = useMemo<number | null>(() => {
        if (!sauce || sauce.conditionnements.length === 0) return null;
        const smallest = sauce.conditionnements.reduce((min, cond) =>
            parseFloat(cond.volume) < parseFloat(min.volume) ? cond : min
        );
        return smallest.id;
    }, [sauce]);

    const [selectedCond, setSelectedCond] = useState<number | null>(smallestCondId);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        setSelectedCond(smallestCondId);
        setQuantity(1);
    }, [smallestCondId]);

    const selected = useMemo<Conditioning | undefined>(
        () => sauce?.conditionnements.find((c) => c.id === selectedCond),
        [sauce, selectedCond]
    );

  return { sauce, selected, selectedCond, setSelectedCond, quantity, setQuantity };
}
