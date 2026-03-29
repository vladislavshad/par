import { NextResponse } from "next/server";
import { sendTelegramMessage, formatOrderForTelegram } from "@/lib/telegram";
import { ensureOrdersTable, insertOrder } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { contactName, contactPhone, contactMethod, items, packaging, giftCardText, total } =
      body;

    if (!contactName || !contactPhone || !items?.length) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 }
      );
    }

    let orderId: number | null = null;
    try {
      await ensureOrdersTable();
      orderId = await insertOrder({
        contactName,
        contactPhone,
        contactMethod,
        items,
        packaging,
        giftCardText,
        total,
      });
    } catch (dbErr) {
      console.error("DB save failed (will still send to Telegram):", dbErr);
    }

    const message = formatOrderForTelegram({
      contactName,
      contactPhone,
      contactMethod,
      items,
      packaging,
      giftCardText,
      total,
    });

    const sent = await sendTelegramMessage(message);

    if (!sent) {
      console.log("Telegram not configured, logging order instead:");
      console.log(message);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
