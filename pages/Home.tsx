
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://th.bing.com/th/id/R.9bf7fd4189e043073f773f13adfdbfb5?rik=f9UQ1YEs7StKeQ&pid=ImgRaw&r=0" 
            alt="Luxury Car Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start px-8">
          <span className="text-red-600 font-bold tracking-widest uppercase mb-4">Excellence Automobile</span>
          <h1 className="font-luxury text-6xl md:text-8xl mb-6 leading-tight text-slate-900">
            CONGOCAR <br />
            <span className="text-red-600">EXCLUSIVE</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-xl">
            Découvrez une sélection unique de véhicules de prestige et de luxe au Congo. Réservez votre futur joyau en quelques clics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/catalogue')}
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl text-lg font-bold transition flex items-center justify-center space-x-2 shadow-xl shadow-red-600/30"
            >
              <span>Voir le catalogue</span>
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="bg-white border-2 border-slate-200 hover:border-red-600 text-slate-900 px-10 py-4 rounded-xl text-lg font-bold transition flex items-center justify-center"
            >
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredCars.length > 0 && (
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="font-luxury text-4xl md:text-5xl mb-4 text-slate-900">Nos Exclusivités</h2>
                <p className="text-slate-500 max-w-md">Sélection exclusive des véhicules les plus récents et prestigieux actuellement disponibles.</p>
              </div>
              <button onClick={() => navigate('/catalogue')} className="hidden md:flex text-red-600 hover:text-red-700 font-bold items-center space-x-2 transition">
                <span>Catalogue complet</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredCars.map(car => (
                <div key={car.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={car.image} 
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                      {car.year}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900">{car.brand} {car.model}</h3>
                    <p className="text-3xl font-luxury text-red-600 mb-8">
                      {car.price.toLocaleString('fr-FR')} $
                    </p>
                    <button 
                      onClick={() => navigate(`/car/${car.id}`)}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg"
                    >
                      Détails du véhicule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Us Section */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-luxury text-4xl md:text-5xl mb-4 text-slate-900">Une Expérience Unique</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Nous redéfinissons les standards de la vente automobile de prestige au Congo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 text-center">
              <div className="w-20 h-20 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="text-red-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Confiance Absolue</h3>
              <p className="text-slate-500 leading-relaxed">Chaque véhicule est minutieusement inspecté pour garantir une sérénité totale lors de votre achat.</p>
            </div>
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 text-center">
              <div className="w-20 h-20 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Award className="text-red-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Sélection Elite</h3>
              <p className="text-slate-500 leading-relaxed">Une curation exclusive des modèles les plus convoités du marché international.</p>
            </div>
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 text-center">
              <div className="w-20 h-20 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Clock className="text-red-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Service Premium</h3>
              <p className="text-slate-500 leading-relaxed">Un accompagnement sur mesure et une réactivité exemplaire pour toutes vos demandes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
