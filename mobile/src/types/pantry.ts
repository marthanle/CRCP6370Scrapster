export interface PantryItem {
  id: number;
  name: string;
  qty: string;
  days: number;
  src: string;
  note?: string | null;
}

export type ScanSourceKey = "fridge" | "receipt" | "pantry";

export interface FoundItem {
  name: string;
  qty: string;
  days: number;
}

export interface ScanSourceData {
  title: string;
  hint: string;
  step1: string;
  confirmTitle: string;
  label: string;
  found: FoundItem[];
}

export type PendingAction = "add" | "merge" | "keep" | "skip";

export type Screen =
  | "login"
  | "diet"
  | "home"
  | "pantry"
  | "scanning"
  | "confirm"
  | "result"
  | "budget"
  | "recipe"
  | "cooked"
  | "tracker";
