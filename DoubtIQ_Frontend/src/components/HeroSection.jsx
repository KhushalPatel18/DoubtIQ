import { Link } from "react-router-dom";
import heroBg from "../assets/hero-bg.png";

const HeroSection = () => {
    return (
        <section
            className="relative min-h-screen flex items-center"
            style={{
                backgroundImage: `url(${heroBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/70"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex justify-center">
                <div className="max-w-2xl text-left">

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                        Doubt<span className="text-purple-500">IQ</span>
                        <br />
                        <span className="text-purple-400">Smart Learning Simplified</span>
                    </h1>


                    <p className="mt-5 sm:mt-6 text-gray-300 text-base sm:text-lg">
                        DoubtIQ is an AI-powered academic assistant that helps students
                        resolve doubts with clear, step-by-step explanations in simple language.
                    </p>


                    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/authform"
                            className="w-full sm:w-auto text-center px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                        >
                            Get Started
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
