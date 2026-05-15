export interface UserSchema {
  id: string;
  username: string;
  // Optional password field used only by the mock database for demo purposes.
  password?: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessUnitSchema {
  id: string;
  name: string;
  code: string;
  region: string;
  isActive: boolean;
}

export interface AWSSchema {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  buId: string;
}

export interface OutletSchema {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  region: string;
  type: string;
  tier: string;
  latitude: number;
  longitude: number;
  contactName: string;
  contactPhone: string;
  isActive: boolean;
  buId: string;
}

export interface RouteSchema {
  id: string;
  code: string;
  name: string;
  date: string;
  outletIds: string[];
  status: 'pending' | 'in_progress' | 'completed';
  userId: string;
  buId: string;
  awsId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleSchema {
  id: string;
  code: string;
  outletId: string;
  userId: string;
  routeId: string;
  buId: string;
  awsId: string;
  items: string | SaleItemSchema[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: 'draft' | 'completed' | 'cancelled';
  visitStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItemSchema {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StockSchema {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  openingStock: number;
  currentStock: number;
  unit: string;
  price: number;
  userId: string;
  buId: string;
  awsId: string;
  date: string;
  updatedAt: string;
}

export interface SettlementSchema {
  id: string;
  code: string;
  userId: string;
  buId: string;
  awsId: string;
  totalSales: number;
  totalCollections: number;
  totalExpenses: number;
  cashInHand: number;
  bankDeposits: number;
  outstanding: number;
  status: 'pending' | 'completed';
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSchema {
  id: string;
  productName: string;
  productCode: string;
  unit: string;
  price: number;
  productIcon: string;
}

export interface ProgramSchema {
  id: string;
  code: string;
  name: string;
  description: string;
  type: string;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  buId: string;
  outletId: string;
}

export const TABLES = {
  USERS: 'users',
  BUSINESS_UNITS: 'business_units',
  AWS: 'aws',
  OUTLETS: 'outlets',
  ROUTES: 'routes',
  SALES: 'sales',
  STOCK: 'stock',
  SETTLEMENTS: 'settlements',
  PROGRAMS: 'programs',
  CATALOG: 'catalog',
} as const;
