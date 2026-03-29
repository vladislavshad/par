import { sql } from "@vercel/postgres";

export async function ensureOrdersTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      contact_name TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      contact_method TEXT NOT NULL DEFAULT 'telegram',
      items JSONB NOT NULL,
      packaging TEXT,
      gift_card_text TEXT,
      total INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
}

export type OrderRow = {
  id: number;
  contact_name: string;
  contact_phone: string;
  contact_method: string;
  items: unknown;
  packaging: string | null;
  gift_card_text: string | null;
  total: number;
  status: string;
  notes: string;
  created_at: string;
};

export async function insertOrder(order: {
  contactName: string;
  contactPhone: string;
  contactMethod: string;
  items: unknown;
  packaging: string;
  giftCardText?: string;
  total: number;
}): Promise<number> {
  const result = await sql`
    INSERT INTO orders (contact_name, contact_phone, contact_method, items, packaging, gift_card_text, total)
    VALUES (${order.contactName}, ${order.contactPhone}, ${order.contactMethod}, ${JSON.stringify(order.items)}, ${order.packaging}, ${order.giftCardText ?? null}, ${order.total})
    RETURNING id
  `;
  return result.rows[0].id;
}

export async function getOrders(limit = 50, offset = 0): Promise<OrderRow[]> {
  const result = await sql`
    SELECT * FROM orders ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
  `;
  return result.rows as OrderRow[];
}

export async function getOrderCount(): Promise<number> {
  const result = await sql`SELECT COUNT(*) as count FROM orders`;
  return parseInt(result.rows[0].count, 10);
}

export async function updateOrderStatus(id: number, status: string, notes?: string): Promise<void> {
  if (notes !== undefined) {
    await sql`UPDATE orders SET status = ${status}, notes = ${notes} WHERE id = ${id}`;
  } else {
    await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
  }
}

export async function getOrderStats(): Promise<{
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  totalRevenue: number;
}> {
  const result = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'new') as new_count,
      COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COALESCE(SUM(total), 0) as total_revenue
    FROM orders
  `;
  const row = result.rows[0];
  return {
    total: parseInt(row.total, 10),
    new: parseInt(row.new_count, 10),
    inProgress: parseInt(row.in_progress, 10),
    completed: parseInt(row.completed, 10),
    totalRevenue: parseInt(row.total_revenue, 10),
  };
}
