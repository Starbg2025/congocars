
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, UserPlus, LogIn, ChevronRight, User } from 'lucide-react';

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        if (!username.trim()) throw new Error("Le nom d'utilisateur est requis.");
        
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        // Création automatique du profil client avec le nom d'utilisateur
        if (data.user) {
          await supabase.from('profiles').insert([{ 
            id: data.user.id, 
            role: 'client',
            username: username
          }]);
        }
        alert("Inscription réussie ! Veuillez vérifier votre courriel pour confirmer votre compte.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
             <div className="flex items-center space-x-2 justify-center">
              <span className="font-luxury text-3xl tracking-wider text-white">CONGOCAR <span className="text-red-600">EXCLUSIVE</span></span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold mb-2">
            {isRegister ? 'Rejoindre l\'élite' : 'Content de vous revoir'}
          </h2>
          <p className="text-gray-400">
            {isRegister ? 'Créez votre compte client en quelques secondes.' : 'Accédez à votre espace réservations.'}
          </p>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-4 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-gray-500 tracking-widest">Nom d'utilisateur</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    required
                    type="text"
                    className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-red-600 outline-none transition"
                    placeholder="Pseudo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-widest">Adresse Courriel</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="email"
                  className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-red-600 outline-none transition"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-widest">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="password"
                  className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-red-600 outline-none transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              ) : (
                <>
                  {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
                  <span>{isRegister ? 'Créer mon compte' : 'Se connecter'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-gray-400 hover:text-white transition flex items-center space-x-2 mx-auto"
            >
              <span>{isRegister ? 'Déjà un compte ? Connectez-vous' : 'Pas encore de compte ? Inscrivez-vous'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
