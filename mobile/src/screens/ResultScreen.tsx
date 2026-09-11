import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButton, StatTile } from "../components/ui";
import { colors, font, radius } from "../theme";
import { DEMO_RECIPE } from "../data/demoRecipe";

interface Props {
  onBack: () => void;
  onGoBudget: () => void;
  onGoRecipe: () => void;
}

export default function ResultScreen({ onBack, onGoBudget, onGoRecipe }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>finished dish photo</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.eyebrow}>Tonight, decided</Text>
        <Text style={styles.title}>{DEMO_RECIPE.title}</Text>
        <Text style={styles.body}>{DEMO_RECIPE.usesLine}</Text>

        <View style={styles.statRow}>
          <StatTile value={String(DEMO_RECIPE.minutes)} label="minutes" />
          <StatTile value={DEMO_RECIPE.usedUp} label="used up" />
          <StatTile
            value={DEMO_RECIPE.missingIngredient.price}
            label="to finish"
            onPress={onGoBudget}
          />
        </View>

        <PrimaryButton label="Start cooking" onPress={onGoRecipe} style={{ marginBottom: 18 }} />

        <View style={styles.altHeader}>
          <Text style={styles.altHeaderLabel}>Not feeling it?</Text>
          <Text style={styles.altHeaderLink}>{DEMO_RECIPE.alternates.length} others ⌄</Text>
        </View>
        <View style={styles.altRow}>
          {DEMO_RECIPE.alternates.map((alt) => (
            <View key={alt.title} style={styles.altCard}>
              <Text style={styles.altTitle}>{alt.title}</Text>
              <Text style={styles.altMeta}>{alt.meta}</Text>
            </View>
          ))}
        </View>
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
    padding: 22, marginTop: -26, backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl,
  },
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
