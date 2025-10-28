import React from "react";
import Header from "../../components/landing/Header";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Testimonials from "../../components/landing/Testimonials";
import Faqs from "../../components/landing/Faqs";
import Footer from "../../components/landing/Footer";
import AboutSection from "../../components/landing/AboutSection";

const LandingPage = () => {
  return (
    <div className="bg-base min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Faqs />
        <AboutSection />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
