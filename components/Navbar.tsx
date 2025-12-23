
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, LayoutDashboard, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface NavbarProps {
  user: any;
  profile: Profile | null;
}

const Navbar: React.FC<NavbarProps> = ({ user, profile }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="text-red-600 w-8 h-8" />
            <span className="font-luxury text-xl tracking-wider text-white">CONGOCAR <span className="text-red-600">EXCLUSIVE</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition">Accueil</Link>
            <Link to="/catalogue" className="text-gray-300 hover:text-white transition">Catalogue</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {profile?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition p-2"
                  title="Déconnexion"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                <User size={18} />
                <span>Connexion</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
