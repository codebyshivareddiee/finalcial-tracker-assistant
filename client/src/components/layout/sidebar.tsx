import React from "react";
import { Link, useLocation } from "wouter";

interface NavItem {
  title: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: "fa-home" },
  { title: "Add Expense", href: "/add-expense", icon: "fa-plus-circle" },
  { title: "View Expenses", href: "/expenses", icon: "fa-list-alt" },
  { title: "Chatbot Assistant", href: "/chatbot", icon: "fa-robot" },
];

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <i className="fas fa-wallet text-primary mr-2"></i> Lucas
        </h1>
        <p className="text-sm text-gray-500 mt-1">Personal Finance Assistant</p>
      </div>
      
      <nav className="flex-1 px-4 py-2">
        <ul>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <li className="mb-1" key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    isActive
                      ? "bg-blue-50 text-gray-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <i className={`fas ${item.icon} mr-3 ${isActive ? "text-primary" : "text-gray-400"}`}></i>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Link href="/settings" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <i className="fas fa-cog mr-2"></i>
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
