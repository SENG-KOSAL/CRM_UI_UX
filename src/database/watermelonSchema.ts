import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const STOCK_TABLE = 'stock';

export const watermelonSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: STOCK_TABLE,
      columns: [
        { name: 'product_id', type: 'string' },
        { name: 'product_name', type: 'string' },
        { name: 'product_code', type: 'string' },
        { name: 'opening_stock', type: 'number' },
        { name: 'current_stock', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'bu_id', type: 'string', isIndexed: true },
        { name: 'aws_id', type: 'string', isIndexed: true },
        { name: 'date', type: 'string' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
