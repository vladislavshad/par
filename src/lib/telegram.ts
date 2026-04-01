export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram credentials not configured");
    return false;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });

  return res.ok;
}

export function formatOrderForTelegram(order: {
  contactName: string;
  contactPhone: string;
  contactMethod: string;
  items: {
    name: string;
    material: string;
    color: string;
    size?: string;
    variant?: string;
    trimColor?: string;
    engraving?: string;
    engravingColor?: string;
    engravingType?: string;
    engravingPosition?: string;
    price: number;
  }[];
  packaging: string;
  giftCardText?: string;
  total: number;
}): string {
  let msg = `🔔 <b>НОВЫЙ ЗАКАЗ — ПАРЪ</b>\n\n`;
  msg += `👤 <b>Клиент:</b> ${order.contactName}\n`;
  msg += `📱 <b>Телефон:</b> ${order.contactPhone}\n`;
  msg += `💬 <b>Связь:</b> ${order.contactMethod === "telegram" ? "Telegram" : "WhatsApp"}\n\n`;
  msg += `📦 <b>Состав заказа:</b>\n`;

  for (const item of order.items) {
    msg += `\n• <b>${item.name}</b> — ${item.price.toLocaleString("ru-RU")} ₽\n`;
    msg += `  Материал: ${item.material}\n`;
    msg += `  Цвет: ${item.color}\n`;
    if (item.variant) msg += `  Форма: ${item.variant}\n`;
    if (item.size) msg += `  Размер: ${item.size}\n`;
    if (item.trimColor) msg += `  Кант: ${item.trimColor}\n`;
    if (item.engraving || item.engravingType === "Логотип ПАРЪ") {
      msg += `  Вышивка: ${item.engravingType === "Логотип ПАРЪ" ? "Логотип ПАРЪ" : `«${item.engraving}»`}\n`;
      if (item.engravingType) msg += `  Тип: ${item.engravingType}\n`;
      if (item.engravingColor) msg += `  Цвет нити: ${item.engravingColor}\n`;
      if (item.engravingPosition) msg += `  Расположение: ${item.engravingPosition}\n`;
    }
  }

  msg += `\n🎁 <b>Упаковка:</b> ${order.packaging}\n`;
  if (order.giftCardText) {
    msg += `✉️ <b>Открытка:</b> «${order.giftCardText}»\n`;
  }
  msg += `\n💰 <b>ИТОГО: ${order.total.toLocaleString("ru-RU")} ₽</b>`;

  return msg;
}

export function buildWhatsAppLink(phone: string, text: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}
