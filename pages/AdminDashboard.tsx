
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Check, X, Search, LogOut, LayoutDashboard, Calendar, Mail, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Car, Reservation, UserMessage } from '../types';

const AdminDashboard: React.FC = () => {
  const [view, setView] = useState<'cars' | 'reservations' | 'messages'>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [carForm, setCarForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    description: '',
    image: '',
    status: 'Disponible' as const
  });

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    if (view === 'cars') {
      const { data } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
      if (data) setCars(data);
    } else if (view === 'reservations') {
      const { data } = await supabase
        .from('reservations')
        .select(`*, cars (*)`)
        .order('created_at', { ascending: false });
      if (data) setReservations(data);
    } else if (view === 'messages') {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (data) setMessages(data);
    }
    setLoading(false);
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('cars').insert([carForm]);
    if (!error) {
      setIsAddingCar(false);
      setCarForm({ brand: '', model: '', year: new Date().getFullYear(), price: 0, description: '', image: '', status: 'Disponible' });
      fetchData();
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette voiture ?")) {
      await supabase.from('cars').delete().eq('id', id);
      fetchData();
    }
  };

  const toggleStatus = async (car: Car) => {
    const newStatus = car.status === 'Disponible' ? 'Vendu' : 'Disponible';
    await supabase.from('cars').update({ status: newStatus }).eq('id', car.id);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h1 className="font-luxury text-4xl">Panneau <span className="text-red-600">Admin</span></h1>
          
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200">
            <button 
              onClick={() => setView('cars')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${view === 'cars' ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:text-red-600'}`}
            >
              Catalogue
            </button>
            <button 
              onClick={() => setView('reservations')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${view === 'reservations' ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:text-red-600'}`}
            >
              Réservations
            </button>
            <button 
              onClick={() => setView('messages')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${view === 'messages' ? 'bg-red-600 text-white shadow-md' : 'text-slate-500 hover:text-red-600'}`}
            >
              Messages
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-20 border-t-red-600"></div>
          </div>
        ) : (
          <>
            {view === 'cars' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Gestion du Catalogue</h2>
                    <p className="text-slate-500">Vous avez actuellement {cars.length} véhicules en ligne.</p>
                  </div>
                  <button 
                    onClick={() => setIsAddingCar(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition shadow-lg"
                  >
                    <Plus size={20} />
                    <span>Nouvelle Voiture</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cars.map(car => (
                    <div key={car.id} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={car.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute top-4 right-4 flex space-x-2">
                          <button 
                            onClick={() => handleDeleteCar(car.id)}
                            className="bg-white/90 backdrop-blur-md text-red-600 p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-slate-900">{car.brand} {car.model}</h3>
                          <button 
                            onClick={() => toggleStatus(car)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition ${car.status === 'Disponible' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}
                          >
                            {car.status}
                          </button>
                        </div>
                        <p className="text-2xl font-luxury text-red-600 mb-4">{car.price.toLocaleString('fr-FR')} $</p>
                        <p className="text-sm text-slate-500 line-clamp-2">{car.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'reservations' && (
              <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-8 text-xs font-bold uppercase text-slate-400 tracking-widest">Client</th>
                        <th className="p-8 text-xs font-bold uppercase text-slate-400 tracking-widest">Véhicule</th>
                        <th className="p-8 text-xs font-bold uppercase text-slate-400 tracking-widest">Contact</th>
                        <th className="p-8 text-xs font-bold uppercase text-slate-400 tracking-widest">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reservations.map(res => (
                        <tr key={res.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-8">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 font-bold">
                                {res.name.charAt(0)}
                              </div>
                              <p className="font-bold text-slate-900">{res.name}</p>
                            </div>
                          </td>
                          <td className="p-8">
                            <div className="bg-slate-100 px-4 py-2 rounded-xl inline-block">
                              <p className="font-semibold text-slate-700">{(res as any).cars?.brand} {(res as any).cars?.model}</p>
                            </div>
                          </td>
                          <td className="p-8">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-slate-600">
                                <Mail size={14} className="text-red-600" />
                                <span className="text-sm">{res.email}</span>
                              </div>
                              <p className="text-xs font-bold text-slate-400">{res.phone}</p>
                            </div>
                          </td>
                          <td className="p-8 text-sm text-slate-500 font-medium">
                            {new Date(res.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {reservations.length === 0 && (
                  <div className="py-20 text-center text-slate-400 font-medium">Aucune réservation pour le moment.</div>
                )}
              </div>
            )}

            {view === 'messages' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {messages.map(msg => (
                  <div key={msg.id} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-bl-full group-hover:bg-red-600 transition duration-500"></div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-bold text-xl text-slate-900 mb-1">{msg.name}</h3>
                        <p className="text-red-600 font-medium">{msg.email}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl italic text-slate-600 leading-relaxed border border-slate-100 shadow-inner">
                      "{msg.message}"
                    </div>
                    <div className="mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>{new Date(msg.created_at).toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="col-span-full py-20 bg-white rounded-[40px] border border-slate-200 text-center text-slate-400 font-medium">
                    Aucun message reçu.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Add Car Modal - Updated to Light Theme */}
        {isAddingCar && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-white border border-slate-200 rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-12 shadow-2xl relative">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-luxury text-slate-900">Nouvelle Acquisition</h2>
                <button onClick={() => setIsAddingCar(false)} className="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-red-600 transition"><X /></button>
              </div>
              
              <form onSubmit={handleAddCar} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">Marque</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all" placeholder="ex: Mercedes-Benz" value={carForm.brand} onChange={e => setCarForm({...carForm, brand: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">Modèle</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all" placeholder="ex: Classe S" value={carForm.model} onChange={e => setCarForm({...carForm, model: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">Année</label>
                    <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all" value={carForm.year} onChange={e => setCarForm({...carForm, year: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">Prix ($)</label>
                    <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all" value={carForm.price} onChange={e => setCarForm({...carForm, price: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">URL de l'image haute résolution</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all" placeholder="https://images.unsplash.com/..." value={carForm.image} onChange={e => setCarForm({...carForm, image: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-widest pl-2">Description exclusive</label>
                  <textarea required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none resize-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all" placeholder="Présentez les atouts de ce véhicule..." value={carForm.description} onChange={e => setCarForm({...carForm, description: e.target.value})}></textarea>
                </div>
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-bold text-xl transition shadow-xl shadow-slate-900/10">Publier Immédiatement</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
