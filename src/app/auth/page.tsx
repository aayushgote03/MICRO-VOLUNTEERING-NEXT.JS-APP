import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";


export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6" id="main-container">
      <div className="flex flex-col items-center justify-center w-full max-w-lg bg-white bg-opacity-40 rounded-lg shadow-2xl backdrop-blur-md p-8">
        <h1 className="text-4xl font-bold text-white mb-6">
          Welcome to Our App
        </h1>
        <p className="text-lg text-white mb-8">
          Choose an option to get started
        </p>

        {/* Button Container */}
        <div className="flex gap-6">
          {/* Login Button */}
          <Link
            href="auth/login"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 focus:outline-none"
          >
            Login
          </Link>

          {/* Sign Up Button */}
          <Link 
            href="auth/signup"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transform transition-all duration-300 hover:scale-105 focus:outline-none"
          >
            Sign Up
          </Link>
        </div>

        {/* App Icon or Logo */}
        <div className="mt-6">
          <a href="#" className="flex items-center gap-2 text-white font-medium text-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
              <GalleryVerticalEnd className="text-white" size={24} />
            </div>
            Acme App
          </a>
        </div>
      </div>
    </div>
  );
}
