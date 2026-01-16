import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSmoothScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsOpen(false);
        }
    };

    const handleHomeClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-950 border-b border-gray-800 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

                {/* Logo / Brand */}
                <Link
                    to="/"
                    onClick={handleHomeClick}
                    className="text-lg sm:text-xl font-semibold text-white cursor-pointer shrink-0"
                >
                    Doubt<span className="text-purple-500">IQ</span>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <button
                        onClick={handleHomeClick}
                        className="text-gray-400 hover:text-white transition"
                    >
                        Home
                    </button>

                    <button
                        onClick={() => handleSmoothScroll("blogs")}
                        className="text-gray-400 hover:text-white transition"
                    >
                        Blogs
                    </button>

                    <button
                        onClick={() => handleSmoothScroll("faq")}
                        className="text-gray-400 hover:text-white transition"
                    >
                        FAQ
                    </button>

                    <Link
                        to="/authform"
                        className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-gray-400 hover:text-white transition"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <button
                        onClick={handleHomeClick}
                        className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition"
                    >
                        Home
                    </button>

                    <button
                        onClick={() => handleSmoothScroll("blogs")}
                        className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition"
                    >
                        Blogs
                    </button>

                    <button
                        onClick={() => handleSmoothScroll("faq")}
                        className="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition"
                    >
                        FAQ
                    </button>

                    <Link
                        to="/authform"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition font-medium"
                    >
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
