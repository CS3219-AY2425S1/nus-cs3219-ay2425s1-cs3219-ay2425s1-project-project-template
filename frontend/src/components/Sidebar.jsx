import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Settings, LogOut, HelpCircle } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const menuItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Users, label: "Matching Service", href: "/matching-service" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help", href: "/help" },
    { icon: LogOut, label: "Logout", href: "/login" },
  ];

  const handleItemClick = (href) => {
    setActiveItem(href);
    navigate(href);
  };

  return (
    <aside className="flex w-20 flex-col items-center space-y-8 bg-transparent py-12">
      {menuItems.map((item, index) => (
        <Link key={index} to={item.href}>
          <button
            onClick={() => handleItemClick(item.href)}
            className={`rounded-lg p-3 transition-colors duration-200 ${
              activeItem === item.href
                ? "bg-[#c6fe4c] text-black"
                : "text-slate-300/70 hover:bg-gray-100 hover:text-black"
            }`}
            aria-label={item.label}
          >
            <item.icon size={24} />
          </button>
        </Link>
      ))}
    </aside>
  );
}
