"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";

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

export default function CreateTask() {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Environmental");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Active");
  const [inactiveMessage, setInactiveMessage] = useState("");
  const [imageurl, setimageurl] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/get");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setUser(data.user.email);
      } catch (err) {
        setError(err.message);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let oftype = e.nativeEvent.submitter.name;
    const newTask = {
      taskName,
      description,
      category,
      deadline,
      status,
      inactiveMessage: status === "Inactive" ? inactiveMessage : "",
    };
    
    let result = await fetch("/api/createtask", {
      method: "POST",
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
    
    // Reset form fields
    setTaskName("");
    setDescription("");
    setCategory("Environmental");
    setDeadline("");
    setStatus("Active");
    setInactiveMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <Head>
        <title>Create Task - Microvolunteering App ✨</title>
        <meta
          name="description"
          content="Create a new task in the microvolunteering app."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg p-4 sticky top-0 z-50">
        <h1 className="text-xl font-bold flex items-center gap-2">
          🌟 Microvolunteering App
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{user}</span>
        </h1>
      </nav>

      <div className="flex justify-center items-center py-10 px-4 sm:px-6 lg:px-16">
        <div className="bg-white shadow-2xl p-8 rounded-2xl w-full max-w-2xl transform hover:scale-[1.01] transition-transform">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            ✨ Create a New Task ✨
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
                placeholder="Enter an inspiring task name..."
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                rows="4"
                required
                placeholder="Describe your amazing initiative..."
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="Active">✅ Active</option>
                <option value="Inactive">⏸️ Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
                🖼️ Add Image
              </label>
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

            {status === "Inactive" && (
              <div>
                <label className="block text-gray-700 font-bold mb-2" htmlFor="inactiveMessage">
                  💭 Custom Message for Inactive Task
                </label>
                <textarea
                  id="inactiveMessage"
                  value={inactiveMessage}
                  onChange={(e) => setInactiveMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  rows="3"
                  placeholder="Why is this task inactive?"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                name="createtask"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-105"
              >
                ✨ Create Task
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