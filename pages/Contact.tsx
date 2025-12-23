
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const { error } = await supabase
      .from('messages')
      .insert([form]);
    
    if (!error) {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('idle');
      alert("Erreur lors de l'envoi du message.");
    }
  };

  return (
    <div className="min-h-screen bg-black py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="font-luxury text-5xl mb-6">Contactez-nous</h1>
            <p className="text-gray-400 text-lg mb-12 max-w-md">
              Vous avez une question sur un véhicule ou vous souhaitez prendre rendez-vous ? Notre équipe est à votre disposition.
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="bg-red-600/10 p-4 rounded-2xl text-red-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Email</h3>
                  <p className="text-gray-400 font-luxury">mungu.massikini@hotmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="bg-red-600/10 p-4 rounded-2xl text-red-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Localisation</h3>
                  <p className="text-gray-400">Kinshasa, République Démocratique du Congo</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-12">
                <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                <h2 className="text-3xl font-luxury mb-2">Message envoyé</h2>
                <p className="text-gray-400">Nous reviendrons vers vous dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Nom Complet</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-red-600 outline-none transition"
                    placeholder="Votre nom"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-red-600 outline-none transition"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Message</label>
                  <textarea 
                    required
                    rows={5}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-red-600 outline-none resize-none transition"
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  disabled={status === 'loading'}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-xl font-bold transition flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  <Send size={18} />
                  <span>Envoyer le Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
