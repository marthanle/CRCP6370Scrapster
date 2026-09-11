import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton, TextButton } from "../components/ui";
import { colors, font, radius } from "../theme";
import { DEMO_RECIPE } from "../data/demoRecipe";

interface Props {
  onBack: () => void;
  onSkipAndCook: () => void;
}

export default function BudgetScreen({ onBack, onSkipAndCook }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextButton label="← Back" onPress={onBack} />
      <Text style={styles.title}>Budget mode</Text>
      <Text style={styles.subtitle}>
        One {DEMO_RECIPE.missingIngredient.name} stands between you and dinner. Cheapest way to get
        it — or skip it.
      </Text>

      <View style={{ gap: 9, marginBottom: 18 }}>
        {DEMO_RECIPE.budgetOptions.map((opt) => (
          <View key={opt.name} style={[styles.option, opt.best && styles.optionBest]}>
            <View style={styles.optionHeader}>
              <Text style={[styles.optionName, opt.best && styles.optionNameBest]}>{opt.name}</Text>
              <Text style={[styles.optionPrice, opt.best && styles.optionPriceBest]}>{opt.price}</Text>
            </View>
            <Text style={styles.optionMeta}>{opt.meta}</Text>
          </View>
        ))}
      </View>

      <View style={styles.altBox}>
        <Text style={styles.altTitle}>Or buy nothing</Text>
        <Text style={styles.altBody}>A splash of any vinegar works. Slightly less bright, still dinner.</Text>
      </View>

      <PrimaryButton label="Skip it, cook anyway" onPress={onSkipAndCook} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  title: { fontFamily: font.bold, fontSize: 26, lineHeight: 30, letterSpacing: -0.4, color: colors.text, marginTop: 12, marginBottom: 6 },
  subtitle: { fontFamily: font.regular, fontSize: 14, lineHeight: 21, color: colors.textMuted, marginBottom: 18 },
  option: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: 14,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  optionBest: { borderWidth: 2, borderColor: colors.primary, shadowOpacity: 0 },
  optionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 },
  optionName: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  optionNameBest: { fontFamily: font.bold, fontSize: 15.5 },
  optionPrice: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  optionPriceBest: { fontFamily: font.bold, fontSize: 15.5, color: colors.primary },
  optionMeta: { fontFamily: font.regular, fontSize: 12.5, color: colors.textMuted },
  altBox: { backgroundColor: colors.primaryTint, borderRadius: radius.md, padding: 16, marginBottom: 18 },
  altTitle: { fontFamily: font.bold, fontSize: 14.5, color: colors.primary, marginBottom: 5 },
  altBody: { fontFamily: font.regular, fontSize: 13.5, lineHeight: 20, color: colors.primaryTintText },
});
