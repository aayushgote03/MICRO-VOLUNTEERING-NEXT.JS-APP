"use client";
import Head from "next/head";
import { useState, useEffect, FormEvent } from "react";
import { redirect } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";
import { useSearchParams } from "next/navigation";

const categoryEmojis = {
  Environmental: "🌱",
  Education: "📚",
  Healthcare: "🏥",
  Social: "🤝",
  AnimalWelfare: "🐾",
  Arts: "🎨",
  Advocacy: "📢",
  Technology: "💻",
  Sports: "⚽",
  Community: "🏘️",
  Youth: "🌟",
};

export default function UpdateTask() {
  const searchParams = useSearchParams();
  const userData = searchParams.get("userData");
  const task = userData ? JSON.parse(userData) : null;
  
  const [user, setUser] = useState(task.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskName, setTaskName] = useState(task.taskName);
  const [description, setDescription] = useState(task.description);
  const [category, setCategory] = useState(task.category);
  const [deadline, setDeadline] = useState(task.deadline);
  const [status, setStatus] = useState(task.status);
  const [inactiveMessage, setInactiveMessage] = useState(task.inactiveMessage);
  const [imageurl, setimageurl] = useState(task.imageurl);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/get");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setUser(data.user.email);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="text-white text-2xl animate-bounce">Loading... 🎈</div>
    </div>
  );
  
  if (error) {
    redirect("/");
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let oftype = (e.nativeEvent as any).submitter.name;

    let result = await fetch(`/api/updatetask/${task._id}`, {
      method: "PUT",
      body: JSON.stringify({
        user,
        taskName,
        description,
        category,
        deadline,
        status,
        inactiveMessage,
        imageurl,
        oftype
      }),
    });
    result = await result.json();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-orange-100">
      <Head>
        <title>Update Task - Microvolunteering App ✏️</title>
        <meta
          name="description"
          content="Update an existing task in the microvolunteering app."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg p-4 sticky top-0 z-50">
        <h1 className="text-xl font-bold flex items-center gap-2">
          ✏️ Microvolunteering App
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{user}</span>
        </h1>
      </nav>

      <div className="flex justify-center items-center py-10 px-4 sm:px-6 lg:px-16">
        <div className="bg-white shadow-2xl p-8 rounded-2xl w-full max-w-2xl transform hover:scale-[1.01] transition-transform">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
            ✏️ Update Task ✨
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="taskName">
                📝 Task Name
              </label>
              <input
                type="text"
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                📖 Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="category">
                🏷️ Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              >
                {Object.entries(categoryEmojis).map(([value, emoji]) => (
                  <option key={value} value={value}>
                    {emoji} {value.replace(/([A-Z])/g, ' $1').trim()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="deadline">
                📅 Deadline
              </label>
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="status">
                🔄 Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              >
                <option value="Active">✅ Active</option>
                <option value="Inactive">⏸️ Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
                🖼️ Update Image
              </label>
              <div className="space-y-2">
                {imageurl && (
                  <div className="text-sm text-gray-600">
                    🎯 Current image: {imageurl.split('/').pop()}
                  </div>
                )}
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    console.log("Files: ", res);
                    alert("Upload Completed ✨");
                    setimageurl(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />
              </div>
            </div>

            {status === "Inactive" && (
              <div>
                <label className="block text-gray-700 font-bold mb-2" htmlFor="inactiveMessage">
                  💭 Custom Message for Inactive Task
                </label>
                <textarea
                  id="inactiveMessage"
                  value={inactiveMessage}
                  onChange={(e) => setInactiveMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                name="updatetask"
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all transform hover:scale-105"
              >
                ✨ Update Task
              </button>
              <button
                type="submit"
                name="draft"
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 px-6 rounded-lg hover:from-gray-500 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all transform hover:scale-105"
              >
                📝 Save as Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}