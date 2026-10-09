import { useCallback, useMemo, useRef, useState } from "react";
import { colors } from "../theme";
import { SCAN_META } from "../data/scanSources";
import { SEED_COMMUNITY_POSTS } from "../data/communityFeed";
import { priceOf } from "../data/priceTable";
import { ApiError, importRecipe, planRecipe, scanPhoto } from "../api/client";
import { PhotoPermissionError, pickPhoto } from "../photoPicker";
import { ingredientKey, parseLines } from "../ingredientKey";
import { RecipePlan, ScannedItem } from "../types";
import {
  CommunityPost,
  CookbookFilter,
  FeedSortKey,
  MatchedIngredient,
  PantryItem,
  PendingAction,
  SavedRecipe,
  SavedRecipeIngredient,
  Screen,
  ScanSourceKey,
} from "../types/pantry";

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

const MONTH_GOAL = 50;

function norm(s: string) {
  return s.toLowerCase().trim();
}

function postHasRecipe(p: CommunityPost): boolean {
  return (p.steps?.length ?? 0) > 0 || (p.ingredients?.length ?? 0) > 0;
}

function parseAllergies(text: string): string[] {
  return text.split(/[,\n]/).map((t) => t.trim()).filter(Boolean);
}

const SORTS: Array<{ key: FeedSortKey; label: string; sub: string }> = [
  { key: "match", label: "Best match", sub: "Uses the most of your kitchen" },
  { key: "newest", label: "Newest", sub: "Just posted first" },
  { key: "saved", label: "Most saved", sub: "Biggest $ rescued" },
  { key: "liked", label: "Most liked", sub: "What people are loving" },
];

export function band(days: number) {
  if (days <= 0) return { bar: colors.urgentToday, fg: colors.urgentToday, word: "today" };
  if (days === 1) return { bar: colors.urgentTomorrow, fg: colors.urgentTomorrow, word: "tomorrow" };
  if (days <= 7) return { bar: colors.urgentWeek, fg: colors.amberLabel, word: `${days} days` };
  if (days <= 60) return { bar: colors.primary, fg: colors.primary, word: `${days} days` };
  return { bar: colors.primary, fg: colors.primary, word: "shelf-stable" };
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "link";
  }
}

interface OpenedRecipeIngredient {
  name: string;
  quantity?: string;
  key?: string;
}

interface OpenedRecipe {
  id: string;
  title: string;
  servings?: number;
  source?: string;
  ingredients: OpenedRecipeIngredient[];
}

const TAB_SCREEN: Partial<Record<Screen, "home" | "scan" | "pantry" | "saved" | "community">> = {
  home: "home",
  scanning: "scan",
  confirm: "scan",
  pantry: "pantry",
  result: "pantry",
  budget: "pantry",
  recipe: "pantry",
  cooked: "pantry",
  tracker: "saved",
  community: "community",
  compose: "community",
  post: "community",
  import: "home",
  importResult: "home",
};

const HIDDEN_TAB_SCREENS: Screen[] = [
  "login",
  "diet",
  "scanning",
  "cooked",
  "settings",
  "import",
  "importResult",
  "compose",
  "post",
  "cookbook",
];

