import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButton, SectionLabel, TextButton } from "../components/ui";
import { colors, font, radius } from "../theme";
import { BookmarkIcon } from "../components/icons";
import { MatchedIngredient } from "../types/pantry";

interface OpenedRecipe {
  title: string;
  servings?: number;
  source?: string;
}

interface Props {
  recipe: OpenedRecipe;
  haveIngredients: MatchedIngredient[];
  needIngredients: MatchedIngredient[];
  backLabel: string;
  canSave: boolean;
  isSaved: boolean;
  showSeeAllSaved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onSeeAllSaved: () => void;
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
  backLabel,
  canSave,
  isSaved,
  showSeeAllSaved,
  onBack,
  onToggleSave,
  onSeeAllSaved,
  onDone,
}: Props) {
  const isEmpty = haveIngredients.length === 0 && needIngredients.length === 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextButton label={backLabel} onPress={onBack} />
      {recipe.source && <Text style={styles.sourceLabel}>{recipe.source}</Text>}
      <Text style={styles.title}>{recipe.title}</Text>
      {recipe.servings && <Text style={styles.servings}>Serves {recipe.servings}</Text>}

      {isEmpty ? (
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

      {canSave && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggleSave}
          style={[styles.saveButton, { backgroundColor: isSaved ? colors.primary : colors.card }]}
        >
          <BookmarkIcon color={isSaved ? colors.onPrimary : colors.primary} size={17} filled={isSaved} />
          <Text style={[styles.saveButtonText, { color: isSaved ? colors.onPrimary : colors.primary }]}>
            {isSaved ? "Saved to your recipes" : "Save recipe"}
          </Text>
        </TouchableOpacity>
      )}
      {showSeeAllSaved && (
        <TouchableOpacity onPress={onSeeAllSaved} style={{ marginBottom: 14 }}>
          <Text style={styles.seeAllLink}>See all saved recipes →</Text>
        </TouchableOpacity>
      )}

      <PrimaryButton label="Done" onPress={onDone} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  sourceLabel: {
    fontFamily: font.medium, fontSize: 11, letterSpacing: 1.1, textTransform: "uppercase",
    color: colors.textFaint, marginTop: 12, marginBottom: 6,
  },
  title: {
    fontFamily: font.bold, fontSize: 24, lineHeight: 29, letterSpacing: -0.4, color: colors.text,
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
  saveButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    borderWidth: 2, borderColor: colors.primary, borderRadius: radius.sm, paddingVertical: 14, marginBottom: 10,
  },
  saveButtonText: { fontFamily: font.bold, fontSize: 15 },
  seeAllLink: { textAlign: "center", fontFamily: font.medium, fontSize: 13, color: colors.primary },
});
