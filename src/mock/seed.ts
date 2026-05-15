import { db, TABLES } from '../database';
import type {
  UserSchema, BusinessUnitSchema, AWSSchema, OutletSchema,
  RouteSchema, SaleSchema, StockSchema, SettlementSchema, ProgramSchema, ProductSchema,
} from '../database/schema';

const today = new Date().toISOString().split('T')[0];

// NOTE: These demo users include plain-text passwords for the mock API only.
// Passwords are not stored in app session objects (we strip them on login).
const users: any[] = [
  { id: 'usr_001', username: 'sara.wijaya', password: 'password', name: 'Sara Wijaya', email: 'sara@example.com', role: 'Sales Rep', avatarUrl: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'usr_002', username: 'budi.hartono', password: 'password', name: 'Budi Hartono', email: 'budi@example.com', role: 'Sales Rep', avatarUrl: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  // Added demo user requested by developer
  { id: 'usr_003', username: 'DSR', password: 'dsr123', name: 'DSR', email: 'dsr@example.com', role: 'Sales Rep', avatarUrl: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const businessUnits: BusinessUnitSchema[] = [
  { id: 'bu_001', name: 'Jakarta Pusat', code: 'JKT-PST', region: 'Jakarta', isActive: true },
  { id: 'bu_002', name: 'Jakarta Selatan', code: 'JKT-SEL', region: 'Jakarta', isActive: true },
  { id: 'bu_003', name: 'Bandung', code: 'BDG', region: 'West Java', isActive: true },
  { id: 'bu_004', name: 'Surabaya', code: 'SBY', region: 'East Java', isActive: true },
];

const awsList: AWSSchema[] = [
  { id: 'aws_001', code: 'AWS/2026/05/I', name: 'AWS Period I - May 2026', startDate: '2026-05-01', endDate: '2026-05-10', isActive: true, buId: 'bu_001' },
  { id: 'aws_002', code: 'AWS/2026/05/II', name: 'AWS Period II - May 2026', startDate: '2026-05-11', endDate: '2026-05-20', isActive: true, buId: 'bu_001' },
  { id: 'aws_003', code: 'AWS/2026/05/III', name: 'AWS Period III - May 2026', startDate: '2026-05-21', endDate: '2026-05-31', isActive: true, buId: 'bu_001' },
  { id: 'aws_004', code: 'AWS/2026/05/I', name: 'AWS Period I - May 2026', startDate: '2026-05-01', endDate: '2026-05-10', isActive: true, buId: 'bu_002' },
  { id: 'aws_005', code: 'AWS/2026/05/I', name: 'AWS Period I - May 2026', startDate: '2026-05-01', endDate: '2026-05-10', isActive: true, buId: 'bu_003' },
];

const outlets: OutletSchema[] = [
  { id: 'out_001', code: 'TKM-001', name: 'Toko Kelontong Makmur', address: 'Jl. Merdeka No. 10', city: 'Jakarta Pusat', region: 'Jakarta', type: 'Toko Kelontong', tier: 'A', latitude: -6.1751, longitude: 106.8275, contactName: 'Pak Agus', contactPhone: '08123456789', isActive: true, buId: 'bu_001' },
  { id: 'out_002', code: 'TKM-002', name: 'Toko Sinar Jaya', address: 'Jl. Thamrin No. 25', city: 'Jakarta Pusat', region: 'Jakarta', type: 'Toko Kelontong', tier: 'B', latitude: -6.1851, longitude: 106.8375, contactName: 'Bu Dewi', contactPhone: '08123456790', isActive: true, buId: 'bu_001' },
  { id: 'out_003', code: 'MIN-001', name: 'Minimarket Sejahtera', address: 'Jl. Sudirman No. 50', city: 'Jakarta Pusat', region: 'Jakarta', type: 'Minimarket', tier: 'A', latitude: -6.1951, longitude: 106.8475, contactName: 'Pak Bambang', contactPhone: '08123456791', isActive: true, buId: 'bu_001' },
  { id: 'out_004', code: 'GRO-001', name: 'Grosir Barokah', address: 'Jl. Gatot Subroto No. 80', city: 'Jakarta Pusat', region: 'Jakarta', type: 'Grosir', tier: 'A', latitude: -6.2051, longitude: 106.8575, contactName: 'Pak Hadi', contactPhone: '08123456792', isActive: true, buId: 'bu_001' },
  { id: 'out_005', code: 'TKM-003', name: 'Toko Berkah Jaya', address: 'Jl. Kramat Raya No. 15', city: 'Jakarta Pusat', region: 'Jakarta', type: 'Toko Kelontong', tier: 'C', latitude: -6.1651, longitude: 106.8175, contactName: 'Bu Sari', contactPhone: '08123456793', isActive: true, buId: 'bu_001' },
  { id: 'out_006', code: 'MIN-002', name: 'Minimarket Keluarga', address: 'Jl. Pramuka No. 30', city: 'Jakarta Pusat', region: 'Jakarta', type: 'Minimarket', tier: 'B', latitude: -6.2151, longitude: 106.8675, contactName: 'Pak Dodi', contactPhone: '08123456794', isActive: true, buId: 'bu_001' },
  { id: 'out_007', code: 'KOP-001', name: 'Koperasi Karyawan Sejahtera', address: 'Jl. Kuningan No. 45', city: 'Jakarta Pusat', region: 'Jakarta', type: 'Koperasi', tier: 'A', latitude: -6.2251, longitude: 106.8775, contactName: 'Bu Rina', contactPhone: '08123456795', isActive: true, buId: 'bu_001' },
  { id: 'out_008', code: 'TKM-004', name: 'Toko Maju Bersama', address: 'Jl. Matraman No. 20', city: 'Jakarta Pusat', region: 'Jakarta', type: 'Toko Kelontong', tier: 'B', latitude: -6.2351, longitude: 106.8875, contactName: 'Pak Eko', contactPhone: '08123456796', isActive: true, buId: 'bu_001' },
];

const routes: RouteSchema[] = [
  {
    id: 'rte_001', code: 'RTE/JKT-PST/001', name: 'Route 1 - Jakarta Pusat',
    date: today, outletIds: ['out_001', 'out_002', 'out_003', 'out_004'],
    status: 'in_progress', userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'rte_002', code: 'RTE/JKT-PST/002', name: 'Route 2 - Jakarta Pusat',
    date: today, outletIds: ['out_005', 'out_006', 'out_007', 'out_008'],
    status: 'pending', userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'rte_003', code: 'RTE/JKT-PST/003', name: 'Route 3 - Jakarta Pusat',
    date: today, outletIds: ['out_001', 'out_003', 'out_005'],
    status: 'pending', userId: 'usr_003', buId: 'bu_001', awsId: 'aws_001',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

const programs: ProgramSchema[] = [
  { id: 'prg_001', code: 'PRG/DISC/10', name: 'Diskon 10% Brand A', description: 'Diskon 10% untuk semua produk Brand A', type: 'discount', discountType: 'percentage', discountValue: 10, minPurchase: 50000, maxDiscount: 50000, startDate: '2026-05-01', endDate: '2026-05-31', isActive: true, buId: 'bu_001', outletId: 'out_001' },
  { id: 'prg_002', code: 'PRG/BUY/1+1', name: 'Beli 1 Gratis 1', description: 'Beli 1 produk Brand B gratis 1', type: 'promo', discountType: 'product', discountValue: 100, minPurchase: 100000, maxDiscount: 100000, startDate: '2026-05-01', endDate: '2026-05-31', isActive: true, buId: 'bu_001', outletId: 'out_001' },
  { id: 'prg_003', code: 'PRG/DISC/15', name: 'Diskon 15% Brand C', description: 'Diskon spesial 15% Brand C', type: 'discount', discountType: 'percentage', discountValue: 15, minPurchase: 75000, maxDiscount: 75000, startDate: '2026-05-01', endDate: '2026-05-31', isActive: true, buId: 'bu_001', outletId: 'out_002' },
  { id: 'prg_004', code: 'PRG/CASH/20', name: 'Cashback 20rb', description: 'Cashback Rp 20.000 untuk pembelian Brand D', type: 'cashback', discountType: 'fixed', discountValue: 20000, minPurchase: 150000, maxDiscount: 20000, startDate: '2026-05-01', endDate: '2026-05-31', isActive: true, buId: 'bu_001', outletId: 'out_003' },
  { id: 'prg_005', code: 'PRG/DISC/5', name: 'Diskon 5% All Items', description: 'Diskon 5% semua item', type: 'discount', discountType: 'percentage', discountValue: 5, minPurchase: 0, maxDiscount: 25000, startDate: '2026-05-01', endDate: '2026-05-31', isActive: true, buId: 'bu_001', outletId: 'out_004' },
];

const catalog: ProductSchema[] = [
  { id: 'prd_001', productName: 'Beras Premium 5kg', productCode: 'BRG-001', unit: 'pcs', price: 75000, productIcon: '🍚' },
  { id: 'prd_002', productName: 'Minyak Goreng 2L', productCode: 'BRG-002', unit: 'pcs', price: 45000, productIcon: '🛢️' },
  { id: 'prd_003', productName: 'Gula Pasir 1kg', productCode: 'BRG-003', unit: 'pcs', price: 18000, productIcon: '🍬' },
  { id: 'prd_004', productName: 'Kopi Bubuk 200g', productCode: 'BRG-004', unit: 'pcs', price: 32000, productIcon: '☕' },
  { id: 'prd_005', productName: 'Mie Instan (Karton)', productCode: 'BRG-007', unit: 'dus', price: 120000, productIcon: '🍜' },
  { id: 'prd_006', productName: 'Sabun Mandi Cair', productCode: 'BRG-009', unit: 'pcs', price: 25000, productIcon: '🧴' },
];

const stockItems: StockSchema[] = [
  { id: 'stk_001', productId: 'prd_001', productName: 'Beras Premium 5kg', productCode: 'BRG-001', openingStock: 100, currentStock: 85, unit: 'pcs', price: 75000, userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_002', productId: 'prd_002', productName: 'Minyak Goreng 2L', productCode: 'BRG-002', openingStock: 100, currentStock: 72, unit: 'pcs', price: 45000, userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_003', productId: 'prd_003', productName: 'Gula Pasir 1kg', productCode: 'BRG-003', openingStock: 100, currentStock: 90, unit: 'pcs', price: 18000, userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_004', productId: 'prd_004', productName: 'Kopi Bubuk 200g', productCode: 'BRG-004', openingStock: 80, currentStock: 65, unit: 'pcs', price: 32000, userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_005', productId: 'prd_005', productName: 'Teh Celup 50s', productCode: 'BRG-005', openingStock: 60, currentStock: 48, unit: 'pcs', price: 15000, userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_006', productId: 'prd_006', productName: 'Susu Kental Manis', productCode: 'BRG-006', openingStock: 120, currentStock: 95, unit: 'pcs', price: 12000, userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_007', productId: 'prd_007', productName: 'Mie Instan (Karton)', productCode: 'BRG-007', openingStock: 50, currentStock: 42, unit: 'dus', price: 120000, userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_008', productId: 'prd_008', productName: 'Air Mineral 1.5L', productCode: 'BRG-008', openingStock: 200, currentStock: 156, unit: 'pcs', price: 7000, userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_009', productId: 'prd_009', productName: 'Sabun Mandi Cair', productCode: 'BRG-009', openingStock: 70, currentStock: 58, unit: 'pcs', price: 25000, userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_010', productId: 'prd_010', productName: 'Shampo Sachet (Karton)', productCode: 'BRG-010', openingStock: 30, currentStock: 24, unit: 'dus', price: 200000, userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  // DSR stock
  { id: 'stk_011', productId: 'prd_001', productName: 'Beras Premium 5kg', productCode: 'BRG-001', openingStock: 50, currentStock: 42, unit: 'pcs', price: 75000, userId: 'usr_003', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_012', productId: 'prd_002', productName: 'Minyak Goreng 2L', productCode: 'BRG-002', openingStock: 50, currentStock: 38, unit: 'pcs', price: 45000, userId: 'usr_003', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_013', productId: 'prd_003', productName: 'Gula Pasir 1kg', productCode: 'BRG-003', openingStock: 50, currentStock: 45, unit: 'pcs', price: 18000, userId: 'usr_003', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_014', productId: 'prd_004', productName: 'Kopi Bubuk 200g', productCode: 'BRG-004', openingStock: 40, currentStock: 32, unit: 'pcs', price: 32000, userId: 'usr_003', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
  { id: 'stk_015', productId: 'prd_005', productName: 'Teh Celup 50s', productCode: 'BRG-005', openingStock: 30, currentStock: 24, unit: 'pcs', price: 15000, userId: 'usr_003', buId: 'bu_001', awsId: 'aws_001', date: today, updatedAt: new Date().toISOString() },
];

const sales: SaleSchema[] = [
  {
    id: 'sal_001', code: 'INV/2026/05/001', outletId: 'out_001', userId: 'usr_001',
    routeId: 'rte_001', buId: 'bu_001', awsId: 'aws_001',
    items: JSON.stringify([
      { productId: 'prd_001', productName: 'Beras Premium 5kg', quantity: 5, unitPrice: 75000, totalPrice: 375000 },
      { productId: 'prd_002', productName: 'Minyak Goreng 2L', quantity: 3, unitPrice: 45000, totalPrice: 135000 },
    ]),
    subtotal: 510000, discount: 51000, tax: 0, total: 459000,
    paymentMethod: 'cash', status: 'completed', visitStatus: 'sale_completed',
    createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'sal_002', code: 'INV/2026/05/002', outletId: 'out_002', userId: 'usr_001',
    routeId: 'rte_001', buId: 'bu_001', awsId: 'aws_001',
    items: JSON.stringify([
      { productId: 'prd_003', productName: 'Gula Pasir 1kg', quantity: 10, unitPrice: 18000, totalPrice: 180000 },
      { productId: 'prd_004', productName: 'Kopi Bubuk 200g', quantity: 5, unitPrice: 32000, totalPrice: 160000 },
    ]),
    subtotal: 340000, discount: 0, tax: 0, total: 340000,
    paymentMethod: 'transfer', status: 'completed', visitStatus: 'sale_completed',
    createdAt: new Date(Date.now() - 7200000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'sal_003', code: 'INV/2026/05/003', outletId: 'out_003', userId: 'usr_001',
    routeId: 'rte_001', buId: 'bu_001', awsId: 'aws_001',
    items: JSON.stringify([
      { productId: 'prd_006', productName: 'Susu Kental Manis', quantity: 12, unitPrice: 12000, totalPrice: 144000 },
      { productId: 'prd_008', productName: 'Air Mineral 1.5L', quantity: 24, unitPrice: 7000, totalPrice: 168000 },
    ]),
    subtotal: 312000, discount: 15000, tax: 0, total: 297000,
    paymentMethod: 'qris', status: 'completed', visitStatus: 'sale_completed',
    createdAt: new Date(Date.now() - 1800000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'sal_004', code: 'INV/2026/05/004', outletId: 'out_001', userId: 'usr_003',
    routeId: 'rte_003', buId: 'bu_001', awsId: 'aws_001',
    items: JSON.stringify([
      { productId: 'prd_001', productName: 'Beras Premium 5kg', quantity: 2, unitPrice: 75000, totalPrice: 150000 },
    ]),
    subtotal: 150000, discount: 15000, tax: 0, total: 135000,
    paymentMethod: 'cash', status: 'completed', visitStatus: 'sale_completed',
    createdAt: new Date(Date.now() - 3000000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'sal_005', code: 'INV/2026/05/005', outletId: 'out_003', userId: 'usr_003',
    routeId: 'rte_003', buId: 'bu_001', awsId: 'aws_001',
    items: JSON.stringify([
      { productId: 'prd_002', productName: 'Minyak Goreng 2L', quantity: 4, unitPrice: 45000, totalPrice: 180000 },
      { productId: 'prd_005', productName: 'Teh Celup 50s', quantity: 6, unitPrice: 15000, totalPrice: 90000 },
    ]),
    subtotal: 270000, discount: 0, tax: 0, total: 270000,
    paymentMethod: 'transfer', status: 'completed', visitStatus: 'sale_completed',
    createdAt: new Date(Date.now() - 600000).toISOString(), updatedAt: new Date().toISOString(),
  },
];

const settlements: SettlementSchema[] = [
  {
    id: 'stl_001', code: 'STL/2026/05/001', userId: 'usr_001', buId: 'bu_001', awsId: 'aws_001',
    totalSales: 1096000, totalCollections: 459000, totalExpenses: 50000,
    cashInHand: 409000, bankDeposits: 340000, outstanding: 0,
    status: 'completed', date: today,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'stl_002', code: 'STL/2026/05/002', userId: 'usr_003', buId: 'bu_001', awsId: 'aws_001',
    totalSales: 405000, totalCollections: 135000, totalExpenses: 20000,
    cashInHand: 115000, bankDeposits: 270000, outstanding: 0,
    status: 'completed', date: today,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

export async function seedDatabase(): Promise<void> {
  await db.clearAll();
  await db.insertMany(TABLES.USERS, users);
  console.log(`[seed] Inserted ${users.length} users`);
  await db.insertMany(TABLES.BUSINESS_UNITS, businessUnits);
  await db.insertMany(TABLES.AWS, awsList);
  await db.insertMany(TABLES.OUTLETS, outlets);
  await db.insertMany(TABLES.ROUTES, routes);
  await db.insertMany(TABLES.PROGRAMS, programs);
  await db.insertMany(TABLES.CATALOG, catalog);
  await db.insertMany(TABLES.STOCK, stockItems);
  await db.insertMany(TABLES.SALES, sales);
  await db.insertMany(TABLES.SETTLEMENTS, settlements);

  // WatermelonDB stock intentionally empty — user adds via OpenStockScreen
}
