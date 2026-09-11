import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { colors } from "../theme";
import { SCAN_SOURCES } from "../data/scanSources";
import { PantryItem, PendingAction, Screen, ScanSourceKey } from "../types/pantry";

const INITIAL_PANTRY: PantryItem[] = [
  { id: 1, name: "Baby spinach", qty: "half bag", days: 0, src: "Fridge photo · Sun" },
  { id: 2, name: "Scallions", qty: "2", days: 1, src: "Fridge photo · Sun" },
  { id: 3, name: "Rice, cooked", qty: "1 cup", days: 2, src: "Fridge photo · Sun" },
  { id: 4, name: "Feta", qty: "½ block", days: 9, src: "Receipt · Sat" },
  { id: 5, name: "Eggs", qty: "2", days: 12, src: "Receipt · Sat" },
  { id: 6, name: "Soy sauce", qty: "bottle", days: 400, src: "Added by hand" },
];

const DIET_LABELS = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "No pork",
  "Gluten-free",
  "Dairy-free",
];

const RECIPE_STEP_COUNT = 4;

const EATEN_ON_COOK = ["rice, cooked", "baby spinach", "scallions"];
const REDUCED_ON_COOK: Record<string, string> = { feta: "½ block", eggs: "1" };

export function band(days: number) {
  if (days <= 0) return { bar: colors.urgentToday, fg: colors.urgentToday, word: "today" };
  if (days === 1) return { bar: colors.urgentTomorrow, fg: colors.urgentTomorrow, word: "tomorrow" };
  if (days <= 7) return { bar: colors.urgentWeek, fg: colors.amberLabel, word: `${days} days` };
  if (days <= 60) return { bar: colors.primary, fg: colors.primary, word: `${days} days` };
  return { bar: colors.primary, fg: colors.primary, word: "shelf-stable" };
}

const TAB_SCREEN: Partial<Record<Screen, "home" | "scan" | "pantry" | "saved">> = {
  home: "home",
  scanning: "scan",
  confirm: "scan",
  pantry: "pantry",
  result: "pantry",
  budget: "pantry",
  recipe: "pantry",
  cooked: "pantry",
  tracker: "saved",
};

