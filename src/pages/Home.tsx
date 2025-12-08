import { ShoppingCart, Package, Settings, FileText, Receipt } from 'lucide-react';
import { Page } from '../types/types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const menuItems = [
    {
      icon: ShoppingCart,
      label: 'Vender',
      page: 'sale' as Page,
      description: 'Registrar ventas rápidas',
    },
    {
      icon: Package,
      label: 'Inventario',
      page: 'inventory' as Page,
      description: 'Gestionar productos',
    },
    {
      icon: Settings,
      label: 'Configuración',
      page: 'settings' as Page,
      description: 'Vuelto inicial',
    },
    {
      icon: FileText,
      label: 'Reporte',
      page: 'report' as Page,
      description: 'Cierre de caja',
    },
    {
      icon: Receipt,
      label: 'Ventas',
      page: 'sales' as Page,
      description: 'Ver y editar ventas',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Inventario Eventos
          </h1>
          <p className="text-gray-400">Sistema de Venta Rápida</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 group-hover:from-yellow-500 group-hover:to-yellow-400 transition-all duration-300 shadow-lg">
                    <Icon className="w-8 h-8 text-black" />
                  </div>

                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-yellow-500 group-hover:text-yellow-400 transition-colors mb-1">
                      {item.label}
                    </h2>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
