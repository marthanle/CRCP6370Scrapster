import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton, SectionLabel, TextButton } from "../components/ui";
import { colors, font, radius } from "../theme";
import { ImportedRecipe } from "../types";
import { MatchedIngredient } from "../types/pantry";

interface Props {
  recipe: ImportedRecipe;
  haveIngredients: MatchedIngredient[];
  needIngredients: MatchedIngredient[];
  onBack: () => void;
  onDone: () => void;
}

function IngredientRow({ item, have }: { item: MatchedIngredient; have: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowMark, { color: have ? colors.primary : colors.amberLabel }]}>
        {have ? "✓" : "+"}
      </Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowName}>
          {item.quantity ? `${item.quantity} ` : ""}
          {item.name}
        </Text>
        {have && item.matchedPantryName && (
          <Text style={styles.rowNote}>already have it as "{item.matchedPantryName}"</Text>
        )}
      </View>
    </View>
  );
}

export default function ImportResultScreen({
  recipe,
  haveIngredients,
  needIngredients,
  onBack,
  onDone,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextButton label="← Import another" onPress={onBack} />
      <Text style={styles.title}>{recipe.title}</Text>
      {recipe.servings && <Text style={styles.servings}>Serves {recipe.servings}</Text>}

      {recipe.ingredients.length === 0 ? (
        <View style={styles.emptyNotice}>
          <Text style={styles.emptyNoticeText}>
            I couldn't find an ingredient list on that page. Try a different link.
          </Text>
        </View>
      ) : (
        <>
          {needIngredients.length > 0 && (
            <>
              <SectionLabel color={colors.amberLabel}>
                Still need ({needIngredients.length})
              </SectionLabel>
              <View style={[styles.card, { marginBottom: 16 }]}>
                {needIngredients.map((item, i) => (
                  <View key={item.name} style={i < needIngredients.length - 1 && styles.rowDivider}>
                    <IngredientRow item={item} have={false} />
                  </View>
                ))}
              </View>
            </>
          )}

          {haveIngredients.length > 0 && (
            <>
              <SectionLabel color={colors.primary}>
                Already in your kitchen ({haveIngredients.length})
              </SectionLabel>
              <View style={[styles.card, { marginBottom: 20 }]}>
                {haveIngredients.map((item, i) => (
                  <View key={item.name} style={i < haveIngredients.length - 1 && styles.rowDivider}>
                    <IngredientRow item={item} have />
                  </View>
                ))}
              </View>
            </>
          )}
        </>
      )}

      <PrimaryButton label="Done" onPress={onDone} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  title: {
    fontFamily: font.bold, fontSize: 24, lineHeight: 29, letterSpacing: -0.4, color: colors.text,
    marginTop: 12,
  },
  servings: { fontFamily: font.regular, fontSize: 13, color: colors.textMuted, marginTop: 3, marginBottom: 18 },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, paddingHorizontal: 15,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 11, paddingVertical: 13 },
  rowMark: { fontFamily: font.bold, fontSize: 15, width: 16, textAlign: "center", marginTop: 1 },
  rowName: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  rowNote: { fontFamily: font.regular, fontSize: 11.5, color: colors.textFaint, marginTop: 2 },
  emptyNotice: {
    backgroundColor: colors.amberBg, borderWidth: 1, borderColor: colors.amberBorder,
    borderRadius: radius.md, padding: 15, marginBottom: 20,
  },
  emptyNoticeText: { fontFamily: font.regular, fontSize: 13.5, lineHeight: 20, color: colors.amberTextSoft },
});
