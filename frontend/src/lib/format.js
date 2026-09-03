export function money(n) {
  const v = typeof n === "number" ? n : parseFloat(n || 0);
  return "Rs " + v.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
}
