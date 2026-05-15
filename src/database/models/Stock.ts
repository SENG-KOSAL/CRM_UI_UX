import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Stock extends Model {
  static table = 'stock';

  @field('product_id') productId!: string;
  @field('product_name') productName!: string;
  @field('product_code') productCode!: string;
  @field('opening_stock') openingStock!: number;
  @field('current_stock') currentStock!: number;
  @field('unit') unit!: string;
  @field('price') price!: number;
  @field('user_id') userId!: string;
  @field('bu_id') buId!: string;
  @field('aws_id') awsId!: string;
  @field('date') date!: string;
  @field('updated_at') updatedAt!: number;
}
