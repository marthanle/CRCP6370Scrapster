const PRICE_TABLE: Array<[string, number]> = [
  ["spinach", 2.4],
  ["scallion", 0.8],
  ["rice, cooked", 1.1],
  ["feta", 2.5],
  ["egg", 0.6],
  ["cucumber", 0.9],
  ["cilantro", 1.0],
  ["milk", 1.3],
  ["sourdough", 3.2],
  ["lemon", 0.6],
];

export function priceOf(name: string): number {
  const n = name.toLowerCase();
  const hit = PRICE_TABLE.find(([key]) => n.includes(key));
  return hit ? hit[1] : 0.5;
}
