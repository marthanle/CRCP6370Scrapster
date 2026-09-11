import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnalyzeResponse } from "../types";

interface Props {
  result: AnalyzeResponse;
  onStartOver: () => void;
}

const urgencyColor: Record<string, string> = {
  high: "#c62828",
  medium: "#ef6c00",
  low: "#2e7d32",
};

export default function ResultScreen({ result, onStartOver }: Props) {
  const { ingredients, recipe } = result;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.servings}>Serves {recipe.servings}</Text>

      <Text style={styles.sectionHeader}>Your ingredients</Text>
      <View style={styles.tagRow}>
        {ingredients.map((ing) => (
          <View
            key={ing.name}
            style={[styles.tag, { borderColor: urgencyColor[ing.urgency] }]}
          >
            <Text style={{ color: urgencyColor[ing.urgency] }}>
              {ing.name}
            </Text>
          </View>
        ))}
      </View>

      {recipe.missingIngredients.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>You'll also need</Text>
          <Text style={styles.missingList}>
            {recipe.missingIngredients.join(", ")}
          </Text>
        </>
      )}

      <Text style={styles.sectionHeader}>Steps</Text>
      {recipe.steps.map((step, i) => (
        <View key={i} style={styles.stepRow}>
          <Text style={styles.stepNumber}>{i + 1}</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.startOverButton} onPress={onStartOver}>
        <Text style={styles.startOverText}>Start over</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 72,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "700" },
  servings: { fontSize: 14, color: "#888", marginTop: 4, marginBottom: 20 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  missingList: { fontSize: 15, color: "#333" },
  stepRow: { flexDirection: "row", marginBottom: 12 },
  stepNumber: {
    fontWeight: "700",
    marginRight: 10,
    color: "#2e7d32",
  },
  stepText: { flex: 1, fontSize: 15, lineHeight: 21 },
  startOverButton: {
    marginTop: 32,
    alignItems: "center",
    paddingVertical: 14,
  },
  startOverText: { color: "#2e7d32", fontWeight: "600" },
});
