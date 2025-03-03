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
    }
    loadArticles()
}, [])
   

    return (
        <div>
            <h2>Home Page</h2>
            <ul>
            {sauces.length > 0 ? ( sauces.map((sauce) => (
                <div key={sauce.id}>
                    <li>{sauce.nom}</li>
                    <li>{sauce.description}</li>
                </div>
                ))
            ) : (
                <p>Aucune sauce disponible</p>
            )}
            </ul>
        </div>
    )
}

export default HomePage;