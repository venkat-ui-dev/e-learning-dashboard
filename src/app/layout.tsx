"use client";

import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme); // Initialize theme once on mount.
    document.documentElement.classList.add(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Advanced E-Learning Dashboard for Students, Instructors, and Admins" />
        <meta name="author" content="Venkatesh" />
        <title>E-Learning Dashboard</title>
      </head>
      <body className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <ThemeProvider>
          <Provider store={store}>
            <div className="flex flex-col h-screen md:flex-row">
              <ToastContainer position="top-right" autoClose={5000} aria-live="assertive" />
              <Sidebar aria-label="Main navigation sidebar"
              />
              <div className="flex flex-col flex-1">
                <Header aria-label="Page header with theme toggle"
                />
                <main
                  className={`flex-1 p-2 transition-colors duration-300 overflow-y-auto dark:text-gray-300`}
                  role="main"
                  aria-live="polite"
                >
                  {children}
                </main>
              </div>
            </div>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
