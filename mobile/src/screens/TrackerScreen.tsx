import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, ProgressBar, StatTile } from "../components/ui";
import { colors, font, radius } from "../theme";
import { MONTHLY_SAVINGS_BARS, RESCUE_CATEGORIES } from "../data/demoRecipe";

const MAX_BAR = Math.max(...MONTHLY_SAVINGS_BARS.map(([, v]) => v));

export default function TrackerScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your scraps, counted</Text>

      <View style={styles.savedCard}>
        <Text style={styles.savedLabel}>Saved since you started</Text>
        <Text style={styles.savedAmount}>$212.80</Text>
        <View style={styles.barsRow}>
          {MONTHLY_SAVINGS_BARS.map(([label, v], i) => {
            const isLast = i === MONTHLY_SAVINGS_BARS.length - 1;
            const h = Math.round((v / MAX_BAR) * 48) + 6;
            return (
              <View key={label} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      { height: h, backgroundColor: isLast ? colors.accentLime : "rgba(188,229,210,0.55)" },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.statRow}>
        <StatTile value="63" label="items rescued" />
        <StatTile value="9h" label="not spent deciding" />
      </View>

      <Card style={styles.categoryCard}>
        <Text style={styles.categoryTitle}>What you keep rescuing</Text>
        <View style={{ gap: 10 }}>
          {RESCUE_CATEGORIES.map((cat) => (
            <View key={cat.label} style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <View style={{ flex: 1 }}>
                <ProgressBar pct={cat.pct} trackColor={colors.primaryTint} fillColor={colors.primary} />
              </View>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.insightText}>
          You buy spinach faster than you eat it. Try the half-bag — you'd have kept about{" "}
          <Text style={{ fontFamily: font.bold }}>$14</Text> last month.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  title: { fontFamily: font.bold, fontSize: 26, lineHeight: 30, letterSpacing: -0.4, color: colors.text, marginBottom: 16 },
  savedCard: { backgroundColor: colors.primary, borderRadius: radius.xl, padding: 19, marginBottom: 12 },
  savedLabel: { fontFamily: font.medium, fontSize: 12, color: colors.onPrimaryMuted, marginBottom: 5 },
  savedAmount: { fontFamily: font.bold, fontSize: 44, letterSpacing: -0.9, color: colors.onPrimary, marginBottom: 15 },
  barsRow: { flexDirection: "row", alignItems: "flex-end", gap: 6, height: 66 },
  barCol: { flex: 1, alignItems: "center", justifyContent: "flex-end", gap: 6, height: "100%" },
  barTrack: { width: "100%", justifyContent: "flex-end", flex: 1 },
  bar: { width: "100%", borderRadius: 5 },
  barLabel: { fontFamily: font.medium, fontSize: 9.5, color: colors.onPrimaryMuted },
  statRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  categoryCard: { marginBottom: 12 },
  categoryTitle: { fontFamily: font.bold, fontSize: 15, color: colors.text, marginBottom: 10 },
  categoryRow: { flexDirection: "row", alignItems: "center", gap: 11 },
  categoryLabel: { width: 74, fontFamily: font.regular, fontSize: 13, color: colors.textMuted },
  insightText: { fontFamily: font.regular, fontSize: 13.5, lineHeight: 20, color: colors.primaryTintText },
});
