"use client";

import { useState, useEffect, useCallback } from "react";

type OrderItem = {
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
};

type Order = {
  id: number;
  contact_name: string;
  contact_phone: string;
  contact_method: string;
  items: OrderItem[];
  packaging: string | null;
  gift_card_text: string | null;
  total: number;
  status: string;
  notes: string;
  created_at: string;
};

type Stats = {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  totalRevenue: number;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Новый", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  in_progress: { label: "В работе", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  completed: { label: "Выполнен", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  cancelled: { label: "Отменён", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const token = typeof window !== "undefined" ? sessionStorage.getItem("admin_token") : null;

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setPassword(saved);
      setIsAuthed(true);
    }
  }, []);

  const fetchOrders = useCallback(async (page: number) => {
    const tok = sessionStorage.getItem("admin_token");
    if (!tok) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${page}`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.status === 401) {
        setIsAuthed(false);
        sessionStorage.removeItem("admin_token");
        return;
      }
      const data = await res.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setStats(data.stats);
    } catch {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthed) fetchOrders(currentPage);
  }, [isAuthed, currentPage, fetchOrders]);

  const handleLogin = async () => {
    setAuthError("");
    try {
      const res = await fetch("/api/admin/orders?page=1", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.status === 401) {
        setAuthError("Неверный пароль");
        return;
      }
      sessionStorage.setItem("admin_token", password);
      setIsAuthed(true);
      const data = await res.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setStats(data.stats);
    } catch {
      setAuthError("Ошибка соединения");
    }
  };

  const updateStatus = async (orderId: number, status: string) => {
    const tok = sessionStorage.getItem("admin_token");
    if (!tok) return;
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tok}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchOrders(currentPage);
    } catch {
      console.error("Failed to update status");
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-bg-secondary border border-white/10 p-8">
          <h1 className="text-2xl font-serif font-bold text-center mb-2">ПАРЪ</h1>
          <p className="text-text-muted text-sm text-center mb-6">Панель управления</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Пароль"
            className="w-full bg-bg-primary border border-white/10 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none mb-4"
          />
          {authError && <p className="text-red-400 text-sm mb-4">{authError}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-gold hover:bg-gold-light text-bg-primary py-3 font-medium tracking-wide transition-colors"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold">ПАРЪ <span className="text-text-muted font-sans text-sm font-normal ml-2">Панель управления</span></h1>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_token");
              setIsAuthed(false);
            }}
            className="text-text-muted text-sm hover:text-text-primary transition-colors"
          >
            Выйти
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-bg-secondary border border-white/10 p-5">
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Всего заказов</p>
              <p className="text-2xl font-serif font-bold">{stats.total}</p>
            </div>
            <div className="bg-bg-secondary border border-blue-500/20 p-5">
              <p className="text-blue-400 text-xs uppercase tracking-wider mb-1">Новые</p>
              <p className="text-2xl font-serif font-bold text-blue-400">{stats.new}</p>
            </div>
            <div className="bg-bg-secondary border border-yellow-500/20 p-5">
              <p className="text-yellow-400 text-xs uppercase tracking-wider mb-1">В работе</p>
              <p className="text-2xl font-serif font-bold text-yellow-400">{stats.inProgress}</p>
            </div>
            <div className="bg-bg-secondary border border-green-500/20 p-5">
              <p className="text-green-400 text-xs uppercase tracking-wider mb-1">Выручка</p>
              <p className="text-2xl font-serif font-bold text-green-400">
                {stats.totalRevenue.toLocaleString("ru-RU")} ₽
              </p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "all", label: "Все" },
            { key: "new", label: "Новые" },
            { key: "in_progress", label: "В работе" },
            { key: "completed", label: "Выполнены" },
            { key: "cancelled", label: "Отменены" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`px-4 py-2 text-sm border transition-colors ${
                filterStatus === f.key
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-white/10 text-text-muted hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => fetchOrders(currentPage)}
            className="ml-auto px-4 py-2 text-sm border border-white/10 text-text-muted hover:border-white/20 transition-colors"
          >
            Обновить
          </button>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-16 text-text-muted">Загрузка...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-text-muted">Заказов пока нет</div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const statusInfo = STATUS_LABELS[order.status] ?? STATUS_LABELS.new;
              const items = Array.isArray(order.items) ? order.items as OrderItem[] : [];

              return (
                <div key={order.id} className="bg-bg-secondary border border-white/10">
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-4 flex items-center gap-4 text-left"
                  >
                    <div className="text-text-muted text-sm font-mono">#{order.id}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{order.contact_name}</div>
                      <div className="text-text-muted text-sm">{order.contact_phone}</div>
                    </div>
                    <div className="text-sm text-text-muted hidden sm:block">
                      {items.length} {items.length === 1 ? "предмет" : items.length < 5 ? "предмета" : "предметов"}
                    </div>
                    <span className={`px-3 py-1 text-xs border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <div className="text-gold font-serif font-bold">
                      {order.total.toLocaleString("ru-RU")} ₽
                    </div>
                    <div className="text-text-muted text-xs hidden sm:block" style={{ minWidth: "80px" }}>
                      {new Date(order.created_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <svg
                      className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-5 border-t border-white/5 pt-4 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm text-text-secondary font-medium mb-2">Контакт</h4>
                          <div className="text-sm space-y-1">
                            <p>{order.contact_name}</p>
                            <p>
                              <a href={`tel:${order.contact_phone}`} className="text-gold hover:underline">
                                {order.contact_phone}
                              </a>
                            </p>
                            <p className="text-text-muted">
                              {order.contact_method === "telegram" ? "Telegram" : "WhatsApp"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm text-text-secondary font-medium mb-2">Статус</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(STATUS_LABELS).map(([key, info]) => (
                              <button
                                key={key}
                                onClick={() => updateStatus(order.id, key)}
                                className={`px-3 py-1.5 text-xs border transition-colors ${
                                  order.status === key
                                    ? info.color
                                    : "border-white/10 text-text-muted hover:border-white/20"
                                }`}
                              >
                                {info.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm text-text-secondary font-medium mb-2">Состав заказа</h4>
                        <div className="space-y-2">
                          {items.map((item, i) => (
                            <div key={i} className="bg-bg-primary border border-white/5 p-3 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gold">{item.price.toLocaleString("ru-RU")} ₽</span>
                              </div>
                              <div className="text-text-muted text-xs mt-1 space-y-0.5">
                                <p>Материал: {item.material} &middot; Цвет: {item.color}</p>
                                {item.variant && <p>Форма: {item.variant}</p>}
                                {item.size && <p>Размер: {item.size}</p>}
                                {item.trimColor && <p>Кант: {item.trimColor}</p>}
                                {item.engraving && (
                                  <p>
                                    Вышивка: «{item.engraving}»
                                    {item.engravingType && ` · ${item.engravingType}`}
                                    {item.engravingColor && ` · ${item.engravingColor}`}
                                    {item.engravingPosition && ` · ${item.engravingPosition}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.packaging && (
                        <p className="text-sm text-text-muted">Упаковка: {order.packaging}</p>
                      )}
                      {order.gift_card_text && (
                        <p className="text-sm text-text-muted italic">Открытка: «{order.gift_card_text}»</p>
                      )}

                      <div className="text-sm text-text-muted">
                        Создан:{" "}
                        {new Date(order.created_at).toLocaleString("ru-RU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 text-sm border transition-colors ${
                  currentPage === page
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/10 text-text-muted hover:border-white/20"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
