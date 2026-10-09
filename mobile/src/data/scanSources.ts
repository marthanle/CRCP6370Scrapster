import { ScanSourceKey } from "../types/pantry";

export interface ScanMeta {
  title: string;
  hint: string;
  step1: string;
  confirmTitle: string;
  label: string;
}

/** Static copy for each scan source; the parsed items come from POST /api/scan. */
export const SCAN_META: Record<ScanSourceKey, ScanMeta> = {
  fridge: {
    title: "Reading your shelf…",
    hint: "looking for food",
    step1: "Reading what's in the photo",
    confirmTitle: "What I found in the fridge",
    label: "Fridge photo · today",
  },
  receipt: {
    title: "Reading your receipt…",
    hint: "reading line items",
    step1: "Reading your purchases",
    confirmTitle: "From your receipt",
    label: "Receipt · today",
  },
  pantry: {
    title: "Reading your shelf…",
    hint: "looking for dry goods",
    step1: "Reading what's in the cupboard",
    confirmTitle: "Cupboard contents",
    label: "Pantry photo · today",
  },
};
