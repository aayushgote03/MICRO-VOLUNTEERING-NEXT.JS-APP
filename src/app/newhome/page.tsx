"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/Logoutbutton";
import Head from "next/head"; // Import Head component to update the page title or favicon
import OrganizerDropdown from "@/components/organizerdropdown";
export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, usersRes, userTasks] = await Promise.all([
          fetch("/api/get"),
          fetch("/api/getuser"),
          fetch("/api/gettasks"),
        ]);

        if (!userRes.ok || !usersRes.ok || !userTasks.ok) {
          throw new Error("Failed to fetch data");
        }

        const userData = await userRes.json();

        const taskdata = await userTasks.json();

        const filtertask = await taskdata.filter(
          (task) => task.oftype === "createtask"
        );
        const userlist = await usersRes.json();

        setUser(userData.user);
        setUsers(userlist);
        setTasks(filtertask);
      } catch (err) {
        setError(err.message);
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
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        !e.target.closest(".mobile-menu") &&
        !e.target.closest(".hamburger-button")
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
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <Head>
        <title>{loading ? "Loading... | Task Manager" : "Task Manager"}</title>
        <link
          rel="icon"
          href={loading ? "/loading-spinner.ico" : "/favicon.ico"}
        />
      </Head>

      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Resend</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div>
                hi <span className="font-bold">{user?.email}</span>
              </div>
              <div className="relative">
                <OrganizerDropdown user={user.email}/>

                {/* Dropdown Menu */}
              </div>

              <Link
                href="#"
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                Docs
              </Link>
              <Link
                href="#"
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                Pricing
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <Link
                  href="/auth/signup"
                  className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                >
                  Sign in
                </Link>
              </div>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              {/* Hamburger Menu Button */}
              <button
                className="md:hidden hamburger-button p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
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

        {/* Mobile Menu */}
        <div
          className={`fixed inset-y-0 right-0 w-full md:hidden transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full w-full bg-white dark:bg-black mobile-menu">
            <div className="p-6 space-y-6 backdrop-blur-md">
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
                  {/* Dropdown Menu */}
                  <OrganizerDropdown />
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
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Rest of the code remains the same */}
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="w-full  space-y-6">
              {/* Announcement Banner */}
              <div className="inline-block">
                <Link
                  href="#"
                  className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <span>Tasks Available</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 ml-6"
                >
                  <span>{tasks.length}</span>
                </Link>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {tasks.length > 0 ? (
                  tasks.map((task, index) => {
                    const formatDate = (isoDate) => {
                      const date = new Date(isoDate);
                      const day = date.getDate().toString().padStart(2, "0");
                      const month = (date.getMonth() + 1)
                        .toString()
                        .padStart(2, "0");
                      const year = date.getFullYear();
                      return `${day}-${month}-${year}`;
                    };

                    return (
                      <div
                        key={task._id}
                        className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl p-6 rounded-md hover:shadow-xl dark:hover:shadow-2xl transition-shadow min-h-[250px] flex flex-col justify-between relative"
                      >
                        {/* Top-right corner: Active/Inactive status and Created By */}
                        <div className="absolute top-4 right-4 text-right">
                          <p
                            className={`text-sm font-semibold mb-1 ${
                              task.status === "Active"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {task.status === "Active" ? "Active" : "Inactive"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            <strong>Created By:</strong>{" "}
                            {task.user || "Unknown"}
                          </p>
                        </div>

                        {/* Task Title */}
                        <h3 className="font-extrabold text-gray-900 dark:text-gray-100 mb-4">
                          {task.taskName}
                        </h3>

                        {/* Task Description */}
                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
                          {task.description}
                        </p>

                        {/* Task Details at the Bottom */}
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <p>
                              <strong>Deadline:</strong>{" "}
                              {formatDate(task.deadline)}
                            </p>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <p>
                              <strong>Category: </strong> {task.category}
                            </p>
                          </div>

                          <Link
                            href={{
                              pathname: "/displaytask",
                              query: {
                                userData: JSON.stringify(task),
                                user: user.email,
                              },
                            }}
                            className="bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded hover:bg-gray-700 dark:hover:bg-gray-200 w-full"
                          >
                            Apply now
                          </Link>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    No tasks available. Create one!
                  </p>
                )}
              </div>
            </div>

            {/* 3D Element */}
          </div>
        </div>
      </main>
    </div>
  );
}
