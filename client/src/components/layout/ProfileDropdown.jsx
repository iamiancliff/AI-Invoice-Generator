import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/5 transition-colors duration-200"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="h-9 w-9 object-cover rounded-xl"
          />
        ) : (
          <div className="h-8 w-8 bg-[var(--accent-color)] rounded-xl flex items-center justify-center">
            <span className="text-[var(--secondary-color)] font-semibold text-sm">
              {companyName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-[var(--text-primary)]">{companyName}</p>
          <p className="text-xs text-[var(--text-secondary)]">{email}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-[var(--text-secondary)]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[var(--surface-1)] rounded-xl shadow-lg border border-white/10 py-2 z-50">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-medium text-[var(--text-primary)]">{companyName}</p>
            <p className="text-xs text-[var(--text-secondary)]">{email}</p>
          </div>

          <a
            onClick={() => navigate("/profile")}
            className="block px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-white/5 transition-colors cursor-pointer"
          >
            View Profile
          </a>
          <div className="border-t border-white/10 mt-2 pt-2">
            <a
              href="#"
              onClick={onLogout}
              className="block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Log out
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
