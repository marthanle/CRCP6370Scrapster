import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, font, radius } from "../theme";
import { ChevronDownIcon, CommentIcon } from "../components/icons";
import { FeedPostCard, FeedSortOption } from "../types/pantry";

interface Props {
  posts: FeedPostCard[];
  hasRecipeOnly: boolean;
  onToggleHasRecipe: () => void;
  sortMenuOpen: boolean;
  onToggleSortMenu: () => void;
  sortOptions: FeedSortOption[];
  currentSortLabel: string;
  onCompose: () => void;
}

export default function CommunityScreen({
  posts,
  hasRecipeOnly,
  onToggleHasRecipe,
  sortMenuOpen,
  onToggleSortMenu,
  sortOptions,
  currentSortLabel,
  onCompose,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>What people rescued</Text>
      <Text style={styles.subtitle}>
        Dishes other Scrapster cooks built from what they already had.
      </Text>

      <View style={styles.controlsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggleHasRecipe}
          style={[
            styles.filterChip,
            { backgroundColor: hasRecipeOnly ? colors.primary : colors.card, borderColor: hasRecipeOnly ? colors.primary : colors.border },
          ]}
        >
          <Text style={{ fontFamily: font.medium, fontSize: 13, color: hasRecipeOnly ? colors.onPrimary : colors.text }}>
            {hasRecipeOnly ? "✓ Has recipe" : "Has recipe"}
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity activeOpacity={0.7} onPress={onToggleSortMenu} style={styles.sortChip}>
          <Text style={styles.sortLabelMuted}>Sort: </Text>
          <Text style={styles.sortLabel}>{currentSortLabel}</Text>
          <ChevronDownIcon color={colors.text} size={12} />
        </TouchableOpacity>

        {sortMenuOpen && (
          <View style={styles.sortMenu}>
            {sortOptions.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                activeOpacity={0.7}
                onPress={opt.pick}
                style={[styles.sortMenuRow, opt.active && { backgroundColor: "#F1F7F3" }]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.sortMenuLabel}>{opt.label}</Text>
                  <Text style={styles.sortMenuSub}>{opt.sub}</Text>
                </View>
                {opt.active && <Text style={styles.sortMenuCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity activeOpacity={0.85} style={styles.composeCard} onPress={onCompose}>
        <View style={styles.composeAvatar}>
          <Text style={styles.composeAvatarText}>M</Text>
        </View>
        <Text style={styles.composePrompt}>What did you rescue today?</Text>
        <View style={styles.composeButton}>
          <Text style={styles.composeButtonText}>Post</Text>
        </View>
      </TouchableOpacity>

      <View style={{ gap: 10 }}>
        {posts.map((post) => (
          <TouchableOpacity key={post.id} activeOpacity={0.9} style={styles.card} onPress={post.open}>
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>dish photo</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <View style={[styles.avatar, post.avatarMine && styles.avatarMine]}>
                  <Text style={[styles.avatarText, post.avatarMine && styles.avatarTextMine]}>
                    {post.initial}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.author}>{post.author}</Text>
                  <Text style={styles.timeAgo}>{post.time}</Text>
                </View>
                <View style={styles.savingsPill}>
                  <Text style={styles.savingsPillText}>{post.saved}</Text>
                </View>
              </View>

              <Text style={styles.dishTitle}>{post.dish}</Text>

              {post.showMatch && (
                <View style={styles.matchPill}>
                  <Text style={styles.matchPillText}>{post.matchLabel}</Text>
                </View>
              )}

              <View style={styles.footerRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.likeRow}
                  onPress={(e) => {
                    e.stopPropagation();
                    post.toggleLike();
                  }}
                >
                  <Text style={[styles.likeIcon, post.liked && styles.likeIconActive]}>
                    {post.liked ? "♥" : "♡"}
                  </Text>
                  <Text style={styles.likeCount}>{post.likes}</Text>
                </TouchableOpacity>
                <View style={styles.commentRow}>
                  <CommentIcon color={colors.textFaint} size={18} />
                  <Text style={styles.commentCount}>{post.commentCount}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <Text style={styles.recipeHint}>{post.recipeHint}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  title: { fontFamily: font.bold, fontSize: 25, letterSpacing: -0.4, color: colors.text, marginBottom: 4 },
  subtitle: { fontFamily: font.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginBottom: 14 },
  controlsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14, position: "relative", zIndex: 20 },
  filterChip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  sortChip: {
    flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill,
  },
  sortLabelMuted: { fontFamily: font.medium, fontSize: 13, color: colors.textFaint },
  sortLabel: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  sortMenu: {
    position: "absolute", right: 0, top: 44, zIndex: 5, backgroundColor: colors.card, borderRadius: 14,
    padding: 6, minWidth: 200,
    shadowColor: "#14171A", shadowOpacity: 0.14, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  sortMenuRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 11, borderRadius: 10 },
  sortMenuLabel: { fontFamily: font.semibold, fontSize: 14, color: colors.text },
  sortMenuSub: { fontFamily: font.regular, fontSize: 11.5, color: colors.textFaint, marginTop: 1 },
  sortMenuCheck: { fontFamily: font.bold, fontSize: 13, color: colors.primary },
  composeCard: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: 13,
    flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 14,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  composeAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  composeAvatarText: { fontFamily: font.bold, fontSize: 14, color: colors.onPrimary },
  composePrompt: { flex: 1, fontFamily: font.regular, fontSize: 14, color: colors.textFaint },
  composeButton: { backgroundColor: colors.primary, paddingHorizontal: 13, paddingVertical: 8, borderRadius: radius.pill },
  composeButtonText: { fontFamily: font.bold, fontSize: 13, color: colors.onPrimary },
  card: { backgroundColor: colors.card, borderRadius: radius.md, overflow: "hidden",
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  photoPlaceholder: {
    height: 148, backgroundColor: colors.skeletonDish, alignItems: "center", justifyContent: "center",
  },
  photoPlaceholderText: { fontFamily: font.medium, fontSize: 11, color: "#6B736C" },
  cardBody: { padding: 15 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 11 },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryTint,
    alignItems: "center", justifyContent: "center",
  },
  avatarMine: { backgroundColor: colors.primary },
  avatarText: { fontFamily: font.bold, fontSize: 14, color: colors.primary },
  avatarTextMine: { color: colors.onPrimary },
  author: { fontFamily: font.bold, fontSize: 14.5, color: colors.text },
  timeAgo: { fontFamily: font.regular, fontSize: 12, color: colors.textFaint, marginTop: 1 },
  savingsPill: { backgroundColor: colors.primaryTint, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 6 },
  savingsPillText: { fontFamily: font.bold, fontSize: 12.5, color: colors.primary },
  dishTitle: { fontFamily: font.semibold, fontSize: 16, lineHeight: 20.8, letterSpacing: -0.1, color: colors.text, marginBottom: 10 },
  matchPill: {
    alignSelf: "flex-start", backgroundColor: colors.primaryTint, borderRadius: 16,
    paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10,
  },
  matchPillText: { fontFamily: font.medium, fontSize: 12, color: colors.primary },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 18 },
  likeRow: { flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 4 },
  likeIcon: { fontSize: 18, lineHeight: 18, color: colors.textFaint },
  likeIconActive: { color: colors.heartActive },
  likeCount: { fontFamily: font.medium, fontSize: 13, color: colors.textMuted },
  commentRow: { flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 4 },
  commentCount: { fontFamily: font.medium, fontSize: 13, color: colors.textMuted },
  recipeHint: { fontFamily: font.medium, fontSize: 12.5, color: colors.primary },
});
