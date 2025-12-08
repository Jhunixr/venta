import { useState, useRef } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, DollarSign, Camera, Upload, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CartItem } from '../types/types';
import { Page } from '../types/types';

interface SaleProps {
  onNavigate: (page: Page) => void;
}

export default function Sale({ onNavigate }: SaleProps) {
  const { products, addSale } = useStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'yape'>('efectivo');
  const [amountPaid, setAmountPaid] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const YAPE_PHONE = '930608660';

  const availableProducts = products.filter((p) => p.stock > 0);

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock === 0) return;

    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) return;
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId,
          quantity: 1,
          name: product.name,
          price: product.price,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.productId === productId) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return null;
            if (newQuantity > product.stock) return item;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getChange = () => {
    if (paymentMethod === 'yape') return 0;
    const paid = parseFloat(amountPaid) || getTotal();
    return Math.max(0, paid - getTotal());
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    const total = getTotal();
    const paid = paymentMethod === 'yape' ? total : (parseFloat(amountPaid) || total);
    const change = getChange();

    if (paymentMethod === 'efectivo' && paid < total) {
      alert('El monto pagado es menor al total');
      return;
    }

    addSale({
      items: cart,
      total,
      paymentMethod,
      amountPaid: paid,
      change,
      yapePhoneNumber: paymentMethod === 'yape' ? YAPE_PHONE : undefined,
      evidencePhoto: evidencePhoto || undefined,
    });

    setCart([]);
    setShowPayment(false);
    setAmountPaid('');
    setEvidencePhoto(null);
    alert('Venta registrada exitosamente');
  };

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setEvidencePhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const total = getTotal();

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-2xl font-bold text-yellow-500">Vender</h1>
          <div className="w-20" />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-300 mb-3">
            Productos Disponibles
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {availableProducts.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No hay productos disponibles
              </div>
            ) : (
              availableProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product.id)}
                  className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-600 rounded-xl p-4 hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-300 active:scale-95"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-white mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-500 font-bold text-lg">
                        S/ {product.price.toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        x{product.stock}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-300 mb-3">
              Carrito de Compra
            </h2>
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/50 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white flex-1">
                      {item.name}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 transition-colors active:scale-90"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-bold text-yellow-500 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 transition-colors active:scale-90"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-yellow-500 font-bold text-lg">
                      S/ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent border-t border-yellow-600">
          <div className="max-w-4xl mx-auto px-4 py-4">
            {!showPayment ? (
              <>
                <div className="flex items-center justify-between mb-4 text-2xl font-bold">
                  <span className="text-gray-300">Total:</span>
                  <span className="text-yellow-500">
                    S/ {total.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-lg py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-lg active:scale-95"
                >
                  <DollarSign className="w-6 h-6" />
                  Procesar Pago
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      paymentMethod === 'efectivo'
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Efectivo
                  </button>
                  <button
                    onClick={() => {
                      setPaymentMethod('yape');
                      setAmountPaid('');
                      setEvidencePhoto(null);
                    }}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      paymentMethod === 'yape'
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Yape
                  </button>
                </div>

                {paymentMethod === 'efectivo' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Monto Recibido (S/) - Opcional
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder={`${total.toFixed(2)} (pago exacto)`}
                      className="w-full bg-black border-2 border-yellow-600 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                    {amountPaid && parseFloat(amountPaid) >= total && (
                      <div className="mt-2 text-right">
                        <span className="text-gray-400">Vuelto: </span>
                        <span className="text-yellow-500 font-bold text-xl">
                          S/ {getChange().toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'yape' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-2 border-purple-600 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Número de Yape para Transferir
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-purple-400">
                          {YAPE_PHONE}
                        </span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(YAPE_PHONE)}
                          className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-500 transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Transfiere el monto de S/ {total.toFixed(2)} a este número
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Evidencia de Pago (Foto)
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {evidencePhoto ? (
                        <div className="relative">
                          <img
                            src={evidencePhoto}
                            alt="Evidencia de pago"
                            className="w-full rounded-xl border-2 border-yellow-600 max-h-64 object-contain bg-black"
                          />
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleTakePhoto}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all duration-300"
                          >
                            <Camera className="w-5 h-5" />
                            Tomar Foto
                          </button>
                          <button
                            type="button"
                            onClick={handleTakePhoto}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-700 transition-colors"
                          >
                            <Upload className="w-5 h-5" />
                            Subir Foto
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPayment(false);
                      setAmountPaid('');
                      setEvidencePhoto(null);
                    }}
                    className="flex-1 bg-gray-800 text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCompleteSale}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3 rounded-xl hover:from-green-500 hover:to-green-400 transition-all duration-300 shadow-lg active:scale-95"
                  >
                    Confirmar Venta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
