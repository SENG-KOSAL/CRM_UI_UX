import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { watermelonSchema, STOCK_TABLE } from './watermelonSchema';
import Stock from './models/Stock';

const adapter = new SQLiteAdapter({
  dbName: 'crm_sfa_stock',
  schema: watermelonSchema,
  jsi: false,
});

export const wdb = new Database({
  adapter,
  modelClasses: [Stock],
});

export { STOCK_TABLE };
