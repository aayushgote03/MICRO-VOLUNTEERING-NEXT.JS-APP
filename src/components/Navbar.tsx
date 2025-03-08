import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react' // Import icons
import NotificationDropdown from './ui/Notification'
import LogoutButton from './Logoutbutton'
import OrganizerDropdown from './organizerdropdown'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true); // Navbar visibility state
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const storedemail = localStorage.getItem('user');
      if (storedemail) {
        const user = JSON.parse(storedemail);
        console.log(user, 'user');
        setUser(user);
      } else {
        try {
          const response = await fetch('/api/get')
          const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <div className="relative">
      {/* Navbar */}
      <nav 
        className={`fixed top-0 w-full border-b border-gray-200 bg-white/50 backdrop-blur-md z-40 transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Helplinker</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div>
                hi <span className="font-bold">{user?.email}</span>
              </div>
              <div className="relative">
                <OrganizerDropdown user={user?.email || ''}/>
              </div>

              <Link href="/newhome" className="text-gray-700 hover:text-black">
                Home
              </Link>
              <Link href="#" className="text-gray-700 hover:text-black">
                Pricing
              </Link>
              <Link
                href={{
                  pathname: "/dashboard",
                  query: { user: user?.email || '' }
                }}
                className="text-gray-700 hover:text-black"
              >
                Dashboard
              </Link>
              {user?.email ? <NotificationDropdown user={user?.email || ''} /> : <p>Loading...</p>}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <Link href="/auth/signup" className="text-gray-700 hover:text-black">
                  Sign in
                </Link>
              </div>
              <div className="hidden md:block" onClick={handleLogout}>
                <LogoutButton/>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Toggle Arrow */}
      <div 
        className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 bg-gray-200 hover:bg-gray-300 rounded-full p-2 cursor-pointer transition"
        onClick={() => setShowNavbar(!showNavbar)}
      >
        {showNavbar ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
    </div>
  )
}

export default Navbar;
