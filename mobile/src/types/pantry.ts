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

export interface CommunityComment {
  id: string;
  author: string;
  mine?: boolean;
  text: string;
  time: string;
}

export interface CommunityIngredient {
  text: string;
  key: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  mine?: boolean;
  dish: string;
  saved: number;
  time: string;
  ageMinutes: number;
  likes: number;
  liked: boolean;
  caption?: string;
  tags?: string[];
  meta?: string;
  ingredients?: CommunityIngredient[];
  steps?: string[];
  comments: CommunityComment[];
}

export type FeedSortKey = "match" | "newest" | "saved" | "liked";

export interface SavedRecipeIngredient {
  qty: string;
  name: string;
  /** Short matching token (e.g. "rice, cooked") for recipes sourced from the
   * community feed, where the display text is a full descriptive line. Falls
   * back to matching on `name` itself when absent (recipes from a real URL
   * import, where name already is the plain ingredient). */
  key?: string;
}

export interface SavedRecipe {
  id: string;
  title: string;
  source: string;
  serves: number | null;
  ingredients: SavedRecipeIngredient[];
}

export interface MatchedIngredient {
  name: string;
  quantity?: string;
  have: boolean;
  matchedPantryName?: string;
}

export type CookbookFilter = "all" | "ready" | "feed";

export interface FeedPostCard {
  id: string;
  author: string;
  mine: boolean;
  dish: string;
  time: string;
  likes: number;
  liked: boolean;
  saved: string;
  initial: string;
  avatarMine: boolean;
  showMatch: boolean;
  matchLabel: string;
  commentCount: number;
  recipeHint: string;
  open: () => void;
  toggleLike: () => void;
}

export interface FeedSortOption {
  key: FeedSortKey;
  label: string;
  sub: string;
  active: boolean;
  pick: () => void;
}

export interface CookbookRow {
  id: string;
  title: string;
  source: string;
  pct: number;
  ready: boolean;
  haveLabel: string;
  open: () => void;
  remove: () => void;
}

export interface ComposePickRow {
  id: number;
  label: string;
  on: boolean;
  toggle: () => void;
}

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
  | "tracker"
  | "community"
  | "import"
  | "importResult"
  | "settings"
  | "post"
  | "compose"
  | "cookbook";
