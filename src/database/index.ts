import { TABLES } from './schema';

const store: Record<string, Map<string, any>> = {};

function ensureTable(name: string): Map<string, any> {
  if (!store[name]) store[name] = new Map();
  return store[name];
}

export const db = {
  async getAll(tableName: string): Promise<any[]> {
    return Array.from(ensureTable(tableName).values());
  },

  async getById(tableName: string, id: string): Promise<any | null> {
    return ensureTable(tableName).get(id) ?? null;
  },

  async query(tableName: string, predicate: (item: any) => boolean): Promise<any[]> {
    return (await this.getAll(tableName)).filter(predicate);
  },

  async insert(tableName: string, item: any): Promise<void> {
    const id = item.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    ensureTable(tableName).set(id, { ...item, id });
  },

  async insertMany(tableName: string, items: any[]): Promise<void> {
    for (const item of items) await this.insert(tableName, item);
  },

  async update(tableName: string, id: string, updates: any): Promise<void> {
    const table = ensureTable(tableName);
    const existing = table.get(id);
    if (existing) table.set(id, { ...existing, ...updates });
  },

  async delete(tableName: string, id: string): Promise<void> {
    ensureTable(tableName).delete(id);
  },

  async clear(tableName: string): Promise<void> {
    ensureTable(tableName).clear();
  },

  async clearAll(): Promise<void> {
    for (const key of Object.keys(store)) store[key].clear();
  },
};

export { TABLES };
