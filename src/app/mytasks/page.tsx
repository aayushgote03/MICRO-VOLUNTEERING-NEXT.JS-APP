"use client";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-cyan-50 mt-16">
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-wrap items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text mb-4 md:mb-0">
              Your Tasks
            </h2>
            <div className="flex gap-3">
              <button
                onClick={toggleSortTasksByDeadline}
                className="px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-violet-600 border border-violet-100 flex items-center gap-2"
              >
                {isSorted ? "↩️ Original Order" : "⏱️ Sort by Deadline"}
              </button>
              <button
                onClick={toggleViewDrafts}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                {viewDrafts ? "📋 View Tasks" : "📝 View Drafts"}
              </button>
            </div>
          </div>

          {/* Tasks Grid */}
          {displayedTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayedTasks.map((task, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 relative border border-violet-100"
                >
                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4">
                    <CircularProgress size="sm" color="primary" />
                  </div>

                  {/* Task Content */}
                  <div className="mb-8"> {/* Added margin to separate from buttons */}
                    <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text mb-2">
                      {task.taskName}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-violet-50 text-violet-700 font-medium">
                        📂 {task.category}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 font-medium">
                        📅 {new Date(task.deadline).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                    <Link
                      href={{
                        pathname: '/updatetask',
                        query: { userData: JSON.stringify(task) },
                      }}
                      className="px-4 py-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors duration-300 font-medium"
                    >
                      ✏️ Update
                    </Link>
                    <button
                      onClick={() => {
                        setTaskToDelete(task._id);
                        setIsModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors duration-300 font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-600 text-lg">No tasks available. Create one!</p>
            </div>
          )}
        </main>

        {/* Delete Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full m-4 p-6">
              <h3 className="text-xl font-bold text-rose-600 mb-4">
                ⚠️ Delete Confirmation
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors duration-300 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-6 text-center mt-8">
          <p className="text-sm font-medium">
            &copy; 2025 Task Manager | Designed by Aayush Sharma
          </p>
        </footer>
      </div>
    </div>
  );
}
