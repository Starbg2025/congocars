
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-8">
              <Car className="text-red-600 w-10 h-10" />
              <span className="font-luxury text-3xl tracking-wider text-slate-900">CONGOCAR <span className="text-red-600">EXCLUSIVE</span></span>
            </Link>
            <p className="text-slate-500 text-lg max-w-md mb-10 leading-relaxed">
              La référence officielle de l'excellence automobile au Congo. Vente, réservation et conseil premium pour une expérience sans égale.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-600">
                <Mail size={20} className="text-red-600" />
                <span className="font-semibold">mungu.massikini@hotmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600">
                <MapPin size={20} className="text-red-600" />
                <span className="font-semibold">Kinshasa, RDC</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-8 text-slate-900">Découvrir</h3>
            <ul className="space-y-5 text-slate-500 font-medium">
              <li><Link to="/" className="hover:text-red-600 transition">Accueil</Link></li>
              <li><Link to="/catalogue" className="hover:text-red-600 transition">Le Catalogue</Link></li>
              <li><Link to="/contact" className="hover:text-red-600 transition">Nous Contacter</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-8 text-slate-900">Mon Compte</h3>
            <ul className="space-y-5 text-slate-500 font-medium">
              <li><Link to="/login" className="hover:text-red-600 transition">Connexion</Link></li>
              <li><Link to="/login" className="hover:text-red-600 transition">S'inscrire</Link></li>
              <li className="pt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">© 2025 CONGOCAR EXCLUSIVE</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-200 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
          L'excellence automobile au Congo - Plateforme Officielle
        </div>
      </div>
    </footer>
  );
};

export default Footer;
