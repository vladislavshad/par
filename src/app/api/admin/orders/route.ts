import { NextResponse, NextRequest } from "next/server";
import { ensureOrdersTable, getOrders, getOrderStats, getOrderCount } from "@/lib/db";

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return token === password;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureOrdersTable();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = 20;
    const offset = (page - 1) * limit;

    const [orders, totalCount, stats] = await Promise.all([
      getOrders(limit, offset),
      getOrderCount(),
      getOrderStats(),
    ]);

    return NextResponse.json({
      orders,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      stats,
    });
  } catch (err) {
    console.error("Admin orders error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
