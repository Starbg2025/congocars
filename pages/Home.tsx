
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
      {/* Hero Section with Requested Background Image */}
      <section className="relative h-[90vh] flex items-center overflow-hidden px-6 lg:px-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://th.bing.com/th/id/R.9bf7fd4189e043073f773f13adfdbfb5?rik=f9UQ1YEs7StKeQ&pid=ImgRaw&r=0" 
            alt="Luxury Car Background" 
            className="w-full h-full object-cover"
          />
          {/* Subtle light overlay for readability on white theme */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-start">
          <span className="text-red-600 font-bold tracking-widest uppercase mb-4 inline-block px-4 py-1 bg-red-50 rounded-full text-sm">
            Excellence Automobile 2025
          </span>
          <h1 className="font-luxury text-6xl md:text-8xl mb-6 leading-tight text-slate-900">
            CONGOCAR <br />
            <span className="text-red-600">EXCLUSIVE</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-10 max-w-xl leading-relaxed font-medium">
            Découvrez une sélection unique de véhicules de prestige au Congo. L'excellence automobile à portée de clic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/catalogue')}
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transition flex items-center justify-center space-x-2 shadow-xl shadow-red-600/30"
            >
              <span>Voir le catalogue</span>
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="bg-white/80 backdrop-blur-md border-2 border-slate-200 hover:border-slate-900 text-slate-900 px-10 py-5 rounded-2xl text-lg font-bold transition flex items-center justify-center"
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
                <p className="text-slate-500 max-w-md">Sélection exclusive des véhicules les plus prestigieux actuellement disponibles.</p>
              </div>
              <button onClick={() => navigate('/catalogue')} className="hidden md:flex text-red-600 hover:text-red-700 font-bold items-center space-x-2 transition p-2 hover:bg-red-50 rounded-xl">
                <span>Tout voir</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredCars.map(car => (
                <div key={car.id} className="group bg-white rounded-[40px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={car.image} 
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-bold text-slate-900 shadow-sm border border-white/20">
                      MODÈLE {car.year}
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900">{car.brand} {car.model}</h3>
                    <p className="text-3xl font-luxury text-red-600 mb-8">
                      {car.price.toLocaleString('fr-FR')} $
                    </p>
                    <button 
                      onClick={() => navigate(`/car/${car.id}`)}
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-slate-900/10"
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
          <div className="text-center mb-24">
            <h2 className="font-luxury text-4xl md:text-6xl mb-6 text-slate-900">Le Prestige Redéfini</h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full mb-8"></div>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">Nous redéfinissons les standards de la vente automobile de prestige au Congo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-slate-100 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">
                <ShieldCheck size={48} className="transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Confiance Absolue</h3>
              <p className="text-slate-500 leading-relaxed px-4">Chaque véhicule est minutieusement inspecté pour garantir une sérénité totale.</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-slate-100 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">
                <Award size={48} className="transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Sélection Elite</h3>
              <p className="text-slate-500 leading-relaxed px-4">Une curation exclusive des modèles les plus convoités du marché international.</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-slate-100 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">
                <Clock size={48} className="transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Service Premium</h3>
              <p className="text-slate-500 leading-relaxed px-4">Un accompagnement sur mesure et une réactivité exemplaire pour toutes vos demandes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
