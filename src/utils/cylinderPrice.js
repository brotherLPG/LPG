export function itemCapacityKg(item) {
  const fromField = Number(item?.capacityKg);
  if (fromField > 0) return fromField;
  const match = String(item?.itemName || "").match(/(\d+(?:\.\d+)?)\s*kg/i);
  return match ? Number(match[1]) : 0;
}

export function isFilledCylinder(item) {
  const category = String(item?.itemCategory || "").toLowerCase();
  if (category === "filled-cylinder") return true;
  if (category === "empty-cylinder") return false;
  return String(item?.itemName || "").trim().toLowerCase().startsWith("filled");
}

export function isEmptyCylinder(item) {
  const category = String(item?.itemCategory || "").toLowerCase();
  if (category === "empty-cylinder") return true;
  if (category === "filled-cylinder") return false;
  return String(item?.itemName || "").trim().toLowerCase().startsWith("empty");
}

function priceGroup(item) {
  if (isEmptyCylinder(item)) return "empty";
  if (!isFilledCylinder(item)) return "";
  return itemCapacityKg(item) > 0 ? "filled" : "";
}

function findInventoryItem(inventoryItems, productId) {
  if (!productId) return null;
  return (
    inventoryItems.find((item) => String(item._id || item.id) === String(productId)) ||
    null
  );
}

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function suggestedCylinderPrices(item, gasRate) {
  if (!item || !isFilledCylinder(item)) return null;
  const kg = itemCapacityKg(item);
  const cost = Number(gasRate?.averageCostPerKg);
  if (!(kg > 0) || !(cost > 0)) return null;

  const profitPerKg = Number(gasRate?.profitPerKg);
  const profitableRate = Number(gasRate?.profitableRatePerKg);
  const rate = profitableRate > 0
    ? profitableRate
    : cost + (Number.isFinite(profitPerKg) && profitPerKg > 0 ? profitPerKg : 0);

  return {
    kg,
    averageCostPerKg: cost,
    profitPerKg: Number.isFinite(profitPerKg) ? profitPerKg : roundMoney(rate - cost),
    exact: roundMoney(kg * cost),
    profitable: roundMoney(kg * rate),
  };
}

export function salePriceTip({ unitPrice, discount, quantity, exact, profitable }) {
  const price = Number(unitPrice);
  const cost = Number(exact);
  const target = Number(profitable);
  if (!(price > 0) || !(cost > 0)) return null;

  const qty = Number(quantity) || 0;
  const disc = Number(discount) || 0;
  const net = roundMoney(price - (qty > 0 ? disc / qty : 0));
  const loss = roundMoney(cost - net);
  if (loss > 0.009) {
    return {
      level: "loss",
      message: `Below purchase cost. Loss about Rs ${loss.toFixed(2)} on each cylinder.`,
    };
  }

  const gap = roundMoney(target - net);
  const aboveCost = roundMoney(net - cost);
  if (target > cost && aboveCost > 0.009 && gap > 0.009) {
    return {
      level: "thin",
      message: `Thin profit. Rs ${gap.toFixed(2)} under the profitable price.`,
    };
  }

  return null;
}

export function linkedUnitPrice(sourcePrice, sourceKg, targetKg) {
  const price = Number(sourcePrice);
  const from = Number(sourceKg);
  const to = Number(targetKg);
  if (!(price > 0) || !(from > 0) || !(to > 0)) return null;
  return roundMoney((price / from) * to);
}

function withRowTotals(item, calculateRow) {
  const computed = calculateRow(item);
  return {
    ...item,
    total: computed.total,
    rowSubtotal: computed.subtotal,
  };
}

/**
 * The first cylinder in a price group sets the rate per kg.
 * Later cylinders in that group get unit price = rate × their kg.
 * Every filled size (11.8, 15, 35, 45.4) shares one rate.
 * Every empty cylinder shares one rate, separate from filled.
 * A later line keeps a hand-typed price until the source price changes,
 * or until that line's item is selected again.
 * mode "price": the user edited a unit price.
 * mode "product": the user picked an item.
 */
export function applyFilledCylinderPrices(
  lineItems,
  inventoryItems,
  changedId,
  calculateRow,
  mode = "price"
) {
  const metas = lineItems.map((line) => {
    const inv = findInventoryItem(inventoryItems, line.product);
    const group = inv ? priceGroup(inv) : "";
    return {
      line,
      linked: Boolean(group),
      kg: group ? itemCapacityKg(inv) : 0,
      group,
    };
  });

  const changedIndex = metas.findIndex((meta) => meta.line.id === changedId);
  if (changedIndex < 0) return lineItems;

  const changed = metas[changedIndex];
  if (!changed.linked || !changed.group || !(changed.kg > 0)) return lineItems;

  const sourceIndex = metas.findIndex(
    (meta) => meta.linked && meta.group === changed.group && meta.kg > 0
  );
  if (sourceIndex < 0) return lineItems;

  const source = metas[sourceIndex];
  const sourcePrice = Number(source.line.unitPrice);
  if (!(sourcePrice > 0)) return lineItems;

  const rewriteAllLater = changedIndex === sourceIndex;
  const rewriteChangedOnly = mode === "product" && changedIndex !== sourceIndex;

  return lineItems.map((line, index) => {
    if (index === sourceIndex) return line;
    const meta = metas[index];
    if (!meta.linked || meta.group !== source.group || !(meta.kg > 0)) return line;
    const shouldUpdate = rewriteAllLater || (rewriteChangedOnly && index === changedIndex);
    if (!shouldUpdate) return line;
    const unitPrice = linkedUnitPrice(sourcePrice, source.kg, meta.kg);
    if (unitPrice == null) return line;
    return withRowTotals({ ...line, unitPrice }, calculateRow);
  });
}
