"use client";

import { useState } from 'react';

export default function ResetPasswordEmail() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/sendmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (response.ok) {
            setMessage('A reset link has been sent to your email.');
        } else {
            setMessage('Failed to send reset link. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                <form onSubmit={handleEmailSubmit}>
                    <label htmlFor="email" className="block text-gray-700">Enter your email address:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg mt-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Submit</button>
                </form>
                {message && <p className="text-center mt-4 text-gray-600">{message}</p>}
            </div>
        </div>
    );
}
