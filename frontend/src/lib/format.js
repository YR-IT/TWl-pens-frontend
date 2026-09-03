export function money(n) {
  const v = typeof n === "number" ? n : parseFloat(n || 0);
  return `$${v.toFixed(2)}`;
}
