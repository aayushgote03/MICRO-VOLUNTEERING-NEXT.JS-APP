"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface OrganizerDropdownProps {
  user: string;
}

const OrganizerDropdown = ({user}: OrganizerDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <span>Organizer's Tools</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
          onMouseLeave={() => setIsOpen(false)}
        >
          <Link 
            href="/mytasks"
            target="_blank" rel="noopener noreferrer"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Tasks
          </Link>
          <Link 
            href={{pathname: 'application_received', query:{user: user}}}
            target="_blank" rel="noopener noreferrer"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Applications Received
          </Link>
          <Link 
            href="/createtask"
            target="_blank" rel="noopener noreferrer"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Create Task
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrganizerDropdown;