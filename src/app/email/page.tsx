'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Clock, Send, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useSearchParams } from 'next/navigation';

interface Email {
  subject: string;
  sender: string;
  reciever: string;
  received_time: string;
  body: string;
}

type NotificationType = 'approve' | 'reject' | 'error';

interface NotificationState {
  show: boolean;
  message: string;
  type: NotificationType | '';
  description?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

const EmailViewer: React.FC = () => {
  const [notification, setNotification] = useState<NotificationState>({ 
    show: false, 
    message: '', 
    type: '',
    description: '' 
  });
  
  const searchParams = useSearchParams();
  const data = searchParams.getAll('email');
  const email: Email = JSON.parse(data[0]);
  const organizername = searchParams.get('organizername');
  const app_id = searchParams.get('application_id');

  const showNotification = (message: string, type: NotificationType, description?: string): void => {
    setNotification({ show: true, message, type, description });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '', description: '' });
    }, 4000);
  };

  const formatDate = (dateString: string): string => {
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

  const handle = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    const button = e.target as HTMLButtonElement;
    const action = button.name as 'approve' | 'reject';
    
    try {
      const res = await fetch('/api/applicationhandle', {
        method: 'PUT',
        body: JSON.stringify({
          action: action, 
          organizeremail: organizername, 
          app_id: app_id
        })
      });

      const response: ApiResponse = await res.json();
      console.log(response, 'fs');
      
      if (response.success) {
        // Use action type directly for notification
        showNotification(
          action === 'approve' ? 'Application Approved!' : 'Application Rejected',
          action,
          response.message
        );
      } else {
        showNotification('Action Failed', 'error', response.message || 'There was an error processing your request');
      }
    } catch (error) {
      console.log(error);
      showNotification('System Error', 'error', 'An unexpected error occurred. Please try again.');
    }
  };

  const getNotificationStyles = (type: NotificationType | ''): string => {
    switch(type) {
      case 'approve':
        return 'bg-gradient-to-r from-green-500/90 to-emerald-600/90 ring-2 ring-green-400';
      case 'reject':
        return 'bg-gradient-to-r from-orange-500/90 to-amber-600/90 ring-2 ring-orange-400';
      case 'error':
        return 'bg-gradient-to-r from-red-500/90 to-rose-600/90 ring-2 ring-red-400';
      default:
        return '';
    }
  };

  const getNotificationIcon = (type: NotificationType | '') => {
    switch(type) {
      case 'approve':
        return <CheckCircle2 className="w-6 h-6 text-white" />;
      case 'reject':
        return <XCircle className="w-6 h-6 text-white" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-white" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen relative">
      {/* Enhanced Notification */}
      {notification.show && (
        <div 
          className={`
            fixed top-4 right-4 p-6 rounded-xl shadow-2xl
            animate-[slideIn_0.5s_ease-out]
            backdrop-blur-lg backdrop-filter
            flex items-center gap-3 min-w-[300px]
            transform transition-all duration-500
            text-white
            ${getNotificationStyles(notification.type)}
          `}
          style={{
            animation: `
              slideIn 0.5s ease-out,
              bounce 0.5s ease-out,
              fadeIn 0.5s ease-out
            `
          }}
        >
          <div className="absolute -left-1 top-0 bottom-0 w-2 rounded-l-xl bg-white/20"></div>
          
          <div className="flex-shrink-0 animate-bounce">
            {getNotificationIcon(notification.type)}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">
              {notification.message}
            </h3>
            {notification.description && (
              <p className="text-sm text-white/90">{notification.description}</p>
            )}
          </div>

          <div className="absolute -bottom-1 left-4 right-4 h-1 rounded-full bg-white/20">
            <div 
              className="h-full w-full bg-white/40 rounded-full"
              style={{
                animation: 'progressBar 4s linear'
              }}
            ></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>

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
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300" 
              name='approve' 
              onClick={handle}
            >
              Approve ✅
            </button>
            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full transition-colors duration-300" 
              name='reject' 
              onClick={handle}
            >
              Reject ➡️
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailViewer;