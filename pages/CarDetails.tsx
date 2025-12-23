import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag, Info, CheckCircle, AlertCircle, Fuel, Gauge, ChevronRight } from 'lucide-react';
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

      const response = await fetch("/.netlify/functions/sendReservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reserveForm.name,
          email: reserveForm.email,
          phone: reserveForm.phone,
          car: `${car.brand} ${car.model} (${car.year})`,
          message: reserveForm.message
        })
      });

      setStatus('success');
      setReserveForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setIsReserving(false);
        setStatus('idle');
      }, 3000);

    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-20 border-t-red-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-900">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">Véhicule introuvable.</p>
          <button onClick={() => navigate('/catalogue')} className="text-red-600 font-bold hover:underline">Retour au catalogue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/catalogue')}
          className="mb-10 text-slate-500 hover:text-red-600 flex items-center space-x-2 transition font-semibold"
        >
          <ChevronRight className="rotate-180" size={20} />
          <span>Retour au catalogue</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="rounded-[40px] overflow-hidden aspect-video bg-white border border-slate-200 shadow-xl">
              <img 
                src={car.image} 
                alt={`${car.brand} ${car.model}`} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-slate-900">
            <div className="mb-10">
              <div className="flex items-center space-x-2 text-red-600 font-bold uppercase tracking-widest text-sm mb-4">
                <Tag size={18} />
                <span>{car.brand}</span>
              </div>
              <h1 className="font-luxury text-6xl mb-4 text-slate-900">{car.model}</h1>
              <p className="text-5xl font-light text-slate-900 mb-8 font-luxury">
                {car.price.toLocaleString('fr-FR')} $
              </p>
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${car.status === 'Disponible' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                  {car.status}
                </span>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  Année {car.year}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
                  <div className="bg-red-50 p-3 rounded-2xl text-red-600"><Gauge size={24} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">État</p>
                    <p className="font-bold text-slate-900">Excellent</p>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
                  <div className="bg-red-50 p-3 rounded-2xl text-red-600"><Fuel size={24} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Carburant</p>
                    <p className="font-bold text-slate-900">Standard</p>
                  </div>
               </div>
            </div>

            <div className="mb-12 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
              <h3 className="flex items-center space-x-3 font-bold text-2xl mb-6 text-slate-900">
                <Info size={24} className="text-red-600" />
                <span>Description détaillée</span>
              </h3>
              <p className="text-slate-500 leading-relaxed text-lg italic whitespace-pre-wrap">
                {car.description || "Aucune description détaillée disponible."}
              </p>
            </div>

            {car.status === 'Disponible' ? (
              <button 
                onClick={() => setIsReserving(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-3xl text-2xl font-bold transition shadow-2xl shadow-red-600/30"
              >
                Réserver ce véhicule
              </button>
            ) : (
              <div className="w-full bg-slate-200 text-slate-400 py-6 rounded-3xl text-2xl font-bold text-center border border-slate-300">
                Véhicule déjà vendu
              </div>
            )}
          </div>
        </div>
      </div>

      {isReserving && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 relative shadow-2xl border border-slate-200">
            <button onClick={() => setIsReserving(false)} className="absolute top-8 right-8 text-slate-400 hover:text-red-600 transition">Fermer</button>
            
            <h2 className="font-luxury text-4xl mb-2 text-slate-900">Demande de réservation</h2>
            <p className="text-slate-500 mb-10">Veuillez renseigner vos coordonnées pour être recontacté par notre service client.</p>

            {status === 'success' ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-600 w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-slate-900">Demande envoyée !</h3>
                <p className="text-slate-500 text-lg">Nous avons bien reçu votre demande. Un email de confirmation vous a été envoyé.</p>
              </div>
            ) : status === 'error' ? (
              <div className="text-center py-16">
                <AlertCircle className="text-red-600 w-20 h-20 mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4 text-slate-900">Erreur</h3>
                <p className="text-slate-500 text-lg">Une erreur s'est produite. Veuillez nous contacter directement par téléphone ou email.</p>
                <button onClick={() => setStatus('idle')} className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Réessayer</button>
              </div>
            ) : (
              <form onSubmit={handleReserve} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Nom complet</label>
                    <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all" value={reserveForm.name} onChange={e => setReserveForm({...reserveForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Téléphone</label>
                    <input required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all" value={reserveForm.phone} onChange={e => setReserveForm({...reserveForm, phone: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Email</label>
                  <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all" value={reserveForm.email} onChange={e => setReserveForm({...reserveForm, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Message (optionnel)</label>
                  <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all resize-none" value={reserveForm.message} onChange={e => setReserveForm({...reserveForm, message: e.target.value})}></textarea>
                </div>
                <button 
                  disabled={status === 'loading'}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl text-xl font-bold transition shadow-xl hover:bg-slate-800 disabled:opacity-50"
                >
                  {status === 'loading' ? 'Envoi en cours...' : 'Envoyer ma demande'}
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
