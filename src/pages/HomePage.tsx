import { useEffect, useState } from "react";
import { getSauces } from "../services/sauceServices";
import { Sauce } from "../types/Sauce";

function HomePage() {
    const [sauces, setSauces] = useState<Sauce[]>([]);

    useEffect(() => {
        const loadArticles = async () => {
            try {
                const result = await getSauces();
                setSauces(result);
            } catch {
                console.error("Erreur lors de la récupération des sauces.");
            }
        };
        loadArticles();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-6">Page d'Accueil</h2>
            <ul className="space-y-4">
                {sauces.length > 0 ? (
                    sauces.map((sauce) => (
                        <div
                            key={sauce.id}
                            className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <li className="text-xl font-semibold text-secondary">{sauce.nom}</li>
                            <li className="mt-2 text-gray-600">{sauce.description}</li>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Aucune sauce disponible</p>
                )}
            </ul>
        </div>
    );
}

export default HomePage;
