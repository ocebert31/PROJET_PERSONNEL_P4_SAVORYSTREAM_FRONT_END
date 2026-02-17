import { Button } from "flowbite-react";
import sauces from "../data/sauces.json";
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-5xl font-extrabold text-center text-primary mb-12">
                Nos Sauces Maison 🍶
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {sauces.map((sauce) => (
                <div key={sauce.id} className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-500 overflow-hidden flex flex-col">
                    <div className="relative w-full h-64 overflow-hidden">
                        <img src={sauce.image_url} alt={sauce.name} className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"/>
                        <span className={`absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${ sauce.is_available ? "bg-green-600" : "bg-red-600" }`}>
                            {sauce.is_available ? "Disponible" : "En rupture"}
                        </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between text-center">
                        <div>
                            <h5 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary transition-colors duration-300">
                                {sauce.name}
                            </h5>
                            <p className="text-gray-500 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                {sauce.accroche}
                            </p>
                            <p className="text-xl font-semibold text-primary hover:text-secondary transition-colors duration-300 mb-6">
                                {sauce.conditionnements?.[0]?.prix ?? "N/A"} €
                            </p>
                        </div>
                        <Link to={`/sauce/${sauce.id}`}>
                            <Button className="w-full md:w-auto bg-primary text-white hover:bg-secondary transition-colors duration-300">
                                Découvrir &rarr;
                            </Button>
                        </Link>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
