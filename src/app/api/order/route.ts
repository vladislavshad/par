import { NextResponse } from "next/server";
import { sendTelegramMessage, formatOrderForTelegram } from "@/lib/telegram";

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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
