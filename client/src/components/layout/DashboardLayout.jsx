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
          ? "bg-[#4FADC0] text-white shadow-sm"
          : "text-[#6B7280] hover:bg-[#4FADC0]/10 hover:text-[#4FADC0]"
      }`}
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${
          isActive 
            ? "text-white" 
            : "text-[#6B7280] group-hover:text-[#4FADC0]"
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
    <div className="flex h-screen bg-[#F8FAFB]">
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
        } bg-white border-r border-gray-200 shadow-sm`}
      >
        {/* Company Logo */}
        <div className="flex items-center h-20 border-b border-gray-200 px-6">
          <Link className="flex items-center space-x-3 group" to="/dashboard">
            <div className="h-10 w-10 bg-[#4FADC0] rounded-xl flex items-center justify-center group-hover:bg-[#3E95A7] transition-colors duration-200">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-[#193948] font-paytone text-xl group-hover:text-[#4FADC0] transition-colors duration-200">
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

        {/* Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            className="w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 bg-opacity-25 z-40 backdrop-blur-sm"
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
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-6">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-3 rounded-xl hover:bg-[#4FADC0]/10 transition-all duration-200 group"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6 text-[#6B7280] group-hover:text-[#4FADC0] transition-colors duration-200" />
                ) : (
                  <Menu className="h-6 w-6 text-[#6B7280] group-hover:text-[#4FADC0] transition-colors duration-200" />
                )}
              </button>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-[#193948]">
                Welcome back, <span className="text-[#4FADC0]">{user?.name}</span>!
              </h1>
              <p className="text-[#6B7280] hidden sm:block text-lg">
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
        <main className="flex-1 overflow-auto p-8 bg-[#F8FAFB]">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