export function useScrapsterState() {
  const [screen, setScreen] = useState<Screen>("login");
  const [diet, setDiet] = useState<Record<string, boolean>>({ "No pork": true });
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [source, setSource] = useState<ScanSourceKey>("fridge");
  const [pendingActions, setPendingActions] = useState<Record<number, PendingAction>>({});
  const [pantry, setPantry] = useState<PantryItem[]>(INITIAL_PANTRY);
  const nextIdRef = useRef(7);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (scanTimer.current) clearTimeout(scanTimer.current);
  }, []);

  const go = useCallback((next: Screen) => setScreen(next), []);

  const scan = useCallback((src: ScanSourceKey) => {
    const found = SCAN_SOURCES[src].found;
    const actions: Record<number, PendingAction> = {};
    found.forEach((f, i) => {
      const isDup = pantry.some((p) => p.name.toLowerCase() === f.name.toLowerCase());
      actions[i] = isDup ? "merge" : "add";
    });
    setSource(src);
    setPendingActions(actions);
    setScreen("scanning");
    if (scanTimer.current) clearTimeout(scanTimer.current);
    scanTimer.current = setTimeout(() => setScreen("confirm"), 2100);
  }, [pantry]);

  const cyclePendingAction = useCallback((index: number, isDup: boolean) => {
    setPendingActions((prev) => {
      const cycle: PendingAction[] = isDup ? ["merge", "keep", "skip"] : ["add", "skip"];
      const current = prev[index] ?? cycle[0];
      const next = cycle[(cycle.indexOf(current) + 1) % cycle.length];
      return { ...prev, [index]: next };
    });
  }, []);

  const applyPending = useCallback(() => {
    const src = SCAN_SOURCES[source];
    let id = nextIdRef.current;
    const next = pantry.map((p) => ({ ...p }));
    src.found.forEach((f, i) => {
      const action = pendingActions[i];
      if (action === "skip") return;
      const hit = next.find((p) => p.name.toLowerCase() === f.name.toLowerCase());
      if (hit && action === "merge") {
        hit.qty = `${f.qty} (updated)`;
        hit.days = f.days;
        hit.src = src.label;
      } else {
        next.push({
          id: id++,
          name: f.name,
          qty: f.qty,
          days: f.days,
          src: src.label,
          note: hit ? "kept separate" : null,
        });
      }
    });
    next.sort((a, b) => a.days - b.days);
    nextIdRef.current = id;
    setPantry(next);
    setScreen("pantry");
  }, [pantry, pendingActions, source]);

  const removeFromPantry = useCallback((id: number) => {
    setPantry((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleDiet = useCallback((label: string) => {
    setDiet((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const toggleStepDone = useCallback((index: number) => {
    setDone((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const markCooked = useCallback(() => {
    let id = nextIdRef.current;
    let next = pantry
      .filter((p) => !EATEN_ON_COOK.includes(p.name.toLowerCase()))
      .map((p) => {
        const reduced = REDUCED_ON_COOK[p.name.toLowerCase()];
        return reduced ? { ...p, qty: reduced, src: "Leftover · tonight" } : p;
      });
    if (!next.some((p) => p.name.toLowerCase() === "lemon")) {
      next = [...next, { id: id++, name: "Lemon", qty: "½", days: 6, src: "Leftover · tonight" }];
    }
    next.sort((a, b) => a.days - b.days);
    nextIdRef.current = id;
    setPantry(next);
    setDone({});
    setScreen("cooked");
  }, [pantry]);

  const sortedPantry = useMemo(
    () => [...pantry].sort((a, b) => a.days - b.days),
    [pantry],
  );

  const urgentItems = useMemo(() => sortedPantry.filter((p) => p.days <= 1), [sortedPantry]);
  const soonItems = useMemo(
    () => sortedPantry.filter((p) => p.days > 1 && p.days <= 7),
    [sortedPantry],
  );
  const keepItems = useMemo(() => sortedPantry.filter((p) => p.days > 7), [sortedPantry]);

  const diets = useMemo(
    () => DIET_LABELS.map((label) => ({ label, on: !!diet[label] })),
    [diet],
  );

  const activeSourceData = SCAN_SOURCES[source];

  const pending = useMemo(() => {
    return activeSourceData.found.map((f, i) => {
      const isDup = pantry.some((p) => p.name.toLowerCase() === f.name.toLowerCase());
      const action = pendingActions[i] ?? (isDup ? "merge" : "add");
      const b = band(f.days);
      const skipped = action === "skip";
      const labels: Record<PendingAction, string> = {
        merge: "Merge",
        keep: "Keep both",
        skip: "Skip",
        add: "Add",
      };
      return {
        name: f.name,
        sub: isDup ? `already on your list · ${f.qty}` : `${b.word} · ${f.qty}`,
        bar: skipped ? colors.neutralChipText : isDup ? colors.urgentWeek : b.bar,
        fg: skipped ? colors.textFaint : isDup ? colors.amberLabel : b.fg,
        opacity: skipped ? 0.45 : 1,
        strike: skipped,
        actionLabel: labels[action],
        actionBg: skipped ? colors.neutralChipBg : action === "keep" ? colors.keepBg : colors.primaryTint,
        actionFg: skipped ? colors.textFaint : action === "keep" ? colors.amberLabel : colors.primary,
        isDup,
        index: i,
      };
    });
  }, [activeSourceData, pantry, pendingActions]);

  const dupeCount = useMemo(
    () =>
      activeSourceData.found.filter((f) =>
        pantry.some((p) => p.name.toLowerCase() === f.name.toLowerCase()),
      ).length,
    [activeSourceData, pantry],
  );

  const newRowCount = useMemo(() => {
    return activeSourceData.found.filter((f, i) => {
      const isDup = pantry.some((p) => p.name.toLowerCase() === f.name.toLowerCase());
      const a = pendingActions[i] ?? (isDup ? "merge" : "add");
      return a === "add" || a === "keep";
    }).length;
  }, [activeSourceData, pantry, pendingActions]);

  const activeTab = TAB_SCREEN[screen];
  const showTabs = !["login", "diet", "scanning", "cooked"].includes(screen);

  const urgentNames = urgentItems
    .slice(0, 2)
    .map((p) => p.name.toLowerCase())
    .join(" and ");

  const doneCount = Object.values(done).filter(Boolean).length;

  return {
    screen,
    go,
    diets,
    toggleDiet,
    pantry: sortedPantry,
    pantryCount: pantry.length,
    urgentItems,
    soonItems,
    keepItems,
    hasUrgent: urgentItems.length > 0,
    pantrySummary: urgentItems.length
      ? `${urgentItems.length} need you in the next day`
      : "nothing urgent right now",
    urgentBadge: urgentItems.length ? (urgentItems[0].days <= 0 ? "now" : "1d") : "",
    urgentLine: urgentItems.length ? `Your ${urgentNames} won't make the week.` : "",
    removeFromPantry,
    scan,
    activeSourceData,
    pending,
    cyclePendingAction,
    applyPending,
    hasDupes: dupeCount > 0,
    dupeCount,
    confirmFooter: `Your kitchen list goes from ${pantry.length} to ${pantry.length + newRowCount} items.`,
    toggleStepDone,
    doneMap: done,
    doneLabel: `${doneCount} of ${RECIPE_STEP_COUNT} done`,
    markCooked,
    activeTab,
    showTabs,
  };
}
