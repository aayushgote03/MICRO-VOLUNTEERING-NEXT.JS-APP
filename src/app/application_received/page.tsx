"use client";
import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const ApplicationsReceived = () => {
  const searchParams = useSearchParams();
  const organizerName = searchParams.get("user") || "Anonymous User";
  const [applications, setapplications] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      const res = await fetch("/api/getorganizerdata", {
        method: "POST",
        body: JSON.stringify({
          organizer_email: organizerName,
        }),
        cache: 'force-cache'
      });

      const response = await res.json();
      console.log(response);
      const mydata = response.appplicants_data;
      setapplications(mydata);
    };
    fetchdata();
  }, []);

  // Sample data with organizer information

  // Format timestamp to readable date and time
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        timeZone: 'UTC'  // Force UTC
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true, 
        timeZone: 'UTC'  // Force UTC
      })
    };
  };
  
  
  const timestamp = "2025-01-30T23:22:47.955Z";
  const formatted = formatDateTime(timestamp);
  console.log(formatted); 
  

  // Get status style
  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Reviewed: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  // Get status emoji
  const getStatusEmoji = (status) => {
    const emojis = {
      pending: "⏳",
      approve: "✅",
      Rejected: "❌",
    };
    return emojis[status] || "📋";
  };

  // Category emojis mapping
  const categoryEmojis = {
    "Environmental Conservation": "🌱",
    "Education and Tutoring": "📚",
    "Healthcare and Wellness": "⚕️",
    Social: "🤝",
    "Animal Welfare": "🐾",
    "Arts and Culture": "🎨",
    "Advocacy and Campaigns": "📢",
    "Technology and Innovation": "💻",
    "Sports and Recreation": "⚽",
    "Community Building": "🏘️",
    "Youth Development": "🌟",
    Default: "📋",
  };

  const getBadgeColor = (category) => {
    const colors = {
      "Environmental Conservation": "bg-green-100 text-green-800",
      "Education and Tutoring": "bg-blue-100 text-blue-800",
      "Healthcare and Wellness": "bg-red-100 text-red-800",
      "Social Services": "bg-purple-100 text-purple-800",
      "Animal Welfare": "bg-yellow-100 text-yellow-800",
      "Arts and Culture": "bg-pink-100 text-pink-800",
      "Advocacy and Campaigns": "bg-orange-100 text-orange-800",
      "Technology and Innovation": "bg-indigo-100 text-indigo-800",
      "Sports and Recreation": "bg-cyan-100 text-cyan-800",
      "Community Building": "bg-teal-100 text-teal-800",
      "Youth Development": "bg-violet-100 text-violet-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-6xl mx-auto">
        {/* User Info Section */}
        <div className="bg-white bg-opacity-90 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-2xl font-bold">
                {organizerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  👋 Welcome, {organizerName}
                </h2>
                <p className="text-gray-600">🎯 Task Organizer Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                🗓️{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white bg-opacity-90 rounded-2xl p-8 mb-8 shadow-xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📬 Applications Dashboard
          </h1>
          <div className="flex flex-wrap gap-4">
            <div className="bg-indigo-100 rounded-xl p-4">
              <p className="text-indigo-600 font-semibold">
                📊 Total Applications
              </p>
              <p className="text-3xl font-bold text-indigo-800">
                {applications.length}
              </p>
            </div>
            <div className="bg-purple-100 rounded-xl p-4">
              <p className="text-purple-600 font-semibold">⏳ Pending</p>
              <p className="text-3xl font-bold text-purple-800">
                {applications.filter((app) => app.status === "pending").length}
              </p>
            </div>
            <div className="bg-green-100 rounded-xl p-4">
              <p className="text-green-600 font-semibold">✅ Approved</p>
              <p className="text-3xl font-bold text-green-800">
                {applications.filter((app) => app.status === "approve").length}
              </p>
            </div>
            <div className="bg-red-100 rounded-xl p-4">
              <p className="text-red-600 font-semibold">❌ Rejected</p>
              <p className="text-3xl font-bold text-red-800">
                {applications.filter((app) => app.status === "Rejected").length}
              </p>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => {
            const { date, time } = formatDateTime(
              application.email.received_time
            );
            return (
              <Card
                key={application.id}
                className="bg-white bg-opacity-95 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                        application.status
                      )}`}
                    >
                      {getStatusEmoji(application.status)} {application.status}
                    </span>
                    <div className="text-sm text-gray-500 text-right">
                      <div>📅 {date}</div>
                      <div>🕒 {time}</div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      👤 {application.applicant_name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      🎨 Created by: {organizerName}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getBadgeColor(
                        application.category
                      )}`}
                    >
                      {categoryEmojis[application.category] ||
                        categoryEmojis.Default}{" "}
                      {application.category}
                    </span>
                    <p className="text-lg font-semibold text-purple-600">
                      {application.taskname}
                    </p>
                  </div>
                  <Link
                    href={{
                      pathname: "/email",
                      query: {
                        email: JSON.stringify(application.email),
                        organizername: organizerName,
                        application_id: application.id
                      },
                    }}
                    className="block w-full text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-colors duration-300"
                  >
                    🔍 View Application
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsReceived;
