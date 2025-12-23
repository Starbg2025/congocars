
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
      const uniqueBrands = Array.from(new Set(data.map(c => c.brand)));
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
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="font-luxury text-4xl md:text-5xl mb-6">Catalogue Automobile</h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text"
                placeholder="Rechercher une marque, un modèle..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-red-600 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <SlidersHorizontal className="text-red-600" />
              <select 
                className="bg-zinc-900 border border-white/10 rounded-xl py-3 px-4 outline-none w-full"
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
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map(car => (
              <Link 
                key={car.id} 
                to={`/car/${car.id}`}
                className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img 
                    src={car.image || `https://picsum.photos/800/600?random=${car.id}`} 
                    alt={car.brand} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {car.status === 'Vendu' && (
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10 backdrop-blur-sm">
                      Vendu
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{car.brand} {car.model}</h3>
                      <p className="text-gray-400 text-sm">{car.year} • {car.status}</p>
                    </div>
                    <div className="p-2 rounded-full bg-red-600/10 text-red-600 opacity-0 group-hover:opacity-100 transition">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-luxury text-white">
                      {car.price.toLocaleString('fr-FR')} $
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-white/5">
            <p className="text-xl text-gray-500">Aucun véhicule trouvé pour votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogue;
