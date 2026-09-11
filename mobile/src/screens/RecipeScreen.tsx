import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pill, PrimaryButton } from "../components/ui";
import { colors, font, radius } from "../theme";
import { DEMO_RECIPE } from "../data/demoRecipe";

interface Props {
  doneMap: Record<number, boolean>;
  doneLabel: string;
  onToggleStep: (index: number) => void;
  onBack: () => void;
  onGoBudget: () => void;
  onMarkCooked: () => void;
}

export default function RecipeScreen({
  doneMap,
  doneLabel,
  onToggleStep,
  onBack,
  onGoBudget,
  onMarkCooked,
}: Props) {
  const firstOpen = DEMO_RECIPE.steps.findIndex((_, i) => !doneMap[i]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.doneLabel}>{doneLabel}</Text>
      </View>

      <Text style={styles.title}>{DEMO_RECIPE.title}</Text>

      <View style={styles.tagCard}>
        <Text style={styles.tagCardTitle}>Pulled from your kitchen list</Text>
        <View style={styles.tagWrap}>
          {DEMO_RECIPE.tags.map((tag) => (
            <Pill key={tag} label={tag} bg={colors.primaryTint} fg={colors.primary} />
          ))}
          <Pill
            label={`${DEMO_RECIPE.missingIngredient.name} · ${DEMO_RECIPE.missingIngredient.price}`}
            bg={colors.keepBg}
            fg={colors.amberLabel}
            onPress={onGoBudget}
          />
        </View>
      </View>

      <View style={{ gap: 9, marginBottom: 16 }}>
        {DEMO_RECIPE.steps.map((text, i) => {
          const on = !!doneMap[i];
          const isFirstOpen = i === firstOpen;
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              style={[
                styles.stepRow,
                { backgroundColor: on ? "#EFF4EE" : colors.card },
                isFirstOpen && styles.stepRowActive,
              ]}
              onPress={() => onToggleStep(i)}
            >
              <View style={[styles.stepDot, { backgroundColor: on ? colors.primary : colors.primaryTint }]}>
                <Text style={{ color: on ? colors.onPrimary : colors.primary, fontFamily: font.bold, fontSize: 11.5 }}>
                  {on ? "✓" : i + 1}
                </Text>
              </View>
              <Text style={[styles.stepText, { color: on ? "#6B7370" : colors.text }]}>{text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <PrimaryButton label="Mark as cooked" onPress={onMarkCooked} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  backText: { fontFamily: font.medium, fontSize: 15, color: colors.primary },
  doneLabel: { fontFamily: font.medium, fontSize: 12.5, color: colors.textMuted },
  title: { fontFamily: font.bold, fontSize: 22, lineHeight: 26, letterSpacing: -0.35, color: colors.text, marginBottom: 13 },
  tagCard: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: 15, marginBottom: 13,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  tagCardTitle: { fontFamily: font.bold, fontSize: 14, color: colors.text, marginBottom: 9 },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  stepRow: {
    flexDirection: "row", gap: 11, borderRadius: 14, padding: 13,
    borderWidth: 2, borderColor: "transparent", alignItems: "flex-start",
  },
  stepRowActive: { borderColor: colors.primary },
  stepDot: {
    width: 23, height: 23, borderRadius: 11.5, alignItems: "center", justifyContent: "center", marginTop: 1,
  },
  stepText: { fontFamily: font.regular, fontSize: 13.5, lineHeight: 20, flex: 1 },
});
