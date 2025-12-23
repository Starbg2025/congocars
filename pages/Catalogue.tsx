
import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Car } from '../types';

const Catalogue: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setCars(data);
      // Fixed: Explicitly cast uniqueBrands as string[] to satisfy setBrands state
      const uniqueBrands = Array.from(new Set(data.map(c => (c as any).brand))) as string[];
      setBrands(uniqueBrands);
    }
    setLoading(false);
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'All' || car.brand === filterBrand;
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="font-luxury text-5xl mb-8 text-slate-900">Catalogue Automobile</h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Rechercher une voiture (marque, modèle...)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-red-600 focus:bg-white outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <SlidersHorizontal className="text-red-600 shrink-0" />
              <select 
                className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none w-full shadow-sm font-medium focus:ring-2 focus:ring-red-600 transition-all"
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
              >
                <option value="All">Toutes les marques</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-20 border-t-red-600"></div>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCars.map(car => (
              <Link 
                key={car.id} 
                to={`/car/${car.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img 
                    src={car.image || `https://picsum.photos/800/600?random=${car.id}`} 
                    alt={car.brand} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                    {car.year}
                  </div>
                  {car.status === 'Vendu' && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg">Vendu</span>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{car.brand} {car.model}</h3>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 text-red-600 opacity-0 group-hover:opacity-100 transition">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                  <div className="flex items-end justify-between border-t border-slate-50 pt-6">
                    <p className="text-3xl font-luxury text-slate-900">
                      {car.price.toLocaleString('fr-FR')} $
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
            <p className="text-2xl text-slate-400 font-medium">Aucun véhicule ne correspond à votre recherche.</p>
            <button 
              onClick={() => {setSearchTerm(''); setFilterBrand('All');}}
              className="mt-6 text-red-600 font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogue;
