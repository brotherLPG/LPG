function sameKg(a, b) {
  return Math.abs(Number(a) - Number(b)) < 0.001;
}

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
  const category = String(item?.cylinderCategory || "").toLowerCase();
  if (category) return `filled:${category}`;
  const kg = itemCapacityKg(item);
  if (sameKg(kg, 11.8) || sameKg(kg, 15)) return "filled:domestic";
  if (sameKg(kg, 35) || sameKg(kg, 45.4)) return "filled:commercial";
  return kg > 0 ? "filled" : "";
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
 * Filled domestic (11.8, 15) and filled commercial (35, 45.4) stay on
 * separate rates. Every empty cylinder shares one rate, separate from filled.
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
