"use client";
import React, { useEffect, useState, Suspense } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

type StatusKey = 'active' | 'inactive';


const TaskDetailsContent = () => {
  const [applied, setApplied] = useState(false);
  const searchParams = useSearchParams();
  const userData = searchParams.get("userData");
  const user = searchParams.get("user");
  console.log(user, 'dsvsv');
  const [loading, setloading] = useState(true);
  const [reminder, setReminder] = useState(false);

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
      console.log(response.reminder, 'dsvsv');
      if(response.reminder) {
        setReminder(true);
      }
      setApplied(response.message !== "not applied yet");
    };
    fetchdata();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-cyan-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-violet-100">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
                  📋 {task.taskName}
                </h1>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  task.status === 'Active' 
                    ? "bg-emerald-100 text-emerald-600 border-emerald-200" 
                    : "bg-rose-100 text-rose-600 border-rose-200"
                } border shadow-sm`}>
                  {task.status === 'Active' ? '🟢 Active' : '🔴 Inactive'}
                </span>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="w-full sm:w-auto">
              {loading ? (
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-medium cursor-not-allowed" disabled>
                  ⏳ Loading...
                </button>
              ) : task.status === 'Inactive' ? (
                <button
                  onClick={async () => {
                    // Add notification logic here
                    try {
                      const response = await fetch('/api/makenotification', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          task_id: task._id,
                          user_email: user 
                        })
                      });
                      const data = await response.json();
                      console.log(data, 'dsvsv');
                      if(response.ok) {
                        alert('You will be notified when this task becomes active');
                        const response2 = await fetch('/api/makenotification', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            task_id: task._id, user_email: user, notification_id: data.notification._id })
                        });
                      }
                    } catch (error) {
                      console.error('Failed to set notification:', error);
                    }
                  }}
                  className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    reminder 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                  disabled={reminder}
                >
                  {reminder ? '🔔 Reminder Set' : '🔔 Notify Me'}
                </button>
              ) : !applied ? (
                <a
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  href={`/applicationform?subject=${encodeURIComponent(task.taskName)}&author=${encodeURIComponent(task.user)}&applicant=${encodeURIComponent(user || '')}&task_id=${encodeURIComponent(task._id)}`}
                >
                  🚀 Apply for Task
                </a>
              ) : (
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-medium cursor-not-allowed" disabled>
                  ✅ Application Submitted
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Image Preview and Description Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-violet-100 group hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text mb-4">
                🖼️ Task Preview
              </h2>
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden ring-1 ring-violet-100">
                <img
                  src={task.imageurl}
                  alt="Task visualization"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = "https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-4.0.3";
                    img.alt = "Fallback task image";
                  }}
                />
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">📝 Description</h2>
              <p className="text-gray-600 text-sm sm:text-base">{task.description}</p>
            </div>
          </div>

          {/* Timeline, Assignment Details, and Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">⏱️ Timeline</h2>
              <div className="flex items-center justify-between border-l-4 border-blue-500 pl-4">
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{new Date(task.deadline).toLocaleDateString()}</p>
                </div>
                <FaCalendarAlt className="text-blue-500 w-5 h-5" />
              </div>
            </div>

            {/* Assignment Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">👥 Assignment Details</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">📁 {task.category}</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">📈 Task Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium mt-1">{getStatusStyle().icon} {task.status}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Priority</p>
                  {/* Add priority content */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskDetails = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 p-8">Loading...</div>}>
      <TaskDetailsContent />
    </Suspense>
  );
};

export default TaskDetails;
