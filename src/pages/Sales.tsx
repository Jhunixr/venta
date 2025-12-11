import { useState } from 'react';
import { ArrowLeft, Edit2, X, Save, Camera, Upload, Download } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Sale, Page } from '../types/types';

interface SalesProps {
  onNavigate: (page: Page) => void;
}

export default function Sales({ onNavigate }: SalesProps) {
  const { sales, updateSale, yapePhoneNumber } = useStore();
  const [editingSale, setEditingSale] = useState<string | null>(null);
  const [editedSale, setEditedSale] = useState<Partial<Sale> | null>(null);
  const [fileInputRefs, setFileInputRefs] = useState<{ [key: string]: HTMLInputElement | null }>({});
  const [uploadInputRefs, setUploadInputRefs] = useState<{ [key: string]: HTMLInputElement | null }>({});

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale.id);
    setEditedSale({ ...sale });
  };

  const handleCancel = () => {
    setEditingSale(null);
    setEditedSale(null);
  };

  const handleSave = (saleId: string) => {
    if (!editedSale) return;
    
    updateSale(saleId, editedSale);
    setEditingSale(null);
    setEditedSale(null);
    alert('Venta actualizada exitosamente');
  };

  const handleFileChange = (saleId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedSale((prev) => ({
          ...prev,
          evidencePhoto: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = (saleId: string) => {
    if (fileInputRefs[saleId]) {
      fileInputRefs[saleId].click();
    }
  };

  const handleUploadPhoto = (saleId: string) => {
    if (uploadInputRefs[saleId]) {
      uploadInputRefs[saleId].click();
    }
  };

  const handleDownloadPhoto = (photoData: string, saleId: string) => {
    const link = document.createElement('a');
    link.href = photoData;
    link.download = `evidencia-yape-${saleId}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-2xl font-bold text-yellow-500">Ventas Procesadas</h1>
          <div className="w-20" />
        </div>

        {sales.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No hay ventas registradas</p>
            <button
              onClick={() => onNavigate('sale')}
              className="mt-4 text-yellow-500 hover:text-yellow-400"
            >
              Ir a Vender
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sales
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((sale) => {
                const isEditing = editingSale === sale.id;
                const saleData = isEditing && editedSale ? editedSale : sale;

                return (
                  <div
                    key={sale.id}
                    className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">
                          {formatDate(sale.timestamp)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              sale.paymentMethod === 'yape'
                                ? 'bg-purple-600 text-white'
                                : 'bg-green-600 text-white'
                            }`}
                          >
                            {sale.paymentMethod === 'yape' ? 'Yape' : 'Efectivo'}
                          </span>
                          <span className="text-2xl font-bold text-yellow-500">
                            S/ {sale.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => handleEdit(sale)}
                          className="p-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      {sale.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm bg-gray-800/50 rounded-lg p-2"
                        >
                          <span className="text-gray-300">
                            {item.name} x{item.quantity}
                          </span>
                          <span className="text-yellow-400">
                            S/ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {sale.paymentMethod === 'yape' && (
                      <div className="mb-4 p-3 bg-purple-900/30 border border-purple-600 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Número Yape:</div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedSale?.yapePhoneNumber || yapePhoneNumber}
                            onChange={(e) =>
                              setEditedSale((prev) => ({
                                ...prev,
                                yapePhoneNumber: e.target.value,
                              }))
                            }
                            className="w-full bg-black border-2 border-purple-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                          />
                        ) : (
                          <div className="text-purple-400 font-semibold">
                            {sale.yapePhoneNumber || yapePhoneNumber}
                          </div>
                        )}
                      </div>
                    )}

                    {sale.paymentMethod === 'efectivo' && (
                      <div className="mb-4 text-sm">
                        <div className="flex justify-between text-gray-400 mb-1">
                          <span>Pagado:</span>
                          <span className="text-white">S/ {sale.amountPaid.toFixed(2)}</span>
                        </div>
                        {sale.change > 0 && (
                          <div className="flex justify-between text-gray-400">
                            <span>Caja:</span>
                            <span className="text-green-400">
                              S/ {sale.change.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {(sale.evidencePhoto || (isEditing && editedSale?.evidencePhoto)) && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-400">Evidencia de Pago:</div>
                          {!isEditing && sale.evidencePhoto && (
                            <button
                              onClick={() => handleDownloadPhoto(sale.evidencePhoto!, sale.id)}
                              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-500 transition-colors text-sm"
                            >
                              <Download className="w-4 h-4" />
                              Descargar
                            </button>
                          )}
                        </div>
                        {isEditing ? (
                          <div>
                            <input
                              ref={(el) => {
                                if (el) fileInputRefs[sale.id] = el;
                              }}
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={(e) => handleFileChange(sale.id, e)}
                              className="hidden"
                            />
                            <input
                              ref={(el) => {
                                if (el) uploadInputRefs[sale.id] = el;
                              }}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(sale.id, e)}
                              className="hidden"
                            />
                            <div className="flex gap-2 mb-2">
                              <button
                                type="button"
                                onClick={() => handleTakePhoto(sale.id)}
                                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors"
                              >
                                <Camera className="w-4 h-4" />
                                Tomar Foto
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUploadPhoto(sale.id)}
                                className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                <Upload className="w-4 h-4" />
                                Subir Foto
                              </button>
                            </div>
                            {editedSale?.evidencePhoto && (
                              <div className="relative">
                                <img
                                  src={editedSale.evidencePhoto}
                                  alt="Evidencia"
                                  className="w-full rounded-lg border-2 border-yellow-600 max-h-64 object-contain bg-black"
                                />
                                <button
                                  onClick={() => handleDownloadPhoto(editedSale.evidencePhoto!, sale.id)}
                                  className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative">
                            <img
                              src={sale.evidencePhoto}
                              alt="Evidencia de pago"
                              className="w-full rounded-lg border-2 border-yellow-600 max-h-64 object-contain bg-black"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex gap-2 pt-4 border-t border-gray-800">
                        <button
                          onClick={handleCancel}
                          className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSave(sale.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-2 rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-300"
                        >
                          <Save className="w-4 h-4" />
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}



