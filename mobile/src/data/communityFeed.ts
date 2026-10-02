import { CommunityPost } from "../types/pantry";

/**
 * Seed posts from other (mock) users, matching the app's existing pattern of
 * placeholder data until there's a real backend for the community feed.
 */
export const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 1,
    author: "Priya",
    avatarInitial: "P",
    dishTitle: "Fried rice from three sad vegetables",
    savings: "$4.80",
    timeAgo: "2h ago",
    likes: 14,
    liked: false,
  },
  {
    id: 2,
    author: "Devon",
    avatarInitial: "D",
    dishTitle: "Last-bread-slice grilled cheese + soup",
    savings: "$2.10",
    timeAgo: "5h ago",
    likes: 7,
    liked: false,
  },
  {
    id: 3,
    author: "Mei",
    avatarInitial: "M",
    dishTitle: "Whatever-was-left pasta bake",
    savings: "$6.35",
    timeAgo: "1d ago",
    likes: 22,
    liked: true,
  },
];
