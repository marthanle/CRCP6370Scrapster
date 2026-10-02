import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, font, radius } from "../theme";
import { CommentIcon, SendIcon } from "../components/icons";
import { CommunityPost } from "../types/pantry";

interface IngredientRow {
  text: string;
  have: boolean;
}

interface Props {
  post: CommunityPost;
  initial: string;
  avatarMine: boolean;
  authorShort: string;
  savedLabel: string;
  hasRecipe: boolean;
  ingredients: IngredientRow[];
  matchLine: string;
  isSaved: boolean;
  toggleSave: () => void;
  toggleLike: () => void;
  commentDraft: string;
  onCommentDraftChange: (text: string) => void;
  onSendComment: () => void;
  onBack: () => void;
}

export default function PostDetailScreen({
  post,
  initial,
  avatarMine,
  authorShort,
  savedLabel,
  hasRecipe,
  ingredients,
  matchLine,
  isSaved,
  toggleSave,
  toggleLike,
  commentDraft,
  onCommentDraftChange,
  onSendComment,
  onBack,
}: Props) {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>dish photo, full bleed</Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <View style={styles.savedBadge}>
            <Text style={styles.savedBadgeText}>{savedLabel} saved</Text>
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.authorRow}>
            <View style={[styles.avatar, avatarMine && styles.avatarMine]}>
              <Text style={[styles.avatarText, avatarMine && styles.avatarTextMine]}>{initial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.author}>{post.author}</Text>
              <Text style={styles.timeAgo}>{post.time}</Text>
            </View>
          </View>

          <Text style={styles.dishTitle}>{post.dish}</Text>
          {post.meta && <Text style={styles.meta}>{post.meta}</Text>}
          {post.caption && <Text style={styles.caption}>{post.caption}</Text>}

          {post.tags && post.tags.length > 0 && (
            <View style={styles.tagRow}>
              {post.tags.map((t) => (
                <View key={t} style={styles.tag}>
                  <Text style={styles.tagText}>rescued {t.toLowerCase()}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actionBar}>
            <TouchableOpacity activeOpacity={0.7} style={styles.likeRow} onPress={toggleLike}>
              <Text style={[styles.heartIcon, post.liked && styles.heartIconActive]}>
                {post.liked ? "♥" : "♡"}
              </Text>
              <Text style={styles.likeCount}>{post.likes}</Text>
            </TouchableOpacity>
            <View style={styles.commentCountRow}>
              <CommentIcon color={colors.textMuted} size={20} />
              <Text style={styles.commentCountText}>{post.comments.length}</Text>
            </View>
            <View style={{ flex: 1 }} />
            {hasRecipe && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleSave}
                style={[styles.saveBtn, { backgroundColor: isSaved ? colors.primary : colors.primaryTint }]}
              >
                <Text style={{ fontFamily: font.semibold, fontSize: 13, color: isSaved ? colors.onPrimary : colors.primary }}>
                  {isSaved ? "✓ Saved" : "Save recipe"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {hasRecipe ? (
            <>
              <Text style={styles.sectionTitle}>How {authorShort} made it</Text>
              <Text style={styles.matchLine}>{matchLine}</Text>
              <View style={styles.ingredientCard}>
                {ingredients.map((ing, i) => (
                  <View key={ing.text} style={i < ingredients.length - 1 && styles.ingredientDivider}>
                    <View style={styles.ingredientRow}>
                      <View
                        style={[
                          styles.ingredientDot,
                          { backgroundColor: ing.have ? colors.primaryTint : colors.keepBg },
                        ]}
                      >
                        <Text style={{ fontFamily: font.bold, fontSize: 11, color: ing.have ? colors.primary : colors.amberLabel }}>
                          {ing.have ? "✓" : "+"}
                        </Text>
                      </View>
                      <Text style={styles.ingredientText}>{ing.text}</Text>
                      <Text style={{ fontFamily: font.medium, fontSize: 11, color: ing.have ? colors.primary : colors.amberLabel }}>
                        {ing.have ? "you have it" : "need"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
              <View style={{ gap: 8, marginBottom: 22 }}>
                {(post.steps ?? []).map((text, i) => (
                  <View key={i} style={styles.stepRow}>
                    <View style={styles.stepDot}>
                      <Text style={styles.stepDotText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{text}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.noRecipeNote}>
              <Text style={styles.noRecipeText}>
                {authorShort === "you" ? "You" : post.author} didn't drop the recipe on this one. Ask in the comments.
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Comments ({post.comments.length})</Text>
          <View style={{ gap: 14, marginBottom: 16 }}>
            {post.comments.map((c) => (
              <View key={c.id} style={styles.commentRow}>
                <View style={[styles.commentAvatar, c.mine && styles.avatarMine]}>
                  <Text style={[styles.commentAvatarText, c.mine && styles.avatarTextMine]}>
                    {c.mine ? "M" : c.author[0]}
                  </Text>
                </View>
                <View style={styles.commentBubble}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{c.author}</Text>
                    <Text style={styles.commentTime}>{c.time}</Text>
                  </View>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </View>
            ))}
            {post.comments.length === 0 && (
              <Text style={styles.noComments}>No comments yet. Hype them up.</Text>
            )}
          </View>

          <View style={styles.composerRow}>
            <TextInput
              style={styles.composerInput}
              placeholder="Add a comment…"
              placeholderTextColor={colors.textFaint}
              value={commentDraft}
              onChangeText={onCommentDraftChange}
              onSubmitEditing={onSendComment}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onSendComment}
              style={[styles.sendBtn, { opacity: commentDraft.trim() ? 1 : 0.4 }]}
            >
              <SendIcon color={colors.onPrimary} size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background },
  hero: {
    height: 300, backgroundColor: colors.skeletonAlt,
    alignItems: "center", justifyContent: "center", marginTop: -56,
  },
  heroLabel: { fontFamily: font.medium, fontSize: 11.5, color: "#5E665F" },
  backBtn: {
    position: "absolute", left: 16, top: 62, width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
  },
  backBtnText: { fontSize: 17 },
  savedBadge: {
    position: "absolute", right: 16, top: 62, backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 13, paddingVertical: 8, borderRadius: radius.pill,
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
  },
  savedBadgeText: { fontFamily: font.bold, fontSize: 13, color: colors.primary },
  sheet: {
    padding: 20, marginTop: -26, backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl,
  },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 12 },
  avatar: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primaryTint,
    alignItems: "center", justifyContent: "center",
  },
  avatarMine: { backgroundColor: colors.primary },
  avatarText: { fontFamily: font.bold, fontSize: 14.5, color: colors.primary },
  avatarTextMine: { color: colors.onPrimary },
  author: { fontFamily: font.bold, fontSize: 15, color: colors.text },
  timeAgo: { fontFamily: font.regular, fontSize: 12, color: colors.textFaint, marginTop: 1 },
  dishTitle: { fontFamily: font.bold, fontSize: 25, lineHeight: 29, letterSpacing: -0.4, color: colors.text, marginBottom: 8 },
  meta: { fontFamily: font.regular, fontSize: 13, color: colors.textMuted, marginBottom: 10 },
  caption: { fontFamily: font.regular, fontSize: 14.5, lineHeight: 22.5, color: "#3A4045", marginBottom: 12 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  tag: { backgroundColor: colors.primaryTint, borderRadius: 16, paddingHorizontal: 11, paddingVertical: 6 },
  tagText: { fontFamily: font.medium, fontSize: 12, color: colors.primary },
  actionBar: {
    flexDirection: "row", alignItems: "center", gap: 20, paddingVertical: 12,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.borderSoft, marginBottom: 20,
  },
  likeRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  heartIcon: { fontSize: 21, lineHeight: 21, color: colors.textMuted },
  heartIconActive: { color: colors.heartActive },
  likeCount: { fontFamily: font.semibold, fontSize: 14, color: colors.text },
  commentCountRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  commentCountText: { fontFamily: font.semibold, fontSize: 14, color: colors.text },
  saveBtn: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: radius.pill },
  sectionTitle: { fontFamily: font.bold, fontSize: 18, letterSpacing: -0.2, color: colors.text, marginBottom: 4 },
  matchLine: { fontFamily: font.regular, fontSize: 12.5, color: colors.textMuted, marginBottom: 12 },
  ingredientCard: {
    backgroundColor: colors.card, borderRadius: radius.md, paddingHorizontal: 15, marginBottom: 12,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  ingredientDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  ingredientRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 11 },
  ingredientDot: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  ingredientText: { flex: 1, fontFamily: font.regular, fontSize: 14, color: colors.text },
  stepRow: {
    flexDirection: "row", gap: 11, backgroundColor: colors.card, borderRadius: 14, padding: 13,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  stepDot: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primaryTint,
    alignItems: "center", justifyContent: "center", marginTop: 1,
  },
  stepDotText: { fontFamily: font.bold, fontSize: 11, color: colors.primary },
  stepText: { flex: 1, fontFamily: font.regular, fontSize: 13.5, lineHeight: 20.25, color: colors.text },
  noRecipeNote: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.dash, borderStyle: "dashed",
    borderRadius: 14, padding: 14, marginBottom: 22,
  },
  noRecipeText: { fontFamily: font.regular, fontSize: 13, color: colors.textMuted, textAlign: "center" },
  commentRow: { flexDirection: "row", gap: 10 },
  commentAvatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primaryTint,
    alignItems: "center", justifyContent: "center",
  },
  commentAvatarText: { fontFamily: font.bold, fontSize: 12.5, color: colors.primary },
  commentBubble: {
    flex: 1, backgroundColor: colors.card, borderRadius: 14, borderTopLeftRadius: 4, padding: 13,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  commentHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  commentAuthor: { fontFamily: font.bold, fontSize: 13, color: colors.text },
  commentTime: { fontFamily: font.regular, fontSize: 11, color: colors.textSubtle },
  commentText: { fontFamily: font.regular, fontSize: 13.5, lineHeight: 19.5, color: "#3A4045" },
  noComments: { fontFamily: font.regular, fontSize: 13, color: colors.textFaint },
  composerRow: { flexDirection: "row", gap: 9, alignItems: "center" },
  composerInput: {
    flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 12, fontFamily: font.regular, fontSize: 14, color: colors.text,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center",
  },
});
