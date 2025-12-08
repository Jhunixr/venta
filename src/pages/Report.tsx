import { ArrowLeft, Printer, TrendingUp, Package, DollarSign, Wallet } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Page } from '../types/types';

interface ReportProps {
  onNavigate: (page: Page) => void;
}

export default function Report({ onNavigate }: ReportProps) {
  const { products, sales, initialCash } = useStore();

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);

  const salesByMethod = {
    efectivo: sales
      .filter((s) => s.paymentMethod === 'efectivo')
      .reduce((sum, s) => sum + s.total, 0),
    yape: sales
      .filter((s) => s.paymentMethod === 'yape')
      .reduce((sum, s) => sum + s.total, 0),
  };

  const totalChange = sales
    .filter((s) => s.paymentMethod === 'efectivo')
    .reduce((sum, s) => sum + s.change, 0);

  const cashInHand = initialCash + salesByMethod.efectivo;

  const productsSold = products.map((product) => {
    const quantitySold = product.initialStock - product.stock;
    return {
      ...product,
      quantitySold,
      revenue: quantitySold * product.price,
    };
  }).filter(p => p.quantitySold > 0);

  const totalProductsSold = productsSold.reduce((sum, p) => sum + p.quantitySold, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-2xl font-bold text-yellow-500">Reporte de Cierre</h1>
          <button
            onClick={handlePrint}
            className="p-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 transition-colors"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-500 text-black rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Resumen de Ventas</h2>
            </div>
            <div className="text-4xl font-bold">S/ {totalSales.toFixed(2)}</div>
            <div className="text-sm mt-1 opacity-90">{sales.length} transacciones</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-600 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-green-500">Efectivo</h3>
              </div>
              <div className="text-2xl font-bold text-white">
                S/ {salesByMethod.efectivo.toFixed(2)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-600 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-purple-500">Yape</h3>
              </div>
              <div className="text-2xl font-bold text-white">
                S/ {salesByMethod.yape.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600 rounded-xl p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Cuadre de Caja
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">Vuelto Inicial:</span>
                <span className="font-semibold text-white">
                  S/ {initialCash.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">Ventas en Efectivo:</span>
                <span className="font-semibold text-green-400">
                  + S/ {salesByMethod.efectivo.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400">Vueltos Entregados:</span>
                <span className="font-semibold text-red-400">
                  - S/ {totalChange.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 bg-yellow-600/20 rounded-lg px-3 mt-4">
                <span className="font-bold text-yellow-500 text-lg">
                  Efectivo en Mano:
                </span>
                <span className="font-bold text-yellow-500 text-2xl">
                  S/ {cashInHand.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-gray-800 mt-2">
                <span className="text-gray-400">Ventas en Yape:</span>
                <span className="font-semibold text-purple-400">
                  S/ {salesByMethod.yape.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 bg-gray-800 rounded-lg px-3">
                <span className="font-bold text-white text-lg">
                  Total a Entregar:
                </span>
                <span className="font-bold text-yellow-500 text-2xl">
                  S/ {(cashInHand + salesByMethod.yape).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600 rounded-xl p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
              <Package className="w-6 h-6" />
              Productos Vendidos ({totalProductsSold} unidades)
            </h3>

            {productsSold.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No se han registrado ventas
              </div>
            ) : (
              <div className="space-y-3">
                {productsSold.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {product.quantitySold} x S/ {product.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-500">
                        S/ {product.revenue.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">
                        Quedan: {product.stock}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600 rounded-xl p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
              <Package className="w-6 h-6" />
              Inventario Restante
            </h3>

            {products.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No hay productos en inventario
              </div>
            ) : (
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0"
                  >
                    <span className="text-white">{product.name}</span>
                    <span
                      className={`font-semibold ${
                        product.stock === 0
                          ? 'text-red-400'
                          : product.stock <= 5
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }`}
                    >
                      {product.stock} unidades
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center text-gray-500 text-sm pb-4">
            Inventario Eventos - Reporte generado el{' '}
            {new Date().toLocaleString('es-PE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
