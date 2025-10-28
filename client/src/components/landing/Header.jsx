import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ProfileDropdown from "../layout/ProfileDropdown";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {isAuthenticated, user, logout }  = useAuth();

  const navigate = useNavigate()

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "backdrop-blur bg-[rgba(41,56,85,0.8)] border-b border-white/10 shadow-[0_6px_16px_-4px_rgba(0,0,0,0.45)]" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full relative flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors duration-200 border border-white/10 overflow-hidden">
              <img src="/logo.svg" alt="AI Invoice" className="w-8 h-8" />
            </div>
            <span className="text-xl font-whyte text-white/90 group-hover:text-white transition-colors duration-200 tracking-wide">
              AI Invoice App
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center">
            <nav className="bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 shadow-sm">
              <ul className="flex items-center gap-1">
      
                <li>
                  <a href="/#features" className="px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors">Features</a>
                </li>
                <li>
                  <a href="/#testimonials" className="px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors">Testimonials</a>
                </li>
                <li>
                  <a href="/#faq" className="px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors">FAQ</a>
                </li>
                <li>
                  <a href="/#about" className="px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors">About</a>
                </li>
                <li>
                  <a href="mailto:support@aiinvoiceapp.com" className="px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">Contact</a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user?.avatar || ""}
                companyName={user?.name || ""}
                email={user?.email || ""}
                onLogout={logout}
              />
            ) : (
              <>
                <Link to="/login" className="h-10 px-4 inline-flex items-center rounded-xl text-white/80 hover:text-white hover:bg-white/5 border border-white/10 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="h-10 px-5 inline-flex items-center rounded-xl font-semibold bg-[var(--accent-color)] text-[var(--secondary-color)] hover:brightness-95 transition-all shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)]">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors duration-200 border border-transparent hover:border-white/10"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[rgba(41,56,85,0.98)] border-b border-white/10 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)]">
          <div className="px-6 pt-4 pb-6 space-y-4">
            <nav className="bg-white/5 border border-white/10 rounded-2xl p-2">
              <a
                href="/#about"
                className="block px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                href="/#features"
                className="block px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
                href="/#testimonials"
                className="block px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
                href="/#faq"
                className="block px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
              <a
                href="mailto:support@aiinvoiceapp.com"
                className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </nav>
            <div className="border-t border-white/10"></div>
            {isAuthenticated ? (
              <div className="px-4">
                <Button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMenuOpen(false);
                  }}
                  className="w-full btn-primary"
                >
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <div className="space-y-3 px-4">
                <Link
                  to="/login"
                  className="block w-full text-center text-white/80 hover:text-white font-medium transition-colors duration-200 py-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center btn-primary py-3 rounded-xl font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;