import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton, TextButton } from "../components/ui";
import { colors, font, radius } from "../theme";
import { RecipeMissing } from "../types";

interface Props {
  missing: RecipeMissing[];
  onBack: () => void;
  onSkipAndCook: () => void;
}

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function BudgetScreen({ missing, onBack, onSkipAndCook }: Props) {
  const total = missing.reduce((a, m) => a + m.estPrice, 0);
  const names = missing.map((m) => m.name).join(" and ");
  const options = [
    { name: "Dollar Market", price: money(total), meta: "4 min walk · open till 11", best: true },
    { name: "Campus Grocer", price: money(total * 2), meta: "In your building · meal-card accepted", best: false },
    { name: "Delivery", price: `${money(total * 1.85)} + fee`, meta: `25 min · not worth it for ${missing.length === 1 ? "one thing" : "this little"}`, best: false },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextButton label="← Back" onPress={onBack} />
      <Text style={styles.title}>Budget mode</Text>
      <Text style={styles.subtitle}>
        {names ? `${names.charAt(0).toUpperCase()}${names.slice(1)} ${missing.length === 1 ? "stands" : "stand"} between you and dinner. Cheapest way to get ${missing.length === 1 ? "it" : "them"} — or skip.` : "You have everything you need."}
      </Text>

      <View style={{ gap: 9, marginBottom: 12 }}>
        {options.map((opt) => (
          <View key={opt.name} style={[styles.option, opt.best && styles.optionBest]}>
            <View style={styles.optionHeader}>
              <Text style={[styles.optionName, opt.best && styles.optionNameBest]}>{opt.name}</Text>
              <Text style={[styles.optionPrice, opt.best && styles.optionPriceBest]}>{opt.price}</Text>
            </View>
            <Text style={styles.optionMeta}>{opt.meta}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.footnote}>Prices are estimates, not live store prices.</Text>

      <View style={styles.altBox}>
        <Text style={styles.altTitle}>Or buy nothing</Text>
        {missing.map((m) => (
          <Text key={m.name} style={styles.altBody}>
            {missing.length > 1 ? `${m.name}: ` : ""}{m.substitute || "Skip it — it'll still be dinner."}
          </Text>
        ))}
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
  footnote: { fontFamily: font.regular, fontSize: 11.5, color: colors.textFaint, marginBottom: 18 },
  altBox: { backgroundColor: colors.primaryTint, borderRadius: radius.md, padding: 16, marginBottom: 18, gap: 4 },
  altTitle: { fontFamily: font.bold, fontSize: 14.5, color: colors.primary, marginBottom: 1 },
  altBody: { fontFamily: font.regular, fontSize: 13.5, lineHeight: 20, color: colors.primaryTintText },
});
