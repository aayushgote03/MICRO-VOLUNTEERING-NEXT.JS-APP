// pages/index.js
"use client"
import { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Task {
    taskname: string;
    description: string;
    status: string;
    deadline: string;
    author: string;
    chatroom_id: string;
    applied_users: string[];
}

// Separate component for the dashboard content
function DashboardContent() {
    const searchParams = useSearchParams();
    const user = searchParams.get("user");
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch("/api/takentasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: user })
            })
            const data = await response.json();
            console.log(data);
            setTasks(data.taskestaken);
        }
        fetchTasks();
    }, [user])

    // Sample task data
   

    // Function to format date in a more readable way
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to determine status color
    const getStatusColor = (status: string) => {
        switch(status) {
            case "approved": return "bg-green-100 text-green-800";
            case "In Progress": return "bg-blue-100 text-blue-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "Not Started": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className='bg-gradient-to-br from-violet-50 via-pink-50 to-cyan-50'>
            <Navbar />
            <div className="min-h-screen mt-16">
                <main className="container mx-auto py-12 px-4">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text mb-4">
                            Your Task Dashboard
                        </h1>
                        <p className="text-gray-600">Manage and track your ongoing tasks</p>
                    </div>
                    
                    {/* Tasks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tasks.map((task) => (
                            <div 
                                key={task.chatroom_id} 
                                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-violet-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="p-6">
                                    {/* Status Badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-3xl">🎯</span>
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                            task.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                                            task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                                            task.status === "pending" ? "bg-amber-100 text-amber-700" :
                                            "bg-gray-100 text-gray-700"
                                        } shadow-sm`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    
                                    {/* Task Title */}
                                    <h2 className={`font-bold mb-3 line-clamp-2 min-h-[3rem] bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text ${
                                        task.taskname.length > 30 ? 'text-lg' : 'text-xl'
                                    }`}>
                                        {task.taskname}
                                    </h2>
                                    
                                    {/* Task Details */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-gray-600 bg-violet-50 rounded-lg p-2">
                                            <span className="mr-2">📅</span>
                                            <span className="font-medium">{formatDate(task.deadline)}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 bg-violet-50 rounded-lg p-2">
                                            <span className="mr-2">👤</span>
                                            <span className="font-medium">{task.author}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex border-t border-violet-100">
                                    <Link
                                        href={{
                                            pathname: "/page",
                                            query: {
                                                chatroom_id: task.chatroom_id,
                                                applied_users: task.applied_users,
                                                task_author: task.author,
                                                user: user
                                            }
                                        }}
                                        className="flex items-center justify-center py-4 flex-1 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium hover:from-violet-600 hover:to-violet-700 transition-all duration-300"
                                    >
                                        <span className="mr-2">👥</span> Team Chat
                                    </Link>
                                    <div className="w-px bg-violet-100"></div>
                                    <button 
                                        className="flex items-center justify-center py-4 flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300"
                                    >
                                        <span className="mr-2">💬</span> Direct Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Add New Task Button */}
                    <div className="mt-12 text-center">
                        <button className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700">
                            <span className="mr-2">✨</span>
                            Create New Task
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Main component with Suspense boundary
export default function TaskDashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-pink-50 to-cyan-50">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-violet-200 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-violet-600 rounded-full animate-spin border-t-transparent"></div>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}