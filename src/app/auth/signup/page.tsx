"use client"
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter();
  const [handlename, setHandleName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      // Reset errors before validation
      setError(null);
  
      // Validation
      if (!handlename || !username || !email || !password || !confirmPassword) {
        setError("All fields are required.");
        return;
      }
  
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email.match(emailPattern)) {
        setError("Please enter a valid email address.");
        return;
      }  
  
    let result = await fetch("/api/auth/signup", {
      method:"POST",
      body:JSON.stringify({handlename, username, email, password}),
    });
  
    result = await result.json();

    if(result.status === 200) router.push('/auth/login');
    else setError("An error occurred during signup.");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white bg-opacity-60 rounded-lg shadow-xl backdrop-blur-md p-6 transform transition-all duration-500 ease-in-out hover:scale-105">
        <h1 className="text-3xl font-extrabold text-center text-white mb-4 font-poppins">
          Create Account
        </h1>

        {/* Error Breadcrumb */}
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Handle Name Input */}
          <div>
            <label htmlFor="handleName" className="text-sm text-white">
              Handle Name
            </label>
            <input
              type="text"
              id="handleName"
              value={handlename}
              onChange={(e) => setHandleName(e.target.value)}
              className="w-full mt-2 px-4 py-2 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              placeholder="Enter your handle name"
            />
          </div>
  
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="text-sm text-white">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-2 px-4 py-2 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              placeholder="Enter your username"
            />
          </div>
  
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="text-sm text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-2 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              placeholder="Enter your email address"
            />
          </div>
  
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="text-sm text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-2 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="text-sm text-white">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mt-2 px-4 py-2 rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
            placeholder="Confirm your password"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

  
          
  
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-2 mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-md hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            Create Account
          </button>
        </div>
  
        {/* Already have an account? Login Link */}
        <p className="text-center text-white mt-4 text-sm">
          Already have an account?{" "}
          <Link href="login" className="text-pink-400 hover:underline transition-all">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
  
}

export default page