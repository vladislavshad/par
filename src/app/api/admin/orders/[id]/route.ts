import { NextResponse, NextRequest } from "next/server";
import { ensureOrdersTable, updateOrderStatus } from "@/lib/db";

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return token === password;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureOrdersTable();
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    if (!status) {
      return NextResponse.json({ error: "Status required" }, { status: 400 });
    }

    const validStatuses = ["new", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await updateOrderStatus(parseInt(id, 10), status, notes);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