export function useScrapsterState() {
  const [screen, setScreen] = useState<Screen>("login");
  const [diet, setDiet] = useState<Record<string, boolean>>({ "No pork": true });
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [source, setSource] = useState<ScanSourceKey>("fridge");
  const [pendingActions, setPendingActions] = useState<Record<number, PendingAction>>({});
  const [pantry, setPantry] = useState<PantryItem[]>(INITIAL_PANTRY);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(SEED_COMMUNITY_POSTS);
  const [hasSharedCurrent, setHasSharedCurrent] = useState(false);
  const [allergies, setAllergies] = useState("");

  const [scanFound, setScanFound] = useState<ScannedItem[]>([]);
  const [scanError, setScanError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<RecipePlan | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);
  const recipeKeyRef = useRef("");
  const [monthSaved, setMonthSaved] = useState(32.1);
  const [monthItems, setMonthItems] = useState(9);

  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [openedRecipe, setOpenedRecipe] = useState<OpenedRecipe | null>(null);
  const [importFrom, setImportFrom] = useState<"import" | "cookbook">("import");
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [cookbookFilter, setCookbookFilter] = useState<CookbookFilter>("all");

  const [feedSort, setFeedSort] = useState<FeedSortKey>("match");
  const [feedHasRecipeOnly, setFeedHasRecipeOnly] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState("");

  const [composeDish, setComposeDish] = useState("");
  const [composeCaption, setComposeCaption] = useState("");
  const [composeIngredients, setComposeIngredients] = useState("");
  const [composeSteps, setComposeSteps] = useState("");
  const [composePicks, setComposePicks] = useState<Record<number, boolean>>({});
  const [composePhotoUri, setComposePhotoUri] = useState<string | null>(null);
  const [composePhotoError, setComposePhotoError] = useState<string | null>(null);

  const nextIdRef = useRef(7);

  const go = useCallback((next: Screen) => setScreen(next), []);

  const scan = useCallback(async (src: ScanSourceKey) => {
    setScanError(null);
    let photo;
    try {
      photo = await pickPhoto();
    } catch (err) {
      setScanError(err instanceof PhotoPermissionError ? err.message : "I couldn't open the camera.");
      setScreen("home");
      return;
    }
    if (!photo) return; // cancelled: stay where you were

    setSource(src);
    setScreen("scanning");
    try {
      const { items } = await scanPhoto({
        photoBase64: photo.base64,
        mediaType: photo.mediaType,
        source: src,
      });
      if (items.length === 0) {
        setScanError("I couldn't find any food in that photo. Try a clearer shot.");
        setScreen("home");
        return;
      }
      const actions: Record<number, PendingAction> = {};
      items.forEach((f, i) => {
        const isDup = pantry.some((p) => norm(p.name) === norm(f.name));
        actions[i] = isDup ? "merge" : "add";
      });
      setScanFound(items);
      setPendingActions(actions);
      setScreen("confirm");
    } catch (err) {
      setScanError(err instanceof ApiError ? err.message : "Something went wrong reading that photo.");
      setScreen("home");
    }
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
    const src = SCAN_META[source];
    let id = nextIdRef.current;
    const next = pantry.map((p) => ({ ...p }));
    scanFound.forEach((f, i) => {
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
          note: hit ? "kept separate" : f.note || null,
        });
      }
    });
    next.sort((a, b) => a.days - b.days);
    nextIdRef.current = id;
    setPantry(next);
    setScreen("pantry");
  }, [pantry, pendingActions, scanFound, source]);

  const removeFromPantry = useCallback((id: number) => {
    setPantry((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleDiet = useCallback((label: string) => {
    setDiet((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const toggleStepDone = useCallback((index: number) => {
    setDone((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const cook = useCallback(async (force = false) => {
    setScreen("result");
    const dietOn = DIET_LABELS.filter((l) => diet[l]);
    const key = JSON.stringify([pantry.map((p) => [p.name, p.qty, p.days]), dietOn, allergies]);
    if (!force && recipe && recipeKeyRef.current === key) return;

    setRecipe(null);
    setRecipeError(null);
    setRecipeLoading(true);
    try {
      const plan = await planRecipe({
        pantry: pantry.map((p) => ({ name: p.name, qty: p.qty.replace(/\s*\(updated\)$/, ""), days: p.days })),
        diet: dietOn,
        allergies: parseAllergies(allergies),
      });
      recipeKeyRef.current = key;
      setRecipe(plan);
      setDone({});
    } catch (err) {
      setRecipeError(err instanceof ApiError ? err.message : "Something went wrong planning dinner.");
    } finally {
      setRecipeLoading(false);
    }
  }, [allergies, diet, pantry, recipe]);

  const markCooked = useCallback(() => {
    if (!recipe) return;
    const next = pantry.flatMap((p): PantryItem[] => {
      const use = recipe.uses.find((u) => norm(u.pantryName) === norm(p.name));
      if (!use) return [p];
      if (!use.leftoverQty) return [];
      return [{ ...p, qty: use.leftoverQty, src: "Leftover · tonight" }];
    });
    next.sort((a, b) => a.days - b.days);
    setPantry(next);
    setMonthSaved((m) => m + recipe.rescuedValue);
    setMonthItems((n) => n + recipe.uses.length);
    setDone({});
    setHasSharedCurrent(false);
    setScreen("cooked");
  }, [pantry, recipe]);

  const shareToCommunity = useCallback(() => {
    if (hasSharedCurrent || !recipe) return;
    const keyOf = (name: string) => norm(name).split(/[ ,]/)[0];
    const post: CommunityPost = {
      id: `me${Date.now()}`,
      author: "You",
      mine: true,
      dish: recipe.title,
      saved: recipe.rescuedValue,
      time: "just now",
      ageMinutes: 0,
      likes: 0,
      liked: false,
      comments: [],
      tags: recipe.uses.map((u) => u.pantryName),
      meta: `${recipe.minutes} min`,
      ingredients: [
        ...recipe.uses.map((u) => ({
          text: `${u.qtyUsed} ${u.pantryName.toLowerCase()}`.trim(),
          key: keyOf(u.pantryName),
        })),
        ...recipe.missing.map((m) => ({ text: m.name, key: keyOf(m.name) })),
      ],
      steps: [...recipe.steps],
    };
    setCommunityPosts((prev) => [post, ...prev]);
    setHasSharedCurrent(true);
  }, [hasSharedCurrent, recipe]);

  const toggleLike = useCallback((id: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p,
      ),
    );
  }, []);

  const openPost = useCallback((id: string) => {
    setSelectedPostId(id);
    setCommentDraft("");
    setScreen("post");
  }, []);

  const sendComment = useCallback(() => {
    const text = commentDraft.trim();
    const id = selectedPostId;
    if (!text || !id) return;
    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, comments: [...p.comments, { id: `c${Date.now()}`, author: "You", mine: true, text, time: "now" }] }
          : p,
      ),
    );
    setCommentDraft("");
  }, [commentDraft, selectedPostId]);

  const openCompose = useCallback(() => {
    setComposeDish("");
    setComposeCaption("");
    setComposePicks({});
    setComposeIngredients("");
    setComposeSteps("");
    setComposePhotoUri(null);
    setComposePhotoError(null);
    setScreen("compose");
  }, []);

  const toggleComposePick = useCallback((id: number) => {
    setComposePicks((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const submitPost = useCallback(() => {
    const dish = composeDish.trim();
    if (!dish) return;
    const ingredientLines = parseLines(composeIngredients);
    const stepLines = parseLines(composeSteps);
    const picked = pantry.filter((p) => composePicks[p.id]);
    const saved = picked.reduce((a, p) => a + priceOf(p.name), 0);
    const post: CommunityPost = {
      id: `me${Date.now()}`,
      author: "You",
      mine: true,
      dish,
      photo: composePhotoUri ? { uri: composePhotoUri } : undefined,
      caption: composeCaption.trim() || undefined,
      ingredients: ingredientLines.length
        ? ingredientLines.map((text) => ({ text, key: ingredientKey(text) }))
        : undefined,
      steps: stepLines.length ? stepLines : undefined,
      tags: picked.map((p) => p.name),
      saved,
      time: "just now",
      ageMinutes: 0,
      likes: 0,
      liked: false,
      comments: [],
    };
    setCommunityPosts((prev) => [post, ...prev]);
    setScreen("community");
  }, [composeCaption, composeDish, composeIngredients, composePhotoUri, composePicks, composeSteps, pantry]);

  const pickComposePhoto = useCallback(async () => {
    setComposePhotoError(null);
    try {
      const photo = await pickPhoto("library");
      if (photo) setComposePhotoUri(photo.uri);
    } catch (err) {
      setComposePhotoError(err instanceof PhotoPermissionError ? err.message : "I couldn't open your photos.");
    }
  }, []);

  const isRecipeSaved = useCallback(
    (id: string) => savedRecipes.some((r) => r.id === id),
    [savedRecipes],
  );

  const toggleSavedRecipe = useCallback((rec: SavedRecipe) => {
    setSavedRecipes((prev) =>
      prev.some((r) => r.id === rec.id) ? prev.filter((r) => r.id !== rec.id) : [rec, ...prev],
    );
  }, []);

  const postToSavedRecipe = useCallback((post: CommunityPost): SavedRecipe => ({
    id: `post:${post.id}`,
    title: post.dish,
    source: `from ${post.mine ? "you" : post.author}`,
    serves: null,
    ingredients: (post.ingredients ?? []).map((i) => ({ qty: "", name: i.text, key: i.key })),
  }), []);

  const openSavedRecipe = useCallback((rec: SavedRecipe) => {
    setOpenedRecipe({
      id: rec.id,
      title: rec.title,
      servings: rec.serves ?? undefined,
      source: rec.source,
      ingredients: rec.ingredients.map((i) => ({ name: i.name, quantity: i.qty || undefined, key: i.key })),
    });
    setImportFrom("cookbook");
    setScreen("importResult");
  }, []);

  const startImport = useCallback(async (url: string) => {
    setImportError(null);
    setImportLoading(true);
    setImportFrom("import");
    setScreen("import");
    try {
      const result = await importRecipe(url);
      setOpenedRecipe({
        id: `url:${url.toLowerCase()}`,
        title: result.title,
        servings: result.servings,
        source: hostOf(url),
        ingredients: result.ingredients.map((i) => ({ name: i.name, quantity: i.quantity })),
      });
      setScreen("importResult");
    } catch (err) {
      const isNetworkError = err instanceof TypeError && /fetch|network/i.test(err.message);
      setImportError(
        isNetworkError
          ? "Can't reach the Scrapster server. Make sure the backend is running."
          : err instanceof Error
            ? err.message
            : "Couldn't import that recipe. Try a different link.",
      );
    } finally {
      setImportLoading(false);
    }
  }, []);

  const toggleSaveOpenedRecipe = useCallback(() => {
    if (!openedRecipe) return;
    toggleSavedRecipe({
      id: openedRecipe.id,
      title: openedRecipe.title,
      source: openedRecipe.source ?? "",
      serves: openedRecipe.servings ?? null,
      ingredients: openedRecipe.ingredients.map((i): SavedRecipeIngredient => ({
        qty: i.quantity ?? "",
        name: i.name,
        key: i.key,
      })),
    });
  }, [openedRecipe, toggleSavedRecipe]);

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

  const scanMeta = SCAN_META[source];

  const pending = useMemo(() => {
    return scanFound.map((f, i) => {
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
  }, [scanFound, pantry, pendingActions]);

  const dupeCount = useMemo(
    () =>
      scanFound.filter((f) =>
        pantry.some((p) => p.name.toLowerCase() === f.name.toLowerCase()),
      ).length,
    [scanFound, pantry],
  );

  const newRowCount = useMemo(() => {
    return scanFound.filter((f, i) => {
      const isDup = pantry.some((p) => p.name.toLowerCase() === f.name.toLowerCase());
      const a = pendingActions[i] ?? (isDup ? "merge" : "add");
      return a === "add" || a === "keep";
    }).length;
  }, [scanFound, pantry, pendingActions]);

  function matchTarget(ing: OpenedRecipeIngredient) {
    return (ing.key ?? ing.name).toLowerCase().trim();
  }

  const matchedIngredients: MatchedIngredient[] = useMemo(() => {
    if (!openedRecipe) return [];
    return openedRecipe.ingredients.map((ing) => {
      const needle = matchTarget(ing);
      const hit = pantry.find((p) => {
        const hay = p.name.toLowerCase().trim();
        return hay.includes(needle) || needle.includes(hay);
      });
      return {
        name: ing.name,
        quantity: ing.quantity,
        have: !!hit,
        matchedPantryName: hit?.name,
      };
    });
  }, [openedRecipe, pantry]);

  const haveIngredients = useMemo(
    () => matchedIngredients.filter((m) => m.have),
    [matchedIngredients],
  );
  const needIngredients = useMemo(
    () => matchedIngredients.filter((m) => !m.have),
    [matchedIngredients],
  );

  // Community feed: match-count (for sort + "uses N things you have" badge)
  // and the full computed/sorted list of cards.
  function postMatchCount(post: CommunityPost): number {
    const keys = (post.ingredients ?? []).map((i) => i.key);
    const tagKeys = (post.tags ?? []).map((t) => t.toLowerCase().split(/[ ,]/)[0]);
    const all = keys.length ? keys : tagKeys;
    const pantryNames = pantry.map((p) => p.name.toLowerCase());
    return all.filter((k) => pantryNames.some((n) => n.includes(k))).length;
  }

  const SORT_FNS: Record<FeedSortKey, (a: CommunityPost, b: CommunityPost) => number> = {
    match: (a, b) => postMatchCount(b) - postMatchCount(a) || a.ageMinutes - b.ageMinutes,
    newest: (a, b) => a.ageMinutes - b.ageMinutes,
    saved: (a, b) => b.saved - a.saved,
    liked: (a, b) => b.likes - a.likes,
  };

  const feedPosts = useMemo(() => {
    return communityPosts
      .filter((p) => !feedHasRecipeOnly || postHasRecipe(p))
      .slice()
      .sort(SORT_FNS[feedSort])
      .map((p) => {
        const match = postMatchCount(p);
        const showMatch = feedSort === "match" && !p.mine && match > 0;
        return {
          id: p.id,
          photo: p.photo,
          author: p.author,
          mine: !!p.mine,
          dish: p.dish,
          time: p.time,
          likes: p.likes,
          liked: p.liked,
          saved: `+$${p.saved.toFixed(2)}`,
          initial: p.mine ? "M" : p.author[0],
          avatarMine: !!p.mine,
          showMatch,
          matchLabel: showMatch ? `uses ${match} thing${match === 1 ? "" : "s"} you have` : "",
          commentCount: p.comments.length,
          recipeHint: postHasRecipe(p) ? "See recipe →" : "View →",
          open: () => openPost(p.id),
          toggleLike: () => toggleLike(p.id),
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityPosts, feedHasRecipeOnly, feedSort, pantry, openPost, toggleLike]);

  const sortOptions = SORTS.map((s) => ({
    key: s.key,
    label: s.label,
    sub: s.sub,
    active: s.key === feedSort,
    pick: () => {
      setFeedSort(s.key);
      setSortMenuOpen(false);
    },
  }));

  const currentSortLabel = SORTS.find((s) => s.key === feedSort)?.label ?? "Best match";

  const selectedPost = useMemo(
    () => communityPosts.find((p) => p.id === selectedPostId) ?? communityPosts[0] ?? null,
    [communityPosts, selectedPostId],
  );

  const selectedPostDetail = useMemo(() => {
    if (!selectedPost) return null;
    const ingredients = (selectedPost.ingredients ?? []).map((i) => {
      const have = pantry.some((p) => p.name.toLowerCase().includes(i.key));
      return { text: i.text, have };
    });
    const haveCount = ingredients.filter((i) => i.have).length;
    const isSaved = isRecipeSaved(`post:${selectedPost.id}`);
    return {
      post: selectedPost,
      initial: selectedPost.mine ? "M" : selectedPost.author[0],
      avatarMine: !!selectedPost.mine,
      authorShort: selectedPost.mine ? "you" : selectedPost.author,
      savedLabel: `+$${selectedPost.saved.toFixed(2)}`,
      hasRecipe: postHasRecipe(selectedPost),
      ingredients,
      haveCount,
      matchLine: `You already have ${haveCount} of ${ingredients.length} ingredients.`,
      isSaved,
      toggleSave: () => {
        if (postHasRecipe(selectedPost)) {
          toggleSavedRecipe(postToSavedRecipe(selectedPost));
        }
      },
      toggleLike: () => toggleLike(selectedPost.id),
    };
  }, [selectedPost, pantry, isRecipeSaved, toggleSavedRecipe, postToSavedRecipe, toggleLike]);

  const composePickRows = useMemo(
    () =>
      sortedPantry.map((p) => ({
        id: p.id,
        label: p.name,
        on: !!composePicks[p.id],
        toggle: () => toggleComposePick(p.id),
      })),
    [sortedPantry, composePicks, toggleComposePick],
  );

  const composeSavedPreview = useMemo(() => {
    const total = pantry
      .filter((p) => composePicks[p.id])
      .reduce((a, p) => a + priceOf(p.name), 0);
    return `+$${total.toFixed(2)} saved`;
  }, [pantry, composePicks]);

  const canSubmitPost = composeDish.trim().length > 0;

  function cookbookMatchCount(rec: SavedRecipe) {
    const total = rec.ingredients.length;
    const have = rec.ingredients.filter((i) =>
      pantry.some((p) => {
        const target = (i.key ?? i.name).toLowerCase();
        const hay = p.name.toLowerCase();
        return hay.includes(target) || target.includes(hay);
      }),
    ).length;
    return { total, have };
  }

  const cookbookRows = useMemo(() => {
    const withMatch = savedRecipes.map((rec) => ({ rec, ...cookbookMatchCount(rec) }));
    withMatch.sort((a, b) => b.have / (b.total || 1) - a.have / (a.total || 1));
    const filtered = withMatch.filter((x) => {
      if (cookbookFilter === "ready") return x.total > 0 && x.total - x.have <= 2;
      if (cookbookFilter === "feed") return x.rec.id.startsWith("post:");
      return true;
    });
    return filtered.map(({ rec, have, total }) => {
      const missing = total - have;
      const ready = missing <= 2;
      return {
        id: rec.id,
        title: rec.title,
        source: rec.source,
        pct: Math.round((have / (total || 1)) * 100),
        ready,
        haveLabel: missing === 0 ? "have everything" : `need ${missing}`,
        open: () => openSavedRecipe(rec),
        remove: () => toggleSavedRecipe(rec),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedRecipes, cookbookFilter, pantry, openSavedRecipe, toggleSavedRecipe]);

  const almostMakeCount = useMemo(
    () => savedRecipes.filter((rec) => {
      const { have, total } = cookbookMatchCount(rec);
      return total > 0 && total - have <= 2;
    }).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [savedRecipes, pantry],
  );

  const cookbookSummary = savedRecipes.length
    ? `${savedRecipes.length} saved · ${almostMakeCount} you can almost make`
    : "Nothing saved yet";

  const activeTab = TAB_SCREEN[screen];
  const showTabs = !HIDDEN_TAB_SCREENS.includes(screen);

  const urgentNames = urgentItems
    .slice(0, 2)
    .map((p) => p.name.toLowerCase())
    .join(" and ");

  const doneCount = Object.values(done).filter(Boolean).length;

  const recipeStats = useMemo(() => {
    if (!recipe) return null;
    const atRisk = pantry.filter((p) => p.days <= 7).length;
    return {
      used: recipe.uses.length,
      atRisk: Math.max(atRisk, recipe.uses.length),
      missingTotal: recipe.missing.reduce((a, m) => a + m.estPrice, 0),
    };
  }, [recipe, pantry]);

  const cookedLeftovers = useMemo(
    () =>
      (recipe?.uses ?? [])
        .filter((u) => u.leftoverQty)
        .map((u) => `${u.leftoverQty} ${u.pantryName.toLowerCase()}`),
    [recipe],
  );

  const dietSummary =
    (Object.keys(diet).filter((k) => diet[k]).join(", ") || "Nothing set") + " · no allergies";

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
    scanMeta,
    scanError,
    clearScanError: () => setScanError(null),
    scanFoundCount: scanFound.length,
    allergies,
    setAllergies,
    recipe,
    recipeLoading,
    recipeError,
    cook,
    retryCook: () => cook(true),
    recipeStats,
    cookedLeftovers,
    monthSavedLabel: `$${monthSaved.toFixed(2)}`,
    monthItems,
    monthPct: Math.min(100, Math.round((monthSaved / MONTH_GOAL) * 100)),
    pending,
    cyclePendingAction,
    applyPending,
    hasDupes: dupeCount > 0,
    dupeCount,
    confirmFooter: `Your kitchen list goes from ${pantry.length} to ${pantry.length + newRowCount} items.`,
    toggleStepDone,
    doneMap: done,
    doneLabel: `${doneCount} of ${recipe?.steps.length ?? 0} done`,
    markCooked,
    activeTab,
    showTabs,

    communityPosts: feedPosts,
    toggleLike,
    shareToCommunity,
    hasSharedCurrent,
    openPost,
    feedSort,
    feedHasRecipeOnly,
    toggleFeedHasRecipeOnly: () => {
      setFeedHasRecipeOnly((v) => !v);
      setSortMenuOpen(false);
    },
    sortMenuOpen,
    toggleSortMenu: () => setSortMenuOpen((v) => !v),
    sortOptions,
    currentSortLabel,

    selectedPostDetail,
    commentDraft,
    setCommentDraft,
    sendComment,

    openCompose,
    composePhotoUri,
    composePhotoError,
    pickComposePhoto,
    removeComposePhoto: () => setComposePhotoUri(null),
    composeDish,
    setComposeDish,
    composeCaption,
    composeIngredients,
    setComposeIngredients,
    composeSteps,
    setComposeSteps,
    setComposeCaption,
    composePickRows,
    composeSavedPreview,
    canSubmitPost,
    submitPost,

    startImport,
    importLoading,
    importError,
    openedRecipe,
    haveIngredients,
    needIngredients,
    importFrom,
    canSaveOpenedRecipe: !!openedRecipe && openedRecipe.ingredients.length > 0,
    isOpenedRecipeSaved: openedRecipe ? isRecipeSaved(openedRecipe.id) : false,
    toggleSaveOpenedRecipe,

    savedRecipes,
    cookbookRows,
    cookbookFilter,
    setCookbookFilter,
    cookbookSummary,
    openSavedRecipe,

    dietSummary,
  };
}
