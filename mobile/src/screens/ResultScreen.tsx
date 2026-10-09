import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButton, StatTile } from "../components/ui";
import { colors, font, radius } from "../theme";
import { RecipePlan } from "../types";

interface Props {
  recipe: RecipePlan | null;
  loading: boolean;
  error: string | null;
  stats: { used: number; atRisk: number; missingTotal: number } | null;
  onRetry: () => void;
  onBack: () => void;
  onGoBudget: () => void;
  onGoRecipe: () => void;
}

export default function ResultScreen({ recipe, loading, error, stats, onRetry, onBack, onGoBudget, onGoRecipe }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>finished dish photo</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sheet}>
        {loading && (
          <View style={styles.statusBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.eyebrow}>Deciding dinner</Text>
            <Text style={styles.statusText}>Looking at what's about to go and picking one dish that catches the most of it…</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.statusBox}>
            <Text style={styles.errorText}>{error}</Text>
            <PrimaryButton label="Try again" onPress={onRetry} style={{ alignSelf: "stretch" }} />
          </View>
        )}

        {recipe && stats && !loading && (
          <>
            <Text style={styles.eyebrow}>Tonight, decided</Text>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.body}>{recipe.why}</Text>

            <View style={styles.statRow}>
              <StatTile value={String(recipe.minutes)} label="minutes" />
              <StatTile value={`${stats.used}/${stats.atRisk}`} label="used up" />
              {recipe.missing.length > 0 ? (
                <StatTile value={`$${stats.missingTotal.toFixed(2)}`} label="to finish" onPress={onGoBudget} />
              ) : (
                <StatTile value="$0" label="to buy" />
              )}
            </View>

            <PrimaryButton label="Start cooking" onPress={onGoRecipe} style={{ marginBottom: 18 }} />

            {recipe.alternates.length > 0 && (
              <>
                <View style={styles.altHeader}>
                  <Text style={styles.altHeaderLabel}>Not feeling it?</Text>
                  <Text style={styles.altHeaderLink}>{recipe.alternates.length} others</Text>
                </View>
                <View style={styles.altRow}>
                  {recipe.alternates.map((alt) => (
                    <View key={alt.title} style={styles.altCard}>
                      <Text style={styles.altTitle}>{alt.title}</Text>
                      <Text style={styles.altMeta}>{alt.meta}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background },
  hero: {
    height: 210, backgroundColor: colors.skeleton,
    alignItems: "center", justifyContent: "center",
  },
  heroLabel: { fontFamily: font.medium, fontSize: 11.5, color: "#5E665F" },
  backBtn: {
    position: "absolute", left: 16, top: 12, width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center",
  },
  backBtnText: { fontSize: 16 },
  sheet: {
    padding: 22, marginTop: -26, backgroundColor: colors.background, minHeight: 360,
    borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl,
  },
  statusBox: { alignItems: "center", gap: 12, paddingVertical: 20 },
  statusText: { fontFamily: font.regular, fontSize: 14, lineHeight: 21, color: colors.textMuted, textAlign: "center" },
  errorText: { fontFamily: font.medium, fontSize: 14, lineHeight: 21, color: colors.urgentToday, textAlign: "center" },
  eyebrow: {
    fontFamily: font.medium, fontSize: 11, letterSpacing: 1.3, textTransform: "uppercase",
    color: colors.primary, marginBottom: 8,
  },
  title: { fontFamily: font.bold, fontSize: 27, lineHeight: 31, letterSpacing: -0.5, color: colors.text, marginBottom: 11 },
  body: { fontFamily: font.regular, fontSize: 14.5, lineHeight: 22, color: colors.textMuted, marginBottom: 18 },
  statRow: { flexDirection: "row", gap: 9, marginBottom: 18 },
  altHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  altHeaderLabel: { fontFamily: font.medium, fontSize: 13, color: colors.textMuted },
  altHeaderLink: { fontFamily: font.medium, fontSize: 13, color: colors.primary },
  altRow: { flexDirection: "row", gap: 10 },
  altCard: {
    flex: 1, backgroundColor: colors.card, borderRadius: radius.sm, padding: 13,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  altTitle: { fontFamily: font.semibold, fontSize: 14, color: colors.text, marginBottom: 2 },
  altMeta: { fontFamily: font.regular, fontSize: 12, color: colors.textMuted },
});
