const IR_METALS_DEMO_PRICES = [
  { symbol: "CU", name: "Copper", price: 9850, unit: "USD / metric ton", change: 1.18, updatedAt: "Demo data" },
  { symbol: "AL", name: "Aluminum", price: 2575, unit: "USD / metric ton", change: -0.42, updatedAt: "Demo data" },
  { symbol: "BR", name: "Brass", price: 6120, unit: "USD / metric ton", change: 0.36, updatedAt: "Demo data" },
  { symbol: "SS", name: "Stainless Steel", price: 1420, unit: "USD / metric ton", change: 0.14, updatedAt: "Demo data" },
  { symbol: "NI", name: "Nickel", price: 18400, unit: "USD / metric ton", change: 2.05, updatedAt: "Demo data" },
  { symbol: "PB", name: "Lead", price: 2180, unit: "USD / metric ton", change: -0.28, updatedAt: "Demo data" },
  { symbol: "FE", name: "Iron & Steel", price: 420, unit: "USD / metric ton", change: 0.08, updatedAt: "Demo data" }
];

const IR_METALS_PRICE_CACHE_KEY = "ir-metals-price-cache-v1";
const IR_METALS_PRICE_CACHE_TTL_MS = 8 * 60 * 60 * 1000;

const METALPRICE_API_SYMBOLS = {
  XAU: { symbol: "XAU", name: "Gold", unit: "USD / troy ounce" },
  XAG: { symbol: "XAG", name: "Silver", unit: "USD / troy ounce" },
  XPT: { symbol: "XPT", name: "Platinum", unit: "USD / troy ounce" },
  XPD: { symbol: "XPD", name: "Palladium", unit: "USD / troy ounce" },
  XCU: { symbol: "XCU", name: "Copper", unit: "USD / market unit" },
  ALU: { symbol: "ALU", name: "Aluminum", unit: "USD / market unit" },
  NI: { symbol: "NI", name: "Nickel", unit: "USD / market unit" },
  PB: { symbol: "PB", name: "Lead", unit: "USD / market unit" },
  ZNC: { symbol: "ZNC", name: "Zinc", unit: "USD / market unit" },
  IRON: { symbol: "IRON", name: "Iron Ore", unit: "USD / market unit" }
};

function normalizeMetalPricePayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.prices)) return payload.prices;
  if (Array.isArray(payload?.metals)) return payload.metals;

  if (payload?.rates && typeof payload.rates === "object") {
    return Object.entries(payload.rates).map(([symbol, price]) => ({
      ...(METALPRICE_API_SYMBOLS[symbol] || { symbol, name: symbol }),
      price: Number(price) > 0 && payload.base === "USD" ? 1 / Number(price) : price,
      unit: payload.unit || METALPRICE_API_SYMBOLS[symbol]?.unit || `${payload.base || "USD"} / market unit`,
      change: payload.changes?.[symbol] || 0,
      updatedAt: payload.date || payload.timestamp || "Live API"
    })).filter(item => METALPRICE_API_SYMBOLS[item.symbol]);
  }

  return [];
}

function readCachedMetalPrices() {
  try {
    const raw = window.localStorage.getItem(IR_METALS_PRICE_CACHE_KEY);
    if (!raw) return null;

    const cached = JSON.parse(raw);
    if (!cached?.savedAt || !Array.isArray(cached?.prices)) return null;

    const age = Date.now() - Number(cached.savedAt);
    if (age > IR_METALS_PRICE_CACHE_TTL_MS) return { ...cached, expired: true };

    return {
      ...cached,
      source: cached.source === "demo" ? "demo" : "cached-live",
      expired: false
    };
  } catch {
    return null;
  }
}

function writeCachedMetalPrices(data) {
  try {
    window.localStorage.setItem(IR_METALS_PRICE_CACHE_KEY, JSON.stringify({
      ...data,
      savedAt: Date.now()
    }));
  } catch {
    // Storage can be unavailable in private browsing; live fetch still works.
  }
}

async function fetchMetalPrices() {
  const apiUrl = window.IR_METALS_PRICE_API_URL || "";

  if (!apiUrl) {
    return {
      source: "demo",
      updatedAt: "Demo data",
      prices: IR_METALS_DEMO_PRICES
    };
  }

  const cached = readCachedMetalPrices();
  if (cached && !cached.expired) {
    return cached;
  }

  const response = await fetch(apiUrl, {
    headers: { Accept: "application/json" },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Price API returned ${response.status}`);
  }

  const payload = await response.json();
  const prices = normalizeMetalPricePayload(payload);

  if (!prices.length) {
    throw new Error("Price API response did not include recognizable metal prices");
  }

  const data = {
    source: payload.source || "live",
    updatedAt: payload.updatedAt || payload.date || new Date().toISOString(),
    prices
  };

  writeCachedMetalPrices(data);
  return data;
}
