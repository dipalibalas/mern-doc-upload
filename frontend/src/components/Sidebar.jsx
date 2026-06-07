import {
  LayoutDashboard,
  FileText,
  Share2,
  Upload,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, view: "all" },
  { to: "/?view=owned", label: "My Documents", icon: FileText, view: "owned" },
  { to: "/?view=shared", label: "Shared with me", icon: Share2, view: "shared" },
];

export default function Sidebar({ onUploadClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const currentView =
    new URLSearchParams(location.search).get("view") || "all";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-blue-600">DocuWrite</h1>
        {user && (
          <p className="text-sm text-slate-500 mt-2 truncate">
            {user.name || user.email}
          </p>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, view }) => {
          const isActive =
            location.pathname === "/" && currentView === view;

          return (
            <Link
              key={view}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onUploadClick}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
        >
          <Upload size={18} />
          Import file
        </button>
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="m-4 flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
