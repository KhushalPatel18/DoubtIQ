import { Github, Mail, Linkedin } from "lucide-react";

function Footer() {
    return (
        <footer className="bg-gray-950 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between gap-10">

                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-semibold text-white">
                            Doubt<span className="text-purple-500">IQ</span>
                        </h3>
                        <p className="mt-3 text-gray-400 text-sm max-w-sm">
                            DoubtIQ is an AI-powered academic assistant that helps students
                            understand concepts through clear, step-by-step explanations.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-16">

                        <div>
                            <h4 className="text-white font-medium mb-3">Product</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Features</li>
                                <li>Blog</li>
                                <li>FAQ</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-3">Technology</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>React</li>
                                <li>Express.js</li>
                                <li>MongoDB</li>
                                <li>AI API</li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Divider */}
                <div className="my-8 border-t border-gray-800"></div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} DoubtIQ. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4 text-gray-400">
                        <a className="hover:text-purple-400 transition">
                            <Github size={18} />
                        </a>
                        <a className="hover:text-purple-400 transition">
                            <Linkedin size={18} />
                        </a>
                        <a className="hover:text-purple-400 transition">
                            <Mail size={18} />
                        </a>
                    </div>

                </div>

            </div>
        </footer>
    );
}

export default Footer;
