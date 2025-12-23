
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
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (data.user) {
          await supabase.from('profiles').insert([{ id: data.user.id, role: 'client', username }]);
        }
        alert("Compte créé ! Un email de confirmation a été envoyé.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <span className="font-luxury text-4xl tracking-wider text-slate-900">CONGOCAR <span className="text-red-600">EXCLUSIVE</span></span>
          </Link>
          <h2 className="text-4xl font-luxury text-slate-900 mb-2">
            {isRegister ? 'Rejoindre l\'élite' : 'Heureux de vous revoir'}
          </h2>
          <p className="text-slate-500 text-lg">
            {isRegister ? 'Créez votre accès privilégié au catalogue exclusif.' : 'Identifiez-vous pour gérer vos réservations.'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[40px] p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-red-600"></div>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl mb-8 text-center font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">Nom d'utilisateur</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-red-600 outline-none transition-all focus:bg-white" placeholder="Pseudo" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-red-600 outline-none transition-all focus:bg-white" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input required type="password" minLength={6} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-red-600 outline-none transition-all focus:bg-white" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-bold text-xl transition shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
              ) : (
                <>
                  {isRegister ? <UserPlus size={22} /> : <LogIn size={22} />}
                  <span>{isRegister ? 'Créer mon compte' : 'Me connecter'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
            <button 
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-slate-500 hover:text-red-600 font-bold transition flex items-center space-x-2 mx-auto"
            >
              <span>{isRegister ? 'Déjà un compte ? Connexion' : 'Pas encore de compte ? Inscription'}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
