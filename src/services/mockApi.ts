import { db, TABLES } from '../database';
import type {
  UserSchema, BusinessUnitSchema, AWSSchema, OutletSchema,
  RouteSchema, SaleSchema, StockSchema, ProgramSchema, SaleItemSchema, ProductSchema,
} from '../database/schema';
import { MOCK_DELAY } from '../constants';
import { wdb, STOCK_TABLE } from '../database/watermelon';
import { Q } from '@nozbe/watermelondb';
import Stock from '../database/models/Stock';

const delay = (ms: number = MOCK_DELAY) => new Promise((r) => setTimeout(r, ms));

function parseItems(sale: SaleSchema): SaleSchema {
  if (typeof sale.items === 'string') {
    try { sale.items = JSON.parse(sale.items); } catch {}
  }
  return sale;
}

function stockRecordToSchema(record: Stock): StockSchema {
  return {
    id: record.id,
    productId: record.productId,
    productName: record.productName,
    productCode: record.productCode,
    openingStock: record.openingStock,
    currentStock: record.currentStock,
    unit: record.unit,
    price: record.price,
    userId: record.userId,
    buId: record.buId,
    awsId: record.awsId,
    date: record.date,
    updatedAt: new Date(record.updatedAt).toISOString(),
  };
}

export const mockApi = {
  auth: {
    login: async (username: string, password: string): Promise<UserSchema> => {
      await delay();
      if (!username || !username.trim()) throw new Error('Invalidkk credentials');
      const users = await db.query(TABLES.USERS, (u) => u.username === username);
      if (users.length === 0) throw new Error('Invalidnnn credentials');
      const user = users[0] as any;
      // If the user record has a stored password, validate the provided one.
      // If no password is stored (e.g. old seed), skip validation so login still works.
      if (user.password && user.password !== password) throw new Error('Invalid credentials');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...publicUser } = user;
      return publicUser as UserSchema;
    },
  },

  businessUnits: {
    getAll: async (): Promise<BusinessUnitSchema[]> => {
      await delay();
      return db.getAll(TABLES.BUSINESS_UNITS);
    },
  },

  aws: {
    getByBU: async (buId: string): Promise<AWSSchema[]> => {
      await delay();
      return db.query(TABLES.AWS, (a) => a.buId === buId && a.isActive);
    },
  },

  outlets: {
    getByBU: async (buId: string): Promise<OutletSchema[]> => {
      await delay();
      if (!buId) return db.getAll(TABLES.OUTLETS);
      return db.query(TABLES.OUTLETS, (o) => o.buId === buId && o.isActive);
    },
    getById: async (id: string): Promise<OutletSchema | null> => {
      await delay(400);
      return db.getById(TABLES.OUTLETS, id);
    },
  },

  routes: {
    getByUserAndDate: async (userId: string, date: string): Promise<RouteSchema[]> => {
      await delay();
      return db.query(
        TABLES.ROUTES,
        (r) => r.userId === userId && r.date === date
      );
    },
    updateStatus: async (routeId: string, status: RouteSchema['status']): Promise<void> => {
      await delay(300);
      await db.update(TABLES.ROUTES, routeId, { status });
    },
  },

  stock: {
    getByUser: async (userId: string, buId: string, awsId: string): Promise<StockSchema[]> => {
      const records = await wdb.get<Stock>(STOCK_TABLE).query(
        Q.and(
          Q.where('user_id', userId),
          Q.where('bu_id', buId),
          Q.where('aws_id', awsId),
        )
      ).fetch();
      return records.map(stockRecordToSchema);
    },
    getAll: async (): Promise<StockSchema[]> => {
      const records = await wdb.get<Stock>(STOCK_TABLE).query().fetch();
      return records.map(stockRecordToSchema);
    },
    reduceStock: async (productId: string, quantity: number, userId: string, buId: string, awsId: string): Promise<void> => {
      await wdb.write(async () => {
        const items = await wdb.get<Stock>(STOCK_TABLE).query(
          Q.and(
            Q.where('product_id', productId),
            Q.where('user_id', userId),
            Q.where('bu_id', buId),
            Q.where('aws_id', awsId),
          )
        ).fetch();
         if (items.length > 0) {
           await items[0].update((record) => {
             record.currentStock -= quantity;
             record.updated_at = Date.now();
           });
         }
      });
    },
    getProductCatalog: async (): Promise<ProductSchema[]> => {
      return db.getAll(TABLES.CATALOG);
    },
    saveOpeningStock: async (
      userId: string, buId: string, awsId: string,
      entries: { productId: string; productName: string; productCode: string; unit: string; price: number; quantity: number }[]
    ): Promise<void> => {
      const today = new Date().toISOString().split('T')[0];
      await wdb.write(async () => {
        for (const entry of entries) {
          if (entry.quantity <= 0) continue;
          const existing = await wdb.get<Stock>(STOCK_TABLE).query(
            Q.and(
              Q.where('product_id', entry.productId),
              Q.where('user_id', userId),
              Q.where('bu_id', buId),
              Q.where('aws_id', awsId),
            )
          ).fetch();
           if (existing.length > 0) {
             const record = existing[0];
             await record.update((r) => {
               r.openingStock += entry.quantity;
               r.currentStock += entry.quantity;
               r.updated_at = Date.now();
             });
           } else {
             await wdb.get<Stock>(STOCK_TABLE).create((r) => {
               r.productId = entry.productId;
               r.productName = entry.productName;
               r.productCode = entry.productCode;
               r.openingStock = entry.quantity;
               r.currentStock = entry.quantity;
               r.unit = entry.unit;
               r.price = entry.price;
               r.userId = userId;
               r.buId = buId;
               r.awsId = awsId;
               r.date = today;
               r.updated_at = Date.now();
             });
           }
        }
      });
    },
  },

  sales: {
    create: async (sale: Omit<SaleSchema, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<SaleSchema> => {
      await delay(600);
      const allSales = await db.getAll(TABLES.SALES);
      const count = allSales.length + 1;
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const newSale: SaleSchema = {
        ...sale,
        items: typeof sale.items === 'string' ? sale.items : JSON.stringify(sale.items),
        id: `sal_${Date.now()}`,
        code: `INV/${dateStr}/${String(count).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.insert(TABLES.SALES, newSale);
      const result = { ...newSale };
      try { result.items = JSON.parse(result.items as string); } catch {}
      return result;
    },
    getByRoute: async (routeId: string): Promise<SaleSchema[]> => {
      await delay();
      const sales = await db.query(TABLES.SALES, (s) => s.routeId === routeId);
      return sales.map(parseItems);
    },
    getByOutlet: async (outletId: string): Promise<SaleSchema[]> => {
      await delay();
      const sales = await db.query(TABLES.SALES, (s) => s.outletId === outletId);
      return sales.map(parseItems);
    },
    getAll: async (): Promise<SaleSchema[]> => {
      await delay();
      const sales = await db.getAll(TABLES.SALES);
      return sales.map(parseItems);
    },
  },

  programs: {
    getByOutlet: async (outletId: string, buId: string): Promise<ProgramSchema[]> => {
      await delay(400);
      if (!outletId) return [];
      return db.query(
        TABLES.PROGRAMS,
        (p) => p.outletId === outletId && p.buId === buId && p.isActive
      );
    },
  },

  dashboard: {
    getStats: async (userId: string, buId: string) => {
      await delay(600);
      const allSales = await db.getAll(TABLES.SALES);
      const sales = allSales.filter((s: SaleSchema) => s.userId === userId && s.buId === buId);
      const routes = await db.query(TABLES.ROUTES, (r) => r.userId === userId && r.buId === buId);
      const stockRecords = await wdb.get<Stock>(STOCK_TABLE).query(
        Q.and(Q.where('user_id', userId), Q.where('bu_id', buId))
      ).fetch();
      const stock = stockRecords.map(stockRecordToSchema);
      const outlets = await db.query(TABLES.OUTLETS, (o) => o.buId === buId);

      const totalSales = sales.reduce((sum: number, s: SaleSchema) => sum + s.total, 0);
      const todayStr = new Date().toISOString().split('T')[0];
      const todaySales = sales.filter((s: SaleSchema) => s.createdAt.startsWith(todayStr));
      const totalToday = todaySales.reduce((sum: number, s: SaleSchema) => sum + s.total, 0);
      const totalOutlets = outlets.length;
      const visitedOutlets = new Set(sales.map((s: SaleSchema) => s.outletId)).size;
      const totalStockValue = stock.reduce((sum: number, s: StockSchema) => sum + s.currentStock * s.price, 0);

      return {
        totalSales,
        totalToday,
        salesCount: sales.length,
        todaySalesCount: todaySales.length,
        totalOutlets,
        visitedOutlets,
        remainingOutlets: totalOutlets - visitedOutlets,
        totalStockValue,
        routeProgress: routes.filter((r) => r.status === 'completed').length / Math.max(routes.length, 1),
        activeRoutes: routes.filter((r) => r.status === 'in_progress').length,
        pendingRoutes: routes.filter((r) => r.status === 'pending').length,
      };
    },
  },
};
