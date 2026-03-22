import { useState } from "react";
import type { SauceTabsProps } from "../../../../types/Sauce";

function SauceTabs({ caracteristique, ingredients }: SauceTabsProps) {
  const [activeTab, setActiveTab] = useState<"caracteristique" | "ingredients">("caracteristique");

  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap gap-2 border-b border-border pb-4 sm:gap-3">
        {(["caracteristique", "ingredients"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === tab
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-background text-muted hover:bg-border/60 hover:text-foreground"
            }`}
          >
            {tab === "caracteristique" ? "Caractéristiques" : "Ingrédients"}
          </button>
        ))}
      </div>
      <div className="pt-6 text-left text-foreground/90">
        {activeTab === "caracteristique" && (
          <p className="leading-relaxed text-muted">{caracteristique || "Aucune caractéristique disponible."}</p>
        )}
        {activeTab === "ingredients" && (
          <ul className="space-y-2">
            {ingredients?.length ? (
              ingredients.map((i) => (
                <li
                  key={i.id}
                  className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2 last:border-0"
                >
                  <span className="font-medium text-foreground">{i.name}</span>
                  <span className="tabular-nums text-sm text-muted">{i.quantité}</span>
                </li>
              ))
            ) : (
              <li className="text-muted">Aucun ingrédient disponible.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SauceTabs;
