"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/Logoutbutton";
import Head from "next/head"; // Import Head component to update the page title or favicon
import OrganizerDropdown from "@/components/organizerdropdown";
import { gettasks } from "@/lib/actions/datafetch";
import NotificationDropdown from "@/components/ui/Notification";

interface Task {
  _id: string;
  taskName: string;
  description: string;
  category: string;
  deadline: string;
  status: string;
  user: string;
  oftype: string;
}

interface User {
  email: string;
}

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, usersRes] = await Promise.all([
          fetch("/api/get"),
          fetch("/api/getuser"),
        ]);

        const clientUrl = window.location.origin;
        console.log(clientUrl);
        const userTasks = await gettasks(clientUrl);
        console.log(userTasks);

        if (!userRes.ok || !usersRes.ok ) {
          throw new Error("Failed to fetch data");
        }

        const userData = await userRes.json();
        console.log(userData, "userData");

        const filtertask = await userTasks.filter(
          (task: Task) => task.oftype === "createtask"
        );
        const userlist = await usersRes.json();

        setUser(userData.user);
        setUsers(userlist);
        setTasks(filtertask);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isMenuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".hamburger-button")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  if (loading) return null; // Avoid rendering the page while loading

  if (error) {
    // Redirect to homepage if there's an error
    redirect("/auth");
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-violet-900 text-white' 
        : 'bg-gradient-to-br from-indigo-50 to-rose-50 text-gray-900'
    }`}>
      <Head>
        <title>{loading ? "Loading... | Task Manager" : "Task Manager"}</title>
        <link
          rel="icon"
          href={loading ? "/loading-spinner.ico" : "/favicon.ico"}
        />
      </Head>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full border-b ${
        theme === 'dark'
          ? 'border-gray-700 bg-gray-900/80 backdrop-blur-lg'
          : 'border-violet-100 bg-white/80 backdrop-blur-lg'
      } z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 text-transparent bg-clip-text">
                Helplinker
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Welcome, <span className={theme === 'dark' ? 'text-violet-400' : 'text-violet-700'}>
                  {user?.email}
                </span>
              </div>
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-violet-100 hover:bg-violet-200'
                }`}
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>

              <div className="relative">
                <OrganizerDropdown user={user?.email || ''} />
              </div>

              <Link href="#" className={`transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-violet-400' 
                  : 'text-gray-600 hover:text-violet-700'
              }`}>
                Docs
              </Link>
              <Link href="#" className={`transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-violet-400' 
                  : 'text-gray-600 hover:text-violet-700'
              }`}>
                Pricing
              </Link>
              <Link
                href={{
                  pathname: "/dashboard",
                  query: { user: user?.email || '' }
                }}
                className={`transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-violet-400'
                    : 'text-gray-600 hover:text-violet-700'
                }`}
              >
                Dashboard
              </Link>
              <NotificationDropdown user={user?.email || ''} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <Link href="/auth/signup" className="text-gray-600 hover:text-violet-700 transition-colors">
                  Sign in
                </Link>
              </div>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
              {/* Hamburger Menu */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-violet-50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="w-6 h-5 relative flex flex-col justify-between">
                  <span
                    className={`w-full h-0.5 bg-current transform transition-all duration-300 ${
                      isMenuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  ></span>
                  <span
                    className={`w-full h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? "opacity-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`w-full h-0.5 bg-current transform transition-all duration-300 ${
                      isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Updated styling */}
        <div className={`fixed inset-y-0 right-0 w-full md:hidden transform transition-all duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <div className="h-full w-full bg-white/95 backdrop-blur-lg">
            <div className="p-6 space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <OrganizerDropdown user={user?.email || ''} />
                </div>

                <Link
                  href="#"
                  className="text-lg py-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  Docs
                </Link>
                <Link
                  href="#"
                  className="text-lg py-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  Pricing
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-lg py-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                href={{
                  pathname: "/dashboard",
                  query: {
                    user: user?.email || '',
                  }
                }}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                Dashboard
              </Link>
              <NotificationDropdown user={user?.email || ''}/>
              <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tasks Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="#"
                className="inline-flex items-center px-4 py-2 rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
              >
                <span className="font-medium">Available Tasks</span>
                <span className="ml-2 px-2 py-0.5 bg-violet-200 rounded-full text-sm">
                  {tasks.length}
                </span>
              </Link>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <div
                  key={task._id}
                  className={`group relative rounded-2xl transition-all duration-300 overflow-hidden flex flex-col min-h-[320px] ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 shadow-lg shadow-violet-900/20'
                      : 'bg-white hover:shadow-xl shadow-sm'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      task.status === "Active"
                        ? theme === 'dark' 
                          ? 'bg-emerald-900/50 text-emerald-400'
                          : 'bg-emerald-100 text-emerald-700'
                        : theme === 'dark'
                          ? 'bg-rose-900/50 text-rose-400'
                          : 'bg-rose-100 text-rose-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    {/* Task Creator */}
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    } mb-2`}>
                      Created by <span className="font-medium">{task.user}</span>
                    </p>

                    {/* Task Title */}
                    <h3 className={`text-xl font-bold mb-3 group-hover:text-violet-400 transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {task.taskName}
                    </h3>

                    {/* Task Description */}
                    <p className={`mb-4 line-clamp-3 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {task.description}
                    </p>

                    {/* Task Details */}
                    <div className={`flex items-center justify-between text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <div className="flex items-center">
                        <span className="font-medium">📅 {new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">📂 {task.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Button Section */}
                  <div className={`pt-2 mt-2 border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <Link
                      href={{
                        pathname: "/displaytask",
                        query: {
                          userData: JSON.stringify(task),
                          user: user?.email || '',
                        },
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full text-center py-2 px-4 rounded-lg font-medium transform transition-all duration-300 hover:-translate-y-0.5 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white'
                          : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white'
                      }`}
                    >
                      View Details & Apply
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  No tasks available. Check back later!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
