import { useState } from "react";
import { SauceTabsProps } from "../../../types/Sauce";

function SauceTabs({ caracteristique, ingredients }: SauceTabsProps) {
    const [activeTab, setActiveTab] = useState<"caracteristique" | "ingredients">("caracteristique");

    return (
        <div className="mt-12 bg-white rounded-3xl p-6">
            <div className="flex justify-start gap-4 mb-6">
                {["caracteristique", "ingredients"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab as "caracteristique" | "ingredients")}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${
                        activeTab === tab ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                        {tab === "caracteristique" ? "Caractéristique" : "Ingrédients"}
                    </button>
                ))}
            </div>
            <div className="text-left text-gray-700">
                {activeTab === "caracteristique" && (
                <p>{caracteristique || "Aucune caractéristique disponible."}</p>
                )}
                {activeTab === "ingredients" && (
                <ul className="list-none pl-0 space-y-1">
                    {ingredients?.length
                    ? ingredients.map((i) => (
                        <li key={i.id}>{i.name} - {i.quantité}</li>
                        ))
                    : <li>Aucun ingrédient disponible.</li>
                    }
                </ul>
                )}
            </div>
        </div>
    );
}

export default SauceTabs;
