export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  initialStock: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'efectivo' | 'yape';
  amountPaid: number;
  change: number;
  timestamp: number;
  yapePhoneNumber?: string;
  evidencePhoto?: string;
}

export interface StoreState {
  products: Product[];
  sales: Sale[];
  initialCash: number;
  yapePhoneNumber: string;
}

export type Page = 'home' | 'inventory' | 'sale' | 'settings' | 'report' | 'sales';
