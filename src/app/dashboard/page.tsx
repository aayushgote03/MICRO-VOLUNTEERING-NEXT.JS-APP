// pages/index.js
"use client"
import { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Task Dashboard</title>
                <meta name="description" content="Task Dashboard with Emoji Cards" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-center mb-8">
                    ✨ Task Dashboard ✨
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <div key={task.chatroom_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-4xl">emoji</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                        {task.status}
                                    </span>
                                </div>
                                
                                <h2 className={`font-semibold mb-2 line-clamp-2 min-h-[3rem] ${
                                    task.taskname.length > 30 
                                    ? 'text-sm' 
                                    : task.taskname.length > 20 
                                    ? 'text-base' 
                                    : 'text-xl'
                                }`}>
                                    {task.taskname}
                                </h2>
                                
                                <div className="flex flex-col space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <span className="mr-2">📅</span>
                                        <span>Due: {formatDate(task.deadline)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-2">👤</span>
                                        <span>Created by: {task.author}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex border-t">
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
                                    className="flex items-center justify-center py-3 flex-1 bg-indigo-50 hover:bg-indigo-100 transition-colors text-indigo-700 font-medium"
                                >
                                    <span className="mr-2">👥</span> Team Chat
                                </Link>
                                <div className="w-px bg-gray-200"></div>
                                <button 
                                    className="flex items-center justify-center py-3 flex-1 bg-purple-50 hover:bg-purple-100 transition-colors text-purple-700 font-medium"
                                >
                                    <span className="mr-2">💬</span> Direct Chat
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-10 text-center">
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow">
                        ➕ Add New Task
                    </button>
                </div>
            </main>
        </div>
    );
}

// Main component with Suspense boundary
export default function TaskDashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}