import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButton, ProgressBar } from "../components/ui";
import { colors, font, radius } from "../theme";
import { RecipePlan } from "../types";

interface Props {
  recipe: RecipePlan;
  leftovers: string[];
  monthSavedLabel: string;
  monthPct: number;
  onBackHome: () => void;
  onShare: () => void;
  hasShared: boolean;
}

export default function CookedScreen({ recipe, leftovers, monthSavedLabel, monthPct, onBackHome, onShare, hasShared }: Props) {
  const cleared = recipe.uses.filter((u) => !u.leftoverQty).map((u) => u.pantryName.toLowerCase());
  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      <View style={styles.top}>
        <Text style={styles.eyebrow}>Nothing binned tonight</Text>
        <Text style={styles.amount}>{`+$${recipe.rescuedValue.toFixed(2)}`}</Text>
        <Text style={styles.line}>That's {recipe.uses.length} ingredient{recipe.uses.length === 1 ? "" : "s"} rescued and one dinner you didn't have to think about.</Text>

        <View style={styles.monthCard}>
          <View style={styles.monthRow}>
            <Text style={styles.monthLabel}>This month</Text>
            <Text style={styles.monthValue}>{monthSavedLabel}</Text>
          </View>
          <ProgressBar pct={monthPct} trackColor="rgba(255,255,255,0.2)" fillColor={colors.accentLime} />
        </View>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>Kitchen list updated</Text>
        <Text style={styles.sheetSubtitle}>
          {cleared.length > 0 ? `${cleared.join(", ")} cleared. ` : ""}
          {leftovers.length > 0
            ? `${leftovers.length} leftover${leftovers.length === 1 ? "" : "s"} logged for tomorrow.`
            : "Nothing left over."}
        </Text>

        <View style={styles.leftoverRow}>
          {leftovers.map((item) => (
            <View key={item} style={styles.leftoverChip}>
              <Text style={styles.leftoverChipText}>{item}</Text>
            </View>
          ))}
        </View>

        {recipe.nextMeal && (
          <View style={styles.mealRow}>
            <View style={styles.mealBadge}>
              <Text style={styles.mealBadgeText}>NEXT</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealTitle}>{recipe.nextMeal.title}</Text>
              <Text style={styles.mealMeta}>{recipe.nextMeal.meta}</Text>
            </View>
          </View>
        )}

        <View style={styles.upsellRow}>
          <View style={styles.upsellBadge}>
            <Text style={styles.upsellBadgeText}>THU</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mealTitle}>Unlock the full week</Text>
            <Text style={styles.mealMeta}>Meal chaining is part of Scrapster+</Text>
          </View>
        </View>

        {hasShared ? (
          <View style={styles.sharedRow}>
            <Text style={styles.sharedRowText}>✓ Shared to the community feed</Text>
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.8} style={styles.shareButton} onPress={onShare}>
            <Text style={styles.shareButtonText}>Share to community</Text>
          </TouchableOpacity>
        )}

        <PrimaryButton label="Back home" onPress={onBackHome} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.primary },
  top: { padding: 22, paddingTop: 40 },
  eyebrow: {
    fontFamily: font.medium, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase",
    color: colors.onPrimaryMuted, marginBottom: 12,
  },
  amount: { fontFamily: font.bold, fontSize: 54, lineHeight: 52, letterSpacing: -1.2, color: colors.onPrimary, marginBottom: 9 },
  line: { fontFamily: font.regular, fontSize: 14.5, lineHeight: 22, color: colors.onPrimaryMuted, marginBottom: 20 },
  monthCard: { backgroundColor: "rgba(255,255,255,0.13)", borderRadius: radius.md, padding: 16, marginBottom: 18 },
  monthRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 7 },
  monthLabel: { fontFamily: font.regular, fontSize: 13.5, color: colors.onPrimaryMuted },
  monthValue: { fontFamily: font.bold, fontSize: 13.5, color: colors.onPrimary },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, padding: 22 },
  sheetTitle: { fontFamily: font.bold, fontSize: 17, color: colors.text, marginBottom: 3 },
  sheetSubtitle: { fontFamily: font.regular, fontSize: 12.5, lineHeight: 18, color: colors.textMuted, marginBottom: 12 },
  leftoverRow: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 18 },
  leftoverChip: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20,
  },
  leftoverChipText: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  mealRow: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: 14, flexDirection: "row",
    gap: 12, alignItems: "center", marginBottom: 10,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  mealBadge: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: colors.primaryTint,
    alignItems: "center", justifyContent: "center",
  },
  mealBadgeText: { fontFamily: font.bold, fontSize: 11.5, color: colors.primary },
  mealTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  mealMeta: { fontFamily: font.regular, fontSize: 12.5, color: colors.textMuted, marginTop: 1 },
  upsellRow: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderStyle: "dashed",
    borderRadius: radius.md, padding: 14, flexDirection: "row", gap: 12, alignItems: "center",
    opacity: 0.8, marginBottom: 16,
  },
  upsellBadge: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: "#F1EFE6",
    alignItems: "center", justifyContent: "center",
  },
  upsellBadgeText: { fontFamily: font.bold, fontSize: 11.5, color: colors.amberLabel },
  shareButton: {
    borderWidth: 1, borderColor: colors.primary, borderRadius: radius.sm,
    alignItems: "center", paddingVertical: 15, marginBottom: 10,
  },
  shareButtonText: { fontFamily: font.semibold, fontSize: 14.5, color: colors.primary },
  sharedRow: { alignItems: "center", paddingVertical: 15, marginBottom: 10 },
  sharedRowText: { fontFamily: font.medium, fontSize: 13.5, color: colors.primary },
});
