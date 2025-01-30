'use client'
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, User, Clock, Send } from "lucide-react";
import { useSearchParams } from 'next/navigation';

const EmailViewer = () => {
  const searchParams = useSearchParams();
  const data = searchParams.getAll('email');
  const email = JSON.parse(data[0]);
  console.log(data);
  
  /*const email = {
    subject: "Q4 Marketing Strategy Review 📊",
    sender: "sarah.miller@company.com",
    receiver: "john.doe@company.com",
    timestamp: "2024-01-30T14:30:00",
    body: `Hi John! 👋

I hope this email finds you well ✨. I wanted to share the preliminary results of our Q4 marketing campaign analysis. The numbers are looking quite promising 📈, and I think we've identified some key areas for optimization.

Key highlights: 🎯
- Social media engagement up 45% 🚀 
- Email open rates increased to 28% 📧
- Customer acquisition cost reduced by 18% 💰

Let's schedule a meeting to discuss these findings in detail. I'm available all day tomorrow if you'd like to connect! 🤝

Best regards,
Sarah ⭐`
  };*/

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-4 pb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <h1 className="text-2xl font-bold">{email.subject}</h1>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{formatDate(email.received_time)} ⏰</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Send className="w-4 h-4 mr-2" />
              <span className="font-medium mr-2">From:</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                ✉️ {email.sender}
              </span>
            </div>
            
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium mr-2">To:</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                👤 {email.reciever}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-4">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
              {email.body}
            </div>
          </div>
          
          <div className="mt-6 flex gap-2 justify-end">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300">
              Approve ✅
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full transition-colors duration-300">
              Reject ➡️
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailViewer;