
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, LayoutDashboard } from 'lucide-react';
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
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="text-red-600 w-8 h-8" />
            <span className="font-luxury text-xl tracking-wider text-slate-900">CONGOCAR <span className="text-red-600">EXCLUSIVE</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-red-600 font-medium transition">Accueil</Link>
            <Link to="/catalogue" className="text-slate-600 hover:text-red-600 font-medium transition">Catalogue</Link>
            <Link to="/contact" className="text-slate-600 hover:text-red-600 font-medium transition">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {profile?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md"
                  >
                    <LayoutDashboard size={16} />
                    <span>Admin</span>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 transition p-2 bg-slate-100 rounded-full"
                  title="Déconnexion"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-slate-800 transition shadow-lg"
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
