import React from 'react'
import HeroSection from '../components/HeroSection.jsx';
import Navbar from '../components/Navbar.jsx';
import FeaturesSection from '../components/FeaturesSection.jsx';
import BlogSection from '../components/BlogSection.jsx';
import FAQSection from '../components/FAQSection.jsx';
import Footer from '../components/Footer.jsx';

const Landing = () => {
    return (
        <div>
            <Navbar />
            <div className="pt-17">
                <HeroSection />
            </div>
            <FeaturesSection />
            <BlogSection />
            <FAQSection />
            <Footer />
        </div>
    )
}

export default Landing
