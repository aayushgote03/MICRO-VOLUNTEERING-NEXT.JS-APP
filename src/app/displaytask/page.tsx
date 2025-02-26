"use client";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

type StatusKey = 'active' | 'inactive';

const TaskDetails = () => {
  const [applied, setApplied] = useState(false);
  const searchParams = useSearchParams();
  const userData = searchParams.get("userData");
  const user = searchParams.get("user");
  const [loading, setloading] = useState(true);

  const task = userData ? JSON.parse(userData) : null;
  console.log(task);

  const statusConfig = {
    active: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "🟢",
    },
    inactive: {
      color: "bg-red-100 text-red-700 border-red-200",
      icon: "🔴",
    },
  };

  const priorityConfig = {
    high: { label: "⚡ High Priority", class: "bg-red-100 text-red-700" },
    medium: {
      label: "📊 Medium Priority",
      class: "bg-yellow-100 text-yellow-700",
    },
    low: { label: "📝 Low Priority", class: "bg-green-100 text-green-700" },
  };

  const getStatusStyle = () => {
    const status = (task?.status?.toLowerCase() || 'inactive') as StatusKey;
    return statusConfig[status];
  };

  useEffect(() => {
    setloading(true);
    const fetchdata = async () => {
      const res = await fetch(`/api/checkifapplied/`, {
        method: "POST",
        body: JSON.stringify({
          task_id: task._id,
          user_email: user,
        }),
      });

      if (res.ok) {
        setloading(false);
      }

      const response = await res.json();
      setApplied(response.message !== "not applied yet");
    };
    fetchdata();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  📋 {task.taskName}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getStatusStyle().color
                  } border`}
                >
                  {getStatusStyle().icon} {task.status}
                </span>
              </div>
              <p className="text-gray-600 max-w-2xl">{task.description}</p>
            </div>
            <div>
  {loading ? (
    <button
      className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
      disabled
    >
      ⏳ Loading...
    </button>
  ) : !applied ? (
    <a
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors gap-2"
      href={`/applicationform?subject=${encodeURIComponent(task.taskName)}&author=${encodeURIComponent(task.user)}&applicant=${encodeURIComponent(user || '')}&task_id=${encodeURIComponent(task._id)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      🚀 Apply for Task
    </a>
  ) : (
    <button
      className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
      disabled
    >
      ✓ Application Submitted
    </button>
  )}
</div>

          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Task Details */}
          <div className="col-span-2 space-y-6">
            {/* Priority Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📊 Task Priority</h2>
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">⏱️ Timeline</h2>
              <div className="flex items-center justify-between border-l-4 border-blue-500 pl-4">
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">
                    {new Date(task.deadline).toLocaleDateString()}
                  </p>
                </div>
                <FaCalendarAlt className="text-blue-500 w-5 h-5" />
              </div>
            </div>

            {/* Image Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">🖼️ Task Preview</h2>
              <img
                src={task.imageurl}
                alt="Task visualization"
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-4.0.3";
                  img.alt = "Fallback task image";
                }}
              />
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Assignment Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                👥 Assignment Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">📁 {task.category}</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">📈 Task Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium mt-1">
                    {getStatusStyle().icon} {task.status}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Priority</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
