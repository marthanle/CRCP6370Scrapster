import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, font, radius } from "../theme";
import { CommunityPost } from "../types/pantry";

interface Props {
  posts: CommunityPost[];
  onToggleLike: (id: number) => void;
}

export default function CommunityScreen({ posts, onToggleLike }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>What people rescued</Text>
      <Text style={styles.subtitle}>
        Dishes other Scrapster cooks built from what they already had.
      </Text>

      <View style={{ gap: 10 }}>
        {posts.map((post) => (
          <View key={post.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.avatar, post.isYou && styles.avatarYou]}>
                <Text style={[styles.avatarText, post.isYou && styles.avatarTextYou]}>
                  {post.avatarInitial}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.author}>{post.isYou ? "You" : post.author}</Text>
                <Text style={styles.timeAgo}>{post.timeAgo}</Text>
              </View>
              <View style={styles.savingsPill}>
                <Text style={styles.savingsPillText}>+{post.savings}</Text>
              </View>
            </View>

            <Text style={styles.dishTitle}>{post.dishTitle}</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.likeRow}
              onPress={() => onToggleLike(post.id)}
            >
              <Text style={[styles.likeIcon, post.liked && styles.likeIconActive]}>
                {post.liked ? "♥" : "♡"}
              </Text>
              <Text style={[styles.likeCount, post.liked && styles.likeCountActive]}>
                {post.likes}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  title: { fontFamily: font.bold, fontSize: 25, letterSpacing: -0.4, color: colors.text, marginBottom: 4 },
  subtitle: { fontFamily: font.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginBottom: 16 },
  card: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: 15,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryTint,
    alignItems: "center", justifyContent: "center",
  },
  avatarYou: { backgroundColor: colors.primary },
  avatarText: { fontFamily: font.bold, fontSize: 13.5, color: colors.primary },
  avatarTextYou: { color: colors.onPrimary },
  author: { fontFamily: font.semibold, fontSize: 14.5, color: colors.text },
  timeAgo: { fontFamily: font.regular, fontSize: 12, color: colors.textFaint, marginTop: 1 },
  savingsPill: { backgroundColor: colors.primaryTint, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 6 },
  savingsPillText: { fontFamily: font.semibold, fontSize: 12.5, color: colors.primary },
  dishTitle: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22, color: colors.text, marginBottom: 10 },
  likeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  likeIcon: { fontSize: 15, color: colors.textFaint },
  likeIconActive: { color: colors.urgentToday },
  likeCount: { fontFamily: font.medium, fontSize: 12.5, color: colors.textFaint },
  likeCountActive: { color: colors.urgentToday },
});
