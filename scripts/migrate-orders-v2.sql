-- ============================================================
-- Migración: soporte de pagos Mercado Pago en pedidos
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Agregar columnas a orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_phone      TEXT,
  ADD COLUMN IF NOT EXISTS payment_link        TEXT,
  ADD COLUMN IF NOT EXISTS mercadopago_preference_id TEXT,
  ADD COLUMN IF NOT EXISTS mercadopago_payment_id    TEXT,
  ADD COLUMN IF NOT EXISTS external_reference  TEXT,
  ADD COLUMN IF NOT EXISTS payment_status      TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS whatsapp_sent_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_link_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at          TIMESTAMPTZ DEFAULT NOW();

-- Índice único para idempotencia en webhook (evita procesar el mismo pago dos veces)
CREATE UNIQUE INDEX IF NOT EXISTS orders_mp_payment_id_idx
  ON orders (mercadopago_payment_id)
  WHERE mercadopago_payment_id IS NOT NULL;

-- 2. Tabla order_items
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id     UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   UUID        REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT        NOT NULL,
  quantity     INTEGER     NOT NULL CHECK (quantity > 0),
  unit_price   INTEGER     NOT NULL CHECK (unit_price >= 0),
  subtotal     INTEGER     NOT NULL CHECK (subtotal >= 0),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own order items" ON order_items
  FOR ALL USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );
