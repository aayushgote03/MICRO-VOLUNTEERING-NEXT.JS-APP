'use client'

import { useEffect, useState, Suspense } from "react";
import Pusher from "pusher-js";
import { FaSmile, FaUserCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import getTime from "@/lib/actions/gettime";

const pusherClient = new Pusher("72cb3b6362c5dc77cc6e", {
    cluster: "ap2"
});

interface ChatMember {
    handlename: string;
}

interface OldMessage {
    sendername: string;
    message: string;
    createdAt: string;
}

// Create a separate component for the chat content
function ChatContent() {
    const searchParams = useSearchParams();
    
    // Store search parameters in state to prevent re-renders on each input change
    const [chatroomId] = useState(searchParams.get("chatroom_id"));
    const [appliedUsers] = useState(searchParams.getAll("applied_users"));
    const [taskAuthor] = useState(searchParams.get("task_author"));
    const [user, setUser] = useState(searchParams.get("user"));
    const [chatMembers, setChatMembers] = useState<ChatMember[]>([]);
    const [userId, setUserId] = useState(searchParams.get("user"));
    const [room, setRoom] = useState(chatroomId || "");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Array<{text: string, userid: string, time: string}>>([]);
    const [oldmessages, setOldMessages] = useState<OldMessage[]>([]);

    
    useEffect(() => { 
        if (!appliedUsers.length) return; // Prevent API call if no users exist

        const fetchData = async () => {
            try {
                const response = await fetch("/api/getuserinfo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: appliedUsers })
                });
                const messagesResponse = await fetch("/api/getmessages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chatroomid: chatroomId })
                });
                const data = await response.json(); 
                const messagesData = await messagesResponse.json();
                console.log(messagesData.messages, 'messagesData');
                setOldMessages(messagesData.messages || []);
                setChatMembers(data.particapants || []);
                for (const member of data.particapants) {
                    if (member.email === user) {
                        setUser(member.handlename);
                        break;
                    }
                }
            } catch (error) {
                console.error("Error fetching chat members:", error);
            }

            for (const member of chatMembers) {
                console.log(member, 'member');
            }

        };

        fetchData();
    }, []); // Runs only when `appliedUsers` changes
    

    useEffect(() => {
      const channel = pusherClient.subscribe(room);
      channel.bind("new-message", (data: { text: string; userid: string; time: string }) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
      console.log(channel, 'channel');
      return () => {
        pusherClient.unsubscribe(room);
      };
    }, [room]);

    const sendMessage = async () => {
      if (message.trim() !== "" && chatroomId) {
        const currentTime = getTime();
        const msgData = { text: message, userid: user, time: currentTime};
        try {
          
          await Promise.all([
            fetch("/api/pusher-auth", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ room, message: msgData, sendermail: userId}),
            })
          ]);
          setMessage("");
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      }
    };

    return (
        <div className="h-screen flex bg-gray-100 p-6">
            {/* Sidebar */}
            <div className="w-80 bg-white rounded-2xl shadow-lg mr-6 p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Team Members</h2>
                {/* Add Author Section */}
                <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FaUserCircle className="text-indigo-600" size={28} />
                        <div>
                            <p className="text-sm text-indigo-600">Task Author 👑</p>
                            <p className="font-semibold text-gray-800">{taskAuthor}</p>
                        </div>
                    </div>
                </div>
                {/* Members List */}
                <p className="text-sm font-medium text-gray-500 mb-3">Participants 👥</p>
                <ul>
                    {chatMembers.map((member, index) => (
                        <li key={index} className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <FaUserCircle className="text-indigo-500" size={24} />
                            <span className="text-gray-700">{member.handlename}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Window */}
            <div className="flex flex-col flex-1 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                {oldmessages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sendername === user ? "justify-end" : "justify-start"} animate-fade-in`}
                        >
                            
                            <div
                                className={`p-4 rounded-2xl max-w-md ${
                                    msg.sendername === user  
                                    ? "bg-indigo-500 text-white" 
                                    : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                <p className={`text-sm mb-1 ${msg.sendername === user ? "text-indigo-100" : "text-gray-500"}`}>
                                    {msg.sendername} 
                                </p>
                                <p className="text-base">{msg.message}</p>
                                <p className={`text-xs mt-1 text-right ${
                                    msg.sendername === user ? "text-indigo-100" : "text-gray-400"
                                }`}>
                                    {msg.createdAt}
                                </p>
                            </div>
                        </div>
                    ))}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.userid === user ? "justify-end" : "justify-start"} animate-fade-in`}
                        >
                            
                            <div
                                className={`p-4 rounded-2xl max-w-md ${
                                    msg.userid === user  
                                    ? "bg-indigo-500 text-white" 
                                    : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                <p className={`text-sm mb-1 ${msg.userid === user ? "text-indigo-100" : "text-gray-500"}`}>
                                    {msg.userid} 
                                </p>
                                <p className="text-base">{msg.text}</p>
                                <p className={`text-xs mt-1 text-right ${
                                    msg.userid === user ? "text-indigo-100" : "text-gray-400"
                                }`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Box */}
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                    <textarea
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none max-h-32 min-h-[48px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                        placeholder="Type a message..."
                        rows={1}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {  
                                sendMessage();
                            }
                        }}
                    />
                    <button 
                        onClick={sendMessage} 
                        className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        <IoSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main component with proper Suspense boundary
export default function ChatRoom() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
