import { ScanSourceData, ScanSourceKey } from "../types/pantry";

/**
 * Stand-in for a real photo/receipt scan while the design is being validated.
 * Swap this for a call to the backend's /api/analyze endpoint (see
 * mobile/src/api/client.ts) once the scan flow is wired to Claude for real.
 */
export const SCAN_SOURCES: Record<ScanSourceKey, ScanSourceData> = {
  fridge: {
    title: "Reading your shelf…",
    hint: "spinach · 96%",
    step1: "Found 5 things on that shelf",
    confirmTitle: "New since Sunday",
    label: "Fridge photo · today",
    found: [
      { name: "Baby spinach", qty: "half bag", days: 0 },
      { name: "Rice, cooked", qty: "1 cup", days: 2 },
      { name: "Half a cucumber", qty: "half", days: 4 },
      { name: "Cilantro", qty: "small bunch", days: 1 },
      { name: "Feta", qty: "½ block", days: 9 },
    ],
  },
  receipt: {
    title: "Reading your receipt…",
    hint: "Campus Grocer · 6 lines",
    step1: "Found 5 purchases and their prices",
    confirmTitle: "From Campus Grocer",
    label: "Receipt · today",
    found: [
      { name: "Eggs", qty: "dozen", days: 21 },
      { name: "Whole milk", qty: "1 qt", days: 8 },
      { name: "Baby spinach", qty: "bag", days: 5 },
      { name: "Chickpeas, canned", qty: "2 cans", days: 400 },
      { name: "Sourdough", qty: "loaf", days: 4 },
    ],
  },
  pantry: {
    title: "Reading your shelf…",
    hint: "dry goods · 4 found",
    step1: "Found 4 things in the cupboard",
    confirmTitle: "Cupboard contents",
    label: "Pantry photo · today",
    found: [
      { name: "Rice, dry", qty: "2 lb bag", days: 400 },
      { name: "Soy sauce", qty: "bottle", days: 400 },
      { name: "Peanut butter", qty: "jar", days: 180 },
      { name: "Olive oil", qty: "half bottle", days: 300 },
    ],
  },
};
