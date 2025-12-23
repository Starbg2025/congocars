
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Award, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';

const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'Disponible')
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setFeaturedCars(data);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-black text-white">
      {/* Section Hero avec image de fond personnalisée */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://th.bing.com/th/id/R.9bf7fd4189e043073f773f13adfdbfb5?rik=f9UQ1YEs7StKeQ&pid=ImgRaw&r=0" 
            alt="Luxury Car Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl">
          <h1 className="font-luxury text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
            CONGOCAR <br />
            <span className="text-red-600">EXCLUSIVE</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto drop-shadow-lg">
            L’excellence automobile à portée de clic. Plateforme officielle de vente et de réservation au Congo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/catalogue')}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition flex items-center justify-center space-x-2 shadow-lg shadow-red-600/20"
            >
              <span>Voir le catalogue</span>
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-full text-lg font-semibold transition"
            >
              Contactez-nous
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gray-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Section Nouveautés */}
      {featuredCars.length > 0 && (
        <section className="py-24 px-4 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-luxury text-4xl md:text-5xl mb-4">Nouveautés</h2>
                <p className="text-gray-400">Découvrez nos dernières acquisitions exclusives.</p>
              </div>
              <button onClick={() => navigate('/catalogue')} className="text-red-600 hover:text-red-500 font-semibold flex items-center space-x-2">
                <span>Voir tout</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map(car => (
                <div key={car.id} className="group bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all duration-300">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800'; }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{car.brand} {car.model}</h3>
                      <span className="bg-red-600/10 text-red-500 text-xs font-bold px-2 py-1 rounded">{car.year}</span>
                    </div>
                    <p className="text-2xl font-luxury text-white mb-6">
                      {car.price.toLocaleString('fr-FR')} $
                    </p>
                    <button 
                      onClick={() => navigate(`/car/${car.id}`)}
                      className="w-full block text-center bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                    >
                      Voir Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pourquoi choisir nous */}
      <section className="py-24 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-luxury text-4xl text-center mb-16">Pourquoi CONGOCAR EXCLUSIVE ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Sécurité Garantie</h3>
              <p className="text-gray-400">Transactions sécurisées et vérification rigoureuse de chaque véhicule.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Qualité Premium</h3>
              <p className="text-gray-400">Une sélection exclusive de voitures haut de gamme et standards.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Service Rapide</h3>
              <p className="text-gray-400">Réponse immédiate et accompagnement personnalisé pour chaque client.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
