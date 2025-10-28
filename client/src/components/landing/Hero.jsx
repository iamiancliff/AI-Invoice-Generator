import { Link } from "react-router-dom";
import HERO_IMG from "../../assets/hero-img.png";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <section className="relative bg-base overflow-hidden min-h-screen flex items-center">
      {/* Decorative soft depth */}
      {/* Decorative background intentionally removed for a cleaner hero */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-36">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text */}
          <div className="lg:col-span-6 text-left">
            <h1 className="text-5xl sm:text-6xl font-whyte font-bold text-white leading-tight mb-6">
              AI-powered invoicing,
              <span className="block text-[var(--text-secondary)]">crafted for clarity.</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-xl">
              Generate clean, professional invoices in seconds. Automate reminders and keep cash flow on track.
            </p>
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary px-8 py-4 rounded-xl text-base flex items-center justify-center group">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              ) : (
                <Link to="/signup" className="btn-primary px-8 py-4 rounded-xl text-base flex items-center justify-center group">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
              <a href="/#features" className="btn-secondary px-8 py-4 rounded-xl text-base flex items-center justify-center group">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 text-[var(--text-secondary)]">
                <CheckCircle className="w-5 h-5 text-[var(--text-primary)]" />
                <span className="font-medium">AI-Generated Invoices</span>
              </div>
              <div className="flex items-center space-x-3 text-[var(--text-secondary)]">
                <CheckCircle className="w-5 h-5 text-[var(--text-primary)]" />
                <span className="font-medium">Smart Reminders</span>
              </div>
              <div className="flex items-center space-x-3 text-[var(--text-secondary)]">
                <CheckCircle className="w-5 h-5 text-[var(--text-primary)]" />
                <span className="font-medium">Actionable Insights</span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] bg-surface">
              <img src={HERO_IMG} alt="AI Invoice App Dashboard" className="w-full opacity-95" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
