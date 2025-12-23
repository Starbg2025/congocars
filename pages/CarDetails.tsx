
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Gauge, Fuel, Settings, Tag, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);
  const [reserveForm, setReserveForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchCar = async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        setCar(data);
      }
      setLoading(false);
    };
    fetchCar();
  }, [id]);

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) return;
    setStatus('loading');

    try {
      // 1. Enregistrement dans Supabase
      const { error: resError } = await supabase
        .from('reservations')
        .insert([{
          car_id: car.id,
          name: reserveForm.name,
          email: reserveForm.email,
          phone: reserveForm.phone,
          message: reserveForm.message
        }]);

      if (resError) throw resError;

      // 2. Appel de la fonction Netlify pour l'envoi d'emails
      const response = await fetch("/.netlify/functions/sendReservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: reserveForm.name,
          email: reserveForm.email,
          phone: reserveForm.phone,
          car: `${car.brand} ${car.model} (${car.year})`,
          message: reserveForm.message
        })
      });

      if (!response.ok) {
        console.warn("L'envoi d'email a échoué via la fonction Netlify, mais la réservation est enregistrée en base.");
      }

      setStatus('success');
      setReserveForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setIsReserving(false);
        setStatus('idle');
      }, 3000);

    } catch (err) {
      console.error("Erreur lors de la réservation:", err);
      setStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Voiture introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Section Images */}
          <div>
            <div className="rounded-3xl overflow-hidden mb-6 aspect-video bg-zinc-900 border border-white/10">
              <img 
                src={car.image} 
                alt={`${car.brand} ${car.model}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200';
                }}
              />
            </div>
          </div>

          {/* Section Informations */}
          <div className="text-white">
            <div className="mb-8">
              <div className="flex items-center space-x-2 text-red-600 mb-2 font-bold uppercase tracking-widest text-sm">
                <Tag size={16} />
                <span>{car.brand}</span>
              </div>
              <h1 className="font-luxury text-5xl mb-4">{car.model}</h1>
              <p className="text-4xl font-light text-white mb-6">
                {car.price.toLocaleString('fr-FR')} $
              </p>
              <div className="inline-block px-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-sm font-semibold">
                Statut: <span className={car.status === 'Disponible' ? 'text-green-500' : 'text-red-500'}>{car.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="flex items-center space-x-4 bg-zinc-900 p-4 rounded-2xl border border-white/10">
                <Calendar className="text-red-600" />
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold">Année</p>
                  <p className="font-bold">{car.year}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-zinc-900 p-4 rounded-2xl border border-white/10">
                <Settings className="text-red-600" />
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold">État</p>
                  <p className="font-bold">{car.status}</p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="flex items-center space-x-2 font-bold text-xl mb-4">
                <Info size={20} className="text-red-600" />
                <span>Description</span>
              </h3>
              <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                {car.description || "Aucune description détaillée disponible."}
              </p>
            </div>

            {car.status === 'Disponible' ? (
              <button 
                onClick={() => setIsReserving(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl text-xl font-bold transition shadow-xl shadow-red-600/20"
              >
                Réserver cette voiture
              </button>
            ) : (
              <div className="w-full bg-zinc-800 text-gray-500 py-5 rounded-2xl text-xl font-bold text-center border border-white/5">
                Déjà Vendue
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fenêtre modale de réservation */}
      {isReserving && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-xl p-8 relative">
            <button 
              onClick={() => setIsReserving(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white"
            >
              Fermer
            </button>
            
            <h2 className="font-luxury text-3xl mb-2">Réserver ce véhicule</h2>
            <p className="text-gray-400 mb-8">Veuillez remplir vos informations pour confirmer votre intérêt.</p>

            {status === 'success' ? (
              <div className="text-center py-12">
                <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Réservation réussie !</h3>
                <p className="text-gray-400">Un courriel a été envoyé à l'administration et une confirmation vous sera envoyée.</p>
              </div>
            ) : status === 'error' ? (
              <div className="text-center py-12">
                <AlertCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Une erreur est survenue</h3>
                <p className="text-gray-400">Veuillez réessayer plus tard ou nous contacter directement.</p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-red-500 underline">Réessayer</button>
              </div>
            ) : (
              <form onSubmit={handleReserve} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Nom Complet</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                      value={reserveForm.name}
                      onChange={e => setReserveForm({...reserveForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Téléphone</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                      value={reserveForm.phone}
                      onChange={e => setReserveForm({...reserveForm, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none"
                    value={reserveForm.email}
                    onChange={e => setReserveForm({...reserveForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Message (Optionnel)</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-600 outline-none resize-none"
                    value={reserveForm.message}
                    onChange={e => setReserveForm({...reserveForm, message: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  disabled={status === 'loading'}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition disabled:opacity-50"
                >
                  {status === 'loading' ? 'Traitement en cours...' : 'Confirmer la réservation'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
