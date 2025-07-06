import React from "react";
import { Link, useLocation } from "wouter";

interface MobileNavProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: string;
  shortTitle?: string;
}

const navItems: NavItem[] = [
  { title: "Dashboard", shortTitle: "Home", href: "/", icon: "fa-home" },
  { title: "Add Expense", shortTitle: "Add", href: "/add-expense", icon: "fa-plus-circle" },
  { title: "View Expenses", shortTitle: "Expenses", href: "/expenses", icon: "fa-list-alt" },
  { title: "Chatbot Assistant", shortTitle: "Chat", href: "/chatbot", icon: "fa-robot" },
];

const MobileNav: React.FC<MobileNavProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const [location] = useLocation();

  return (
    <>
      <div className="md:hidden bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-gray-800 flex items-center">
            <i className="fas fa-wallet text-primary mr-2"></i> Lucas
          </h1>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-600">
            <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
        
        <nav className={mobileMenuOpen ? "px-4 py-2 pb-4" : "hidden"}>
          <ul>
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <li className="mb-1" key={item.href}>
                  <Link 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
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
      </div>
      
      {!mobileMenuOpen && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="flex">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-1 py-3 flex flex-col items-center justify-center text-xs font-medium ${
                    isActive 
                      ? "text-primary" 
                      : "text-gray-500"
                  }`}
                >
                  <i className={`fas ${item.icon} mb-1 text-sm`}></i>
                  {item.shortTitle || item.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
