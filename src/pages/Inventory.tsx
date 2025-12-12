import { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/types';
import { Page } from '../types/types';

interface InventoryProps {
  onNavigate: (page: Page) => void;
}

export default function Inventory({ onNavigate }: InventoryProps) {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) return;

    if (editingId) {
      updateProduct(editingId, {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      setEditingId(null);
    } else {
      addProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        initialStock: parseInt(formData.stock),
      });
    }

    setFormData({ name: '', price: '', stock: '' });
    setIsAdding(false);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', price: '', stock: '' });
  };

  const handleAddStock = (product: Product) => {
    const quantity = prompt(`¿Cuántas unidades quieres agregar a ${product.name}?`);
    const parsed = quantity ? parseInt(quantity) : 0;
    if (!quantity || isNaN(parsed) || parsed <= 0) {
      alert('Ingresa una cantidad válida mayor a 0');
      return;
    }
    updateProduct(product.id, {
      stock: product.stock + parsed,
      initialStock: product.initialStock + parsed,
    });
    alert(`Se agregaron ${parsed} unidades a ${product.name}`);
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
          <h1 className="text-2xl font-bold text-yellow-500">Inventario</h1>
          <div className="w-20" />
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full mb-6 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50"
          >
            <Plus className="w-5 h-5" />
            Agregar Producto
          </button>
        )}

        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600 rounded-xl p-6 mb-6"
          >
            <h3 className="text-xl font-semibold text-yellow-500 mb-4">
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-black border border-yellow-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Ej: Coca Cola 500ml"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio (S/)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-black border border-yellow-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full bg-black border border-yellow-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
                >
                  <Save className="w-5 h-5" />
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No hay productos en el inventario
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/50 rounded-xl p-4 hover:border-yellow-600 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-yellow-500 font-bold">
                        S/ {product.price.toFixed(2)}
                      </span>
                      <span
                        className={`${
                          product.stock <= 5
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`}
                      >
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAddStock(product)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `¿Eliminar ${product.name}?`
                          )
                        ) {
                          deleteProduct(product.id);
                        }
                      }}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
