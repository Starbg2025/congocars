
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Check, X, Search, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Car, Reservation, UserMessage } from '../types';

const AdminDashboard: React.FC = () => {
  const [view, setView] = useState<'cars' | 'reservations' | 'messages'>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Car form state
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
      setCarForm({ brand: '', model: '', year: 2024, price: 0, description: '', image: '', status: 'Disponible' });
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
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h1 className="font-luxury text-4xl">Panneau <span className="text-red-600">Admin</span></h1>
          
          <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/5">
            <button 
              onClick={() => setView('cars')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition ${view === 'cars' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Voitures
            </button>
            <button 
              onClick={() => setView('reservations')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition ${view === 'reservations' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Réservations
            </button>
            <button 
              onClick={() => setView('messages')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition ${view === 'messages' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Messages
            </button>
          </div>
        </div>

        {view === 'cars' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion du Catalogue</h2>
              <button 
                onClick={() => setIsAddingCar(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
              >
                <Plus size={20} />
                <span>Ajouter une voiture</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map(car => (
                <div key={car.id} className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden group">
                  <div className="aspect-video relative">
                    <img src={car.image || `https://picsum.photos/600/400?random=${car.id}`} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => handleDeleteCar(car.id)}
                        className="bg-red-600 p-2 rounded-lg hover:bg-red-700 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{car.brand} {car.model}</h3>
                      <button 
                        onClick={() => toggleStatus(car)}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${car.status === 'Disponible' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-zinc-800 text-gray-500'}`}
                      >
                        {car.status}
                      </button>
                    </div>
                    <p className="text-2xl font-luxury mb-4">{car.price.toLocaleString('fr-FR')} $</p>
                    <div className="text-sm text-gray-500 line-clamp-2 mb-4">{car.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'reservations' && (
          <div className="bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/50 border-b border-white/5">
                  <th className="p-6 text-xs font-bold uppercase text-gray-500">Client</th>
                  <th className="p-6 text-xs font-bold uppercase text-gray-500">Véhicule</th>
                  <th className="p-6 text-xs font-bold uppercase text-gray-500">Contact</th>
                  <th className="p-6 text-xs font-bold uppercase text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reservations.map(res => (
                  <tr key={res.id} className="hover:bg-white/5 transition">
                    <td className="p-6">
                      <p className="font-bold">{res.name}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-medium">{(res as any).cars?.brand} {(res as any).cars?.model}</p>
                    </td>
                    <td className="p-6 text-sm">
                      <p className="text-gray-300">{res.email}</p>
                      <p className="text-gray-500">{res.phone}</p>
                    </td>
                    <td className="p-6 text-sm text-gray-500">
                      {new Date(res.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'messages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map(msg => (
              <div key={msg.id} className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{msg.name}</h3>
                    <p className="text-sm text-red-600">{msg.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
                </div>
                <p className="text-gray-400 italic">"{msg.message}"</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Car Modal */}
        {isAddingCar && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-luxury">Ajouter une Voiture</h2>
                <button onClick={() => setIsAddingCar(false)} className="text-gray-500 hover:text-white"><X /></button>
              </div>
              
              <form onSubmit={handleAddCar} className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Marque</label>
                  <input required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none" placeholder="ex: Toyota" value={carForm.brand} onChange={e => setCarForm({...carForm, brand: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Modèle</label>
                  <input required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none" placeholder="ex: Land Cruiser" value={carForm.model} onChange={e => setCarForm({...carForm, model: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Année</label>
                  <input required type="number" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none" value={carForm.year} onChange={e => setCarForm({...carForm, year: parseInt(e.target.value)})} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Prix ($)</label>
                  <input required type="number" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none" value={carForm.price} onChange={e => setCarForm({...carForm, price: parseInt(e.target.value)})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">URL de l'image</label>
                  <input required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none" placeholder="https://..." value={carForm.image} onChange={e => setCarForm({...carForm, image: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Description</label>
                  <textarea required rows={4} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none resize-none" placeholder="Détails techniques, état..." value={carForm.description} onChange={e => setCarForm({...carForm, description: e.target.value})}></textarea>
                </div>
                <div className="col-span-2">
                  <button className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold transition">Publier la Voiture</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
