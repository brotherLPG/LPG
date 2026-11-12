const SALE_PROFIT_PER_KG = 15;
const KG_EPSILON = 0.0001;

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function roundRate(value) {
  return Math.round((Number(value) + Number.EPSILON) * 10000) / 10000;
}

export function replayGasCost(events) {
  const sorted = [...events].sort((a, b) => {
    const ta = new Date(a.at).getTime() || 0;
    const tb = new Date(b.at).getTime() || 0;
    if (ta !== tb) return ta - tb;
    if (a.kind !== b.kind) return a.kind === "in" ? -1 : 1;
    const ca = new Date(a.createdAt).getTime() || 0;
    const cb = new Date(b.createdAt).getTime() || 0;
    return ca - cb;
  });

  let kg = 0;
  let value = 0;
  let lastAverage = 0;
  let lastEventAt = null;

  for (const event of sorted) {
    const qty = Number(event.kg) || 0;
    if (qty <= 0) continue;

    if (event.kind === "in") {
      value += qty * (Number(event.rate) || 0);
      kg += qty;
      if (kg > KG_EPSILON) {
        lastAverage = value / kg;
        lastEventAt = event.at || null;
      }
    } else {
      const take = Math.min(qty, kg);
      if (take > 0 && kg > 0) {
        value -= (value / kg) * take;
        kg -= take;
        lastEventAt = event.at || lastEventAt;
        if (kg > KG_EPSILON) lastAverage = value / kg;
      }
    }

    if (kg <= KG_EPSILON) {
      kg = 0;
      value = 0;
    }
  }

  const hasStock = kg > KG_EPSILON;
  return {
    averageCostPerKg: roundRate(hasStock ? value / kg : lastAverage),
    stockKg: hasStock ? roundMoney(kg) : 0,
    stockValueAmount: hasStock ? roundMoney(value) : 0,
    lastEventAt: lastEventAt || null,
  };
}

function tankKey(value) {
  if (!value) return "default";
  if (typeof value === "object") return String(value._id || value.id || "default");
  return String(value);
}

export function buildGasRate(receipts, batches, profitPerKg = SALE_PROFIT_PER_KG) {
  const groups = new Map();
  const bucket = (id) => {
    const key = tankKey(id);
    if (!groups.has(key)) groups.set(key, []);
    return groups.get(key);
  };

  for (const receipt of receipts || []) {
    if (String(receipt.receiptStatus || "confirmed") === "pending") continue;
    const kg = Number(receipt.receivedQuantityKg) || 0;
    if (kg <= 0) continue;
    bucket(receipt.storageTankId).push({
      at: receipt.receivedAt,
      createdAt: receipt.createdAt,
      kind: "in",
      kg,
      rate: Number(receipt.purchaseRatePerKg) || 0,
    });
  }

  for (const batch of batches || []) {
    if (String(batch.batchStatus || "completed") === "pending") continue;
    const kg = Number(batch.actualLpgUsedKg) || 0;
    if (kg <= 0) continue;
    bucket(batch.storageTankId).push({
      at: batch.fillingDate,
      createdAt: batch.createdAt,
      kind: "out",
      kg,
    });
  }

  let stockKg = 0;
  let stockValue = 0;
  let fallbackRate = 0;
  let fallbackAt = 0;

  for (const events of groups.values()) {
    const cost = replayGasCost(events);
    if (cost.stockKg > 0 && cost.averageCostPerKg > 0) {
      stockKg += cost.stockKg;
      stockValue += cost.stockKg * cost.averageCostPerKg;
    }
    const at = new Date(cost.lastEventAt || 0).getTime();
    if (cost.averageCostPerKg > 0 && at >= fallbackAt) {
      fallbackAt = at;
      fallbackRate = cost.averageCostPerKg;
    }
  }

  const profit = Number(profitPerKg);
  const profitRate = Number.isFinite(profit) && profit >= 0 ? profit : SALE_PROFIT_PER_KG;
  const averageCostPerKg = stockKg > 0 ? roundRate(stockValue / stockKg) : roundRate(fallbackRate);

  return {
    averageCostPerKg,
    profitPerKg: profitRate,
    profitableRatePerKg: roundRate(averageCostPerKg + profitRate),
    stockKg: roundMoney(stockKg),
  };
}

export { SALE_PROFIT_PER_KG };
