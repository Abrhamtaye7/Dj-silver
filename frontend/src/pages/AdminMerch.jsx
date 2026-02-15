import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";

const TOKEN_KEY = "dj_admin_token";
const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "cancelled"];

function AdminMerch() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const authedApi = useMemo(() => {
    return {
      get: (url) => api.get(url, { headers: { Authorization: `Bearer ${token}` } }),
      patch: (url, data) =>
        api.patch(url, data, { headers: { Authorization: `Bearer ${token}` } }),
    };
  }, [token]);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setStatusMessage("");
    try {
      const response = await authedApi.get("/api/admin/merch/orders");
      setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
    } catch (error) {
      setStatusMessage(error.response?.data?.message || "Could not load orders");
    } finally {
      setLoading(false);
    }
  }, [authedApi, token]);

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token, loadOrders]);

  const handleLogin = async () => {
    setAuthMessage("");
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const nextToken = response.data.token || "";
      if (!nextToken) {
        setAuthMessage("No token returned.");
        return;
      }
      localStorage.setItem(TOKEN_KEY, nextToken);
      setToken(nextToken);
      setPassword("");
      setAuthMessage("Login successful.");
    } catch (error) {
      setAuthMessage(error.response?.data?.message || "Login failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setOrders([]);
    setStatusMessage("");
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await authedApi.patch(`/api/admin/merch/orders/${orderId}/status`, {
        status,
      });
      const updated = response.data.order;
      setOrders((prev) =>
        prev.map((order) => (order._id === updated._id ? updated : order))
      );
      setStatusMessage(`Order ${updated._id.slice(-6)} updated to ${updated.status}.`);
    } catch (error) {
      setStatusMessage(error.response?.data?.message || "Could not update order status");
    }
  };

  if (!token) {
    return (
      <div className="full-bleed flex flex-col gap-6">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold glow-text">Merch Orders</h1>
        </header>

        <section className="glass-card neon-border max-w-lg rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Admin Login</p>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-4 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm"
            placeholder="Admin email"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="mt-3 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm"
            placeholder="Admin password"
          />
          <button
            onClick={handleLogin}
            className="mt-4 rounded-full border border-cyan-400 bg-cyan-400/10 px-5 py-2 text-xs uppercase tracking-[0.25em] text-cyan-100"
          >
            Login
          </button>
          {authMessage && <p className="mt-3 text-xs text-slate-300">{authMessage}</p>}
        </section>
      </div>
    );
  }

  return (
    <div className="full-bleed flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold glow-text">Merch Orders</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadOrders}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="rounded-full border border-rose-400/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-rose-200"
          >
            Logout
          </button>
        </div>
      </header>

      {statusMessage && (
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-100">
          {statusMessage}
        </div>
      )}

      <section className="grid gap-4">
        {loading ? (
          <div className="text-sm text-slate-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="glass-card rounded-2xl border border-white/10 p-4 text-sm text-slate-400">
            No orders yet.
          </div>
        ) : (
          orders.map((order) => (
            <article key={order._id} className="glass-card rounded-2xl border border-white/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{order.itemName}</p>
                  <p className="text-xs text-slate-400">
                    {order.customerName} • {order.email}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Qty {order.quantity} • Size {order.size} • ${(
                      order.unitPrice * order.quantity
                    ).toFixed(2)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{order.address}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100">
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(event) => updateOrderStatus(order._id, event.target.value)}
                    className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-xs"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default AdminMerch;
