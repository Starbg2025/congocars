
import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('messages').insert([form]);
    if (!error) {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('idle');
      alert("Erreur lors de l'envoi.");
    }
  };

  return (
    <div className="min-h-screen bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="font-luxury text-6xl mb-8 text-slate-900">Parlons de votre <br /><span className="text-red-600">Projet</span></h1>
            <p className="text-slate-500 text-xl mb-12 max-w-md leading-relaxed">
              Une question ? Une recherche spécifique ? Notre équipe d'experts est là pour vous conseiller.
            </p>

            <div className="space-y-10">
              <div className="flex items-start space-x-6">
                <div className="bg-red-50 p-5 rounded-3xl text-red-600 shadow-sm border border-red-100">
                  <Mail size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1 text-slate-900">Email</h3>
                  <p className="text-slate-500 text-lg">mungu.massikini@hotmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="bg-red-50 p-5 rounded-3xl text-red-600 shadow-sm border border-red-100">
                  <MapPin size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1 text-slate-900">Localisation</h3>
                  <p className="text-slate-500 text-lg">Kinshasa, République Démocratique du Congo</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-12 rounded-[40px] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-bl-[100px]"></div>
            
            {status === 'success' ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle className="text-green-600 w-12 h-12" />
                </div>
                <h2 className="text-4xl font-luxury mb-4 text-slate-900">Message envoyé !</h2>
                <p className="text-slate-500 text-lg">Nous avons bien reçu votre message et reviendrons vers vous très rapidement.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">Nom Complet</label>
                  <input required type="text" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-red-600 outline-none transition-all shadow-sm" placeholder="Votre nom" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">Email</label>
                  <input required type="email" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-red-600 outline-none transition-all shadow-sm" placeholder="votre@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">Message</label>
                  <textarea required rows={5} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-red-600 outline-none resize-none transition-all shadow-sm" placeholder="Comment pouvons-nous vous aider ?" value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
                </div>
                <button 
                  disabled={status === 'loading'}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-bold text-xl transition flex items-center justify-center space-x-3 shadow-2xl disabled:opacity-50"
                >
                  <Send size={22} />
                  <span>{status === 'loading' ? 'Envoi...' : 'Envoyer ma demande'}</span>
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
