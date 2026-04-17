# Feature: Pago MP por pedido

## Estado: DESACTIVADO (guardado para activar después)

## Archivos implementados
- `supabase/functions/mp-create-order-payment/index.ts` — crea preferencia de pago en MP
- `supabase/functions/mp-order-webhook/index.ts` — webhook que actualiza pedido a "pagado"
- `scripts/migrate-orders-v2.sql` — ya ejecutado en producción

## Columnas agregadas a orders (ya en BD)
- customer_phone, payment_link, mercadopago_preference_id, mercadopago_payment_id
- external_reference, payment_status, whatsapp_sent_at, payment_link_generated_at, updated_at

## Tabla creada
- order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)

## Pendiente para reactivar
- Cada usuario debe poder pegar su propio MP_ACCESS_TOKEN en su perfil
- La edge function mp-create-order-payment debe leer el token del perfil del usuario (profiles.mp_access_token)
  en lugar de Deno.env.get('MP_ACCESS_TOKEN')
- Agregar campo mp_access_token a tabla profiles
- Agregar UI en Profile.jsx para que el usuario configure su token MP

## Para reactivar en AppContext.jsx
Agregar de vuelta:
1. generateOrderPaymentLink() — llama a mp-create-order-payment con fetch
2. markOrderWhatsAppSent() — actualiza whatsapp_sent_at
3. Exportarlos en el context value

## Para reactivar en Orders.jsx
1. En handleCreateAndWhatsApp: llamar generatePaymentLink y agregar link al mensaje
2. En OrderCard: mostrar pill "Ver link de pago" si order.paymentLink existe
3. Importar ExternalLink de lucide-react
