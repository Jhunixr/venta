import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Sale, StoreState, CartItem } from '../types/types';

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  initialCash: number;
  yapePhoneNumber: string;
  yapeQRCode?: string;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  updateInitialCash: (amount: number) => void;
  updateYapePhoneNumber: (phoneNumber: string) => void;
  updateYapeQRCode: (qrCode: string) => void;
  resetData: () => void;
  getTotalCash: () => number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY = 'inventario-eventos-data';

const initialState: StoreState = {
  products: [],
  sales: [],
  initialCash: 0,
  yapePhoneNumber: '943177720',
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialState;
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      initialStock: product.stock,
    };
    setState((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  };

  const deleteProduct = (id: string) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  };

  const addSale = (sale: Omit<Sale, 'id' | 'timestamp'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setState((prev) => {
      const updatedProducts = prev.products.map((product) => {
        const soldItem = sale.items.find((item) => item.productId === product.id);
        if (soldItem) {
          return {
            ...product,
            stock: product.stock - soldItem.quantity,
          };
        }
        return product;
      });

      return {
        ...prev,
        products: updatedProducts,
        sales: [...prev.sales, newSale],
      };
    });
  };

  const updateSale = (id: string, updates: Partial<Sale>) => {
    setState((prev) => ({
      ...prev,
      sales: prev.sales.map((sale) =>
        sale.id === id ? { ...sale, ...updates } : sale
      ),
    }));
  };

  const updateInitialCash = (amount: number) => {
    setState((prev) => ({
      ...prev,
      initialCash: amount,
    }));
  };

  const updateYapePhoneNumber = (phoneNumber: string) => {
    setState((prev) => ({
      ...prev,
      yapePhoneNumber: phoneNumber,
    }));
  };

  const updateYapeQRCode = (qrCode: string) => {
    setState((prev) => ({
      ...prev,
      yapeQRCode: qrCode,
    }));
  };

  const resetData = () => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getTotalCash = () => {
    const totalSales = state.sales.reduce((sum, sale) => sum + sale.total, 0);
    return state.initialCash + totalSales;
  };

  return (
    <StoreContext.Provider
      value={{
        products: state.products,
        sales: state.sales,
        initialCash: state.initialCash,
        yapePhoneNumber: state.yapePhoneNumber,
        yapeQRCode: state.yapeQRCode,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        updateSale,
        updateInitialCash,
        updateYapePhoneNumber,
        updateYapeQRCode,
        resetData,
        getTotalCash,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
