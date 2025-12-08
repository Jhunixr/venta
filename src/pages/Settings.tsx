import { useState } from 'react';
import { ArrowLeft, Save, DollarSign } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Page } from '../types/types';

interface SettingsProps {
  onNavigate: (page: Page) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  const { initialCash, updateInitialCash } = useStore();
  const [amount, setAmount] = useState(initialCash.toString());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount) || 0;
    updateInitialCash(value);
    alert('Vuelto inicial actualizado');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-2xl font-bold text-yellow-500">Configuración</h1>
          <div className="w-20" />
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Vuelto Inicial
              </h2>
              <p className="text-sm text-gray-400">
                Dinero para dar cambio al inicio del evento
              </p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monto Inicial (S/)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black border-2 border-yellow-600 rounded-xl px-4 py-4 text-white text-xl font-semibold focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="0.00"
              />
              <p className="mt-2 text-sm text-gray-400">
                Este es el dinero que te entrega tu jefa para dar vueltos
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-lg py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-lg active:scale-95"
            >
              <Save className="w-5 h-5" />
              Guardar Configuración
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-yellow-600/30">
            <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-500 mb-2">
                ¿Cómo funciona?
              </h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Este monto es el dinero inicial para dar cambio</li>
                <li>• Se suma a las ventas para el cuadre final</li>
                <li>• Puedes editarlo en cualquier momento</li>
                <li>• Aparece en el reporte de cierre de caja</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
