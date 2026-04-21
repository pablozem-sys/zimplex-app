export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  const result = await Notification.requestPermission()
  return result
}

export function sendStockAlert(productName, currentStock) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  new Notification('⚠️ Stock bajo — Zimplex', {
    body: `${productName} tiene solo ${currentStock} unidades restantes`,
    icon: '/favicon.svg',
  })
}
