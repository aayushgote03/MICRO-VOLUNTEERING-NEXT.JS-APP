"use client";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Task {
  _id: string;
  user: string;
  taskName: string;
  description: string;
  category: string;
  deadline: string;
  oftype: string;
}

interface User {
  email: string;
}

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [drafts, setDrafts] = useState<Task[]>([]);
  const [originalTasks, setOriginalTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSorted, setIsSorted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [viewDrafts, setViewDrafts] = useState(false); // New state for toggling drafts view
  const [originaldrafts, setoriginaldrafts] = useState<Task[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user_response = await fetch("/api/get");
        if (!user_response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await user_response.json();
        setUser(userData.user);

        const response = await fetch("/api/gettasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        const userfilterdata = data.filter(
          (person: Task) => person.user === userData.user.email
        );
        const filterdata = userfilterdata.filter((task: Task) => task.oftype === 'createtask');
        const draftdata = userfilterdata.filter((draft: Task) => draft.oftype === 'draft');
        setTasks(filterdata);
        setDrafts(draftdata);
        setOriginalTasks(filterdata);
        setoriginaldrafts(draftdata);
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (error || !user) {
    redirect("/auth");
    return null;
  }

  const toggleSortTasksByDeadline = () => {
    setIsSorted(!isSorted);

    if (isSorted) {
      if(viewDrafts) setDrafts(originaldrafts);
      else setTasks(originalTasks);
    } else {
      if(viewDrafts) {
        const sortedTasks = [...drafts].sort(
          (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        setDrafts(sortedTasks);
      }
      else{
      const sortedTasks = [...tasks].sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
      setTasks(sortedTasks);
    }
    }
  };

  const toggleViewDrafts = () => {
    setViewDrafts(!viewDrafts);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const response = await fetch(`/api/deletetask`, {
        method: "DELETE",
        body: JSON.stringify({ taskid: taskToDelete }),
      });
      if (!response.ok) {
        throw new Error("Unable to delete");
      } else {
        alert("Task has been deleted");
        setTaskToDelete(null);
        router.refresh();
      }
      setTasks(tasks.filter((task) => task._id !== taskToDelete));
      setOriginalTasks(tasks.filter((task) => task._id !== taskToDelete));
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const displayedTasks = viewDrafts ? drafts : tasks;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-6 shadow-md">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Hello, {user?.email}</h1>
          <button className="bg-purple-800 px-4 py-2 rounded hover:bg-purple-700 transition">
            <a href="/create-task" className="text-white">
              Create New Task
            </a>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Tasks
        </h2>
        <button
          onClick={toggleSortTasksByDeadline}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition mb-6"
        >
          {isSorted ? "Revert to Original Order" : "Sort by Deadline"}
        </button>
        <button
          onClick={toggleViewDrafts}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition mb-6 ml-5"
        >
          {viewDrafts ? "View All Tasks" : "My Drafts"}
        </button>
        {displayedTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayedTasks.map((task, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition transform hover:scale-105 relative"
              >
                <div className="absolute top-4 right-4">
                  <CircularProgress size="sm" />
                </div>
                <h3 className="text-xl font-bold text-indigo-600 mb-2">
                  {task.taskName}
                </h3>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <div className="text-gray-500 text-sm mb-2">
                  <strong>Category:</strong> {task.category}
                </div>
                <div className="text-gray-500 text-sm">
                  <strong>Deadline:</strong>{" "}
                  {new Date(task.deadline).toLocaleDateString("en-IN")}
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-4">
                  <div className="bg-yellow-600 text-white p-2 rounded-full shadow-md hover:bg-yellow-500 cursor-pointer">
                    <Link
                      href={{
                        pathname: '/updatetask',
                        query: { userData: JSON.stringify(task) },
                      }}
                      className="font-semibold"
                    >
                      Update
                    </Link>
                  </div>
                  <div className="bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-500 cursor-pointer">
                    <button
                      onClick={() => {
                        setTaskToDelete(task._id);
                        setIsModalOpen(true);
                      }}
                      className="font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No tasks available. Create one!</p>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-semibold text-red-600 mb-4">
              Are you sure?
            </h3>
            <p className="text-gray-600 mb-6">
              You are about to delete this task. This action is irreversible!
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-indigo-600 text-white py-4 text-center mt-8">
        <p className="text-sm">
          &copy; 2025 Task Manager | Designed by Aayush Sharma
        </p>
      </footer>
    </div>
  );
}
