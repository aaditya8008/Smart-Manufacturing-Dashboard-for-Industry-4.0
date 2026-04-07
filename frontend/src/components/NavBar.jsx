import React from "react";
import { NavLink } from "react-router-dom";
import { Bell } from "lucide-react";

export default function NavBar() {
  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/predictive", label: "Predictive Maintenance" },
    { to: "/supply", label: "Supply Chain" },
    { to: "/trends", label: "Trends" },
  ];

  return (
    <header className="bg-slate-800/90 backdrop-blur-sm p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LEFT SIDE NAV LINKS */}
        <nav className="flex space-x-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-white after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-blue-500"
                    : "text-slate-300 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

     
        <NavLink
  to="/notifications"
  className={({ isActive }) =>
    `relative p-2 rounded-full transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:text-white hover:bg-slate-700"
    }`
  }
>
  🔔 Notification Alerts
</NavLink>

      </div>
    </header>
  );
}