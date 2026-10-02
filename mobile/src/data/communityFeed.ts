import { CommunityPost } from "../types/pantry";

/**
 * Seed posts from other (mock) users, matching the design handoff's exact
 * copy. Real multi-user posts/comments/likes need a backend — this stays
 * local-state only for now, same as the rest of the community feature.
 */
export const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "p1",
    author: "Priya",
    dish: "Fried rice from three sad vegetables",
    saved: 4.8,
    time: "2h ago",
    ageMinutes: 120,
    likes: 14,
    liked: false,
    caption:
      'the bok choy was giving "final days" so I did what had to be done. day-old rice is non-negotiable, fresh rice turns to mush. full recipe below because people keep asking 🫡',
    tags: ["Bell pepper", "Carrot", "Bok choy"],
    meta: "15 min · one pan · serves 2 (or 1 very hungry person)",
    ingredients: [
      { text: "2 cups day-old rice, cold from the fridge", key: "rice, cooked" },
      { text: "½ bell pepper, diced small", key: "pepper" },
      { text: "1 carrot (bendy is fine), diced", key: "carrot" },
      { text: "2 heads bok choy — stems and leaves split", key: "bok choy" },
      { text: "2 eggs, beaten", key: "egg" },
      { text: "2 tbsp soy sauce", key: "soy" },
      { text: "2 cloves garlic, minced", key: "garlic" },
      { text: "1 tsp sesame oil, to finish", key: "sesame" },
      { text: "Neutral oil for the pan", key: "oil" },
    ],
    steps: [
      "Get your biggest pan properly hot — like, smoking a little. Add a spoon of oil.",
      "Carrot goes in first (it takes longest), 2 min. Then the pepper, another 2 min. Keep it moving.",
      "Bok choy stems next for a minute, then the leaves and garlic for 30 seconds. Do not let the garlic burn, it gets bitter.",
      "Shove everything to one side. Pour the eggs into the empty side and scramble until just set, then mix it all together.",
      "Add the cold rice. Break up clumps with your spatula, then press it flat and LEAVE IT for 2 minutes. That's where the crispy bits come from.",
      "Soy sauce around the edge of the pan (it sizzles and gets toastier), toss, then sesame oil off the heat. Taste — more soy if you want.",
    ],
    comments: [
      { id: "c1", author: "Devon", text: "bok choy stems first is genuinely elite. stealing", time: "1h" },
      { id: "c2", author: "Sam", text: "no pepper so I used frozen peas, still ate the whole thing standing at the stove", time: "48m" },
      { id: "c3", author: "Mei", text: 'the "LEAVE IT" step is so real. I always stir too much', time: "22m" },
    ],
  },
  {
    id: "p2",
    author: "Devon",
    dish: "Last-bread-slice grilled cheese + soup",
    saved: 2.1,
    time: "5h ago",
    ageMinutes: 300,
    likes: 7,
    liked: false,
    caption:
      "nobody in this apartment eats the bread heels so I made them everyone's problem. cheese ends + half a can of tomato soup. comfort food on a $0 budget",
    tags: ["Bread heels", "Cheddar ends"],
    comments: [
      { id: "c4", author: "Mei", text: "recipe?? that crust is unreal", time: "3h" },
      { id: "c5", author: "Devon", mine: false, text: "it's literally a grilled cheese mei 😭", time: "3h" },
      { id: "c6", author: "Priya", text: "justice for bread heels", time: "2h" },
    ],
  },
  {
    id: "p3",
    author: "Mei",
    dish: "Whatever-was-left pasta bake",
    saved: 6.35,
    time: "1d ago",
    ageMinutes: 1440,
    likes: 22,
    liked: true,
    caption:
      "sunday reset: if it was in the fridge it went in the dish. no measurements, just vibes. the zucchini had been staring at me all week",
    tags: ["Spinach", "Zucchini", "Feta"],
    meta: "oven · vibes-based",
    ingredients: [
      { text: "whatever pasta you have", key: "pasta" },
      { text: "the rest of the sauce jar", key: "marinara" },
      { text: "sad zucchini", key: "zucchini" },
      { text: "spinach (a lot, it shrinks)", key: "spinach" },
      { text: "feta on top", key: "feta" },
    ],
    steps: [
      "boil pasta, dump everything in a dish, feta on top.",
      "400° until the corners go crispy. that's it that's the recipe",
    ],
    comments: [
      { id: "c7", author: "Priya", text: "the crispy corners are the entire point", time: "20h" },
      { id: "c8", author: "Jordan", text: "did this with kale and cottage cheese and honestly?? slaps", time: "18h" },
      { id: "c9", author: "Devon", text: '"that\'s it that\'s the recipe" is my kind of cooking', time: "6h" },
    ],
  },
];
