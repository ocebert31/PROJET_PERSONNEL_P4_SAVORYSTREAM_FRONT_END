import sauces from "../data/sauces.json";

function HomePage() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <h2 className="text-4xl font-bold text-center text-primary mb-10">
                Nos Sauces Maison 🍶
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {sauces.map((sauce) => (
                    <div key={sauce.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                        <div className="relative w-full h-56 overflow-hidden">
                            <img src={sauce.image_url} alt={sauce.name} className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"/>
                            <span
                                className={`absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${sauce.is_available ? "bg-green-600" : "bg-red-600" }`}>
                                {sauce.is_available ? "Disponible" : "En rupture"}
                            </span>
                        </div>
                        <div className="p-5 text-center">
                            <h5 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 hover:text-primary transition-colors duration-300">
                                {sauce.name}
                            </h5>
                            <p className="text-gray-500 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                {sauce.accroche}
                            </p>
                            <p className="text-lg font-semibold text-primary hover:text-secondary transition-colors duration-300">
                                {sauce.conditionnements?.[0]?.prix ?? "N/A"} €
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
