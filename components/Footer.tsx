
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Car className="text-red-600 w-8 h-8" />
              <span className="font-luxury text-2xl tracking-wider text-white">CONGOCAR <span className="text-red-600">EXCLUSIVE</span></span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-6">
              L’excellence automobile au Congo. Vente et réservation de véhicules de prestige pour une clientèle exigeante.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <Mail size={18} className="text-red-600" />
              <span>mungu.massikini@hotmail.com</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Liens Rapides</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/" className="hover:text-red-600 transition">Accueil</Link></li>
              <li><Link to="/catalogue" className="hover:text-red-600 transition">Catalogue</Link></li>
              <li><Link to="/contact" className="hover:text-red-600 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Informations</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/login" className="hover:text-red-600 transition">Mon Compte</Link></li>
              <li className="text-sm">© 2025 CONGOCAR EXCLUSIVE. Tous droits réservés.</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 text-center text-sm text-gray-500">
          CONGOCAR EXCLUSIVE - L'excellence automobile à portée de clic.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
