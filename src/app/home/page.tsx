"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/Logoutbutton";
import Head from "next/head"; // Import Head component to update the page title or favicon
import Image from "next/image";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State for the hamburger menu

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, tasksRes, usersRes] = await Promise.all([
          fetch("/api/get"),
          fetch("/api/gettasks"),
          fetch("/api/getuser"),
        ]);

        if (!userRes.ok || !tasksRes.ok || !usersRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const userData = await userRes.json();
        const tasksData = await tasksRes.json();
        const filtertask = await tasksData.filter(task => task.oftype === 'createtask');
        const userlist = await usersRes.json();

        setUser(userData.user);
        setTasks(filtertask);
        setUsers(userlist);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return null; // Avoid rendering the page while loading

  if (error) {
    // Redirect to homepage if there's an error
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <Head>
        <title>{loading ? "Loading... | Task Manager" : "Task Manager"}</title>
        <link
          rel="icon"
          href={loading ? "/loading-spinner.ico" : "/favicon.ico"}
        />
      </Head>

      {/* Fixed Navbar */}
      <nav className="bg-gray-800 text-white shadow-md p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Task Manager</h1>
        </div>

        {/* Buttons inside Task Manager aligned to the right */}
        <div className="ml-auto hidden md:flex space-x-4">
          <Link
            href="/auth/signup"
            className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-600"
          >
            Sign Up
          </Link>
          <Link
            href="/auth/login"
            className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-600"
          >
            Login
          </Link>

          <LogoutButton />

          <Link
            href="/createtask"
            className="bg-green-500 py-2 px-4 rounded hover:bg-green-600"
          >
            Create Task
          </Link>

          {/* My Tasks Button */}
          <Link
            href="/mytasks"
            className="bg-purple-500 py-2 px-4 rounded hover:bg-purple-600"
          >
            My Tasks
          </Link>
        </div>

        {/* Hamburger Menu */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Mobile Menu */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:hidden space-y-2 bg-gray-800 p-4 absolute top-16 left-0 w-full z-10`}
        >
          <Link
            href="/auth/signup"
            className="block bg-blue-500 py-2 px-4 rounded hover:bg-blue-600"
          >
            Sign Up
          </Link>
          <Link
            href="/auth/login"
            className="block bg-blue-500 py-2 px-4 rounded hover:bg-blue-600"
          >
            Login
          </Link>
          <button className="block bg-blue-500 py-2 px-4 rounded hover:bg-blue-600">
            LogOut
          </button>
          <Link
            href="/create-task"
            className="block bg-green-500 py-2 px-4 rounded hover:bg-green-600"
          >
            Create Task
          </Link>

          {/* My Tasks Button in Hamburger */}
          <Link
            href="/mytasks"
            className="block bg-purple-500 py-2 px-4 rounded hover:bg-purple-600"
          >
            My Tasks
          </Link>
        </div>
      </nav>

      {/* Fixed Blue Strip Below Navbar */}
      <div className="bg-blue-500 text-white p-4 text-center fixed top-16 left-0 w-full z-40">
        <h2 className="text-lg font-bold">Welcome {user?.email}</h2>
        <p>Start managing your tasks efficiently!</p>
      </div>

      {/* Add padding to avoid content overlap with fixed navbar and blue strip */}
      <div className="pt-32">
        {/* Main Layout */}
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="bg-gray-900 text-white w-full md:w-1/4 p-4">
            <h2 className="text-lg font-bold mb-4">Categories</h2>
            <ul className="space-y-2">
              <li>Environmental Conservation</li>
              <li>Education and Tutoring</li>
              <li>Healthcare and Wellness</li>
              <li>Social Services</li>
              <li>Animal Welfare</li>
              <li>Arts and Culture</li>
              <li>Advocacy and Campaigns</li>
              <li>Technology and Innovation</li>
              <li>Sports and Recreation</li>
              <li>Community Building</li>
              <li>Youth Development</li>
            </ul>
          </aside>

          {/* Main Content - Make it scrollable */}
          <main
            className="flex-1 p-6 overflow-y-auto"
            style={{ height: "calc(100vh - 160px)" }}
          >
            <h1 className="text-2xl font-bold mb-6">Tasks {tasks.length}</h1>
            <div className="grid gap-6 grid-cols-1">
              {tasks.length > 0 ? (
                tasks.map((task, index) => {
                  // Format the date into a readable format
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
                      className="bg-white shadow-lg p-6 rounded-md hover:shadow-xl transition-shadow min-h-[250px] flex flex-col justify-between relative"
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
                        <p className="text-xs text-gray-500">
                          <strong>Created By:</strong> {task.user || "Unknown"}
                        </p>
                      </div>

                      {/* Task Title */}
                      <h3 className="font-extrabold text-gray-900 mb-4">
                        {task.taskName}
                      </h3>

                      {/* Task Description */}
                      <p className="text-gray-600 mb-4 flex-1">
                        {task.description}
                      </p>

                      {/* Task Details at the Bottom */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                          <p>
                            <strong>Deadline:</strong>{" "}
                            {formatDate(task.deadline)}
                          </p>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                          <p>
                            <strong>Category: </strong> {task.category}
                          </p>
                        </div>
              

                        <Link href={{
                          pathname: '/displaytask',
                          query: { userData: JSON.stringify(task) },
                        }} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full">
                          Apply now
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No tasks available. Create one!</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
