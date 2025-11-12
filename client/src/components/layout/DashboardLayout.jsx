import { useState, useEffect } from "react";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { NAVIGATION_MENU } from "../../utils/data";

const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;

  return <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-[var(--accent-color)] text-[var(--secondary-color)] shadow-sm"
          : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
      }`}
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${
          isActive 
            ? "text-[var(--secondary-color)]" 
            : "text-[var(--text-secondary)]"
        }`}
      />
      {!isCollapsed && (
        <span className="ml-3 truncate">
          {item.name}
        </span>
      )}
    </button>
};

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Check if user is new on mount - check after user is loaded
  useEffect(() => {
    if (user) {
      // Check both the general flag and email-specific flag
      // Get user email from user object (could be nested or direct)
      const userEmail = user.email || (user.user && user.user.email);
      const generalFlag = localStorage.getItem('isNewUser') === 'true';
      const emailFlag = userEmail && localStorage.getItem(`isNewUser_${userEmail}`) === 'true';
      const newUserFlag = generalFlag || emailFlag;
      
      if (newUserFlag) {
        setIsNewUser(true);
        // Clear the flags immediately after checking (so it only shows once)
        // The state will remain true for this session
        localStorage.removeItem('isNewUser');
        if (userEmail) {
          localStorage.removeItem(`isNewUser_${userEmail}`);
        }
      } else {
        setIsNewUser(false);
      }
    } else {
      // If no user, default to false
      setIsNewUser(false);
    }
  }, [user]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarCollapsed = !isMobile && false;

  return (
    <div className="flex h-screen bg-base">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 transform ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } ${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-[var(--surface-1)] border-r border-white/10 shadow-sm`}
      >
        {/* Company Logo */}
        <div className="flex items-center h-20 border-b border-white/10 px-6">
          <Link className="flex items-center space-x-3 group" to="/dashboard">
            <div className="h-10 w-10 bg-[var(--accent-color)] rounded-xl flex items-center justify-center transition-colors duration-200 hover:opacity-90">
              <Briefcase className="h-6 w-6 text-[var(--secondary-color)]" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-[var(--text-primary)] font-whyte text-base font-normal">
                AI INVOICE APP
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={handleNavigation}
              isCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        {/* Account actions moved to profile dropdown; sidebar kept clean */}
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Top navbar */}
        <header className="bg-[var(--surface-1)] border-b border-white/10 h-20 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-6">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6 text-[var(--text-secondary)]" />
                ) : (
                  <Menu className="h-6 w-6 text-[var(--text-secondary)]" />
                )}
              </button>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                {isNewUser 
                  ? <>Welcome, <span className="text-[var(--accent-color)]">{user?.name}</span>!</>
                  : <>Welcome back, <span className="text-[var(--accent-color)]">{user?.name}</span>!</>
                }
              </h1>
              <p className="text-[var(--text-secondary)] hidden sm:block text-lg">
                Here's your invoice overview and insights.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Profile dropdown */}
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
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-8 bg-base">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
