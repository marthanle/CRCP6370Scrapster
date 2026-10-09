import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Pill, PrimaryButton, TextButton } from "../components/ui";
import { colors, font } from "../theme";

interface Props {
  diets: Array<{ label: string; on: boolean }>;
  onToggleDiet: (label: string) => void;
  allergies: string;
  onAllergiesChange: (text: string) => void;
  onContinue: () => void;
  onSkip: () => void;
}

export default function DietScreen({ diets, onToggleDiet, allergies, onAllergiesChange, onContinue, onSkip }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressRow}>
        <View style={[styles.progressSeg, { backgroundColor: colors.primary }]} />
        <View style={[styles.progressSeg, { backgroundColor: colors.border }]} />
      </View>

      <Text style={styles.title}>Anything you don't eat?</Text>
      <Text style={styles.subtitle}>
        We'll never suggest it. Change it any time in Settings.
      </Text>

      <View style={styles.chipWrap}>
        {diets.map((d) => (
          <Pill
            key={d.label}
            label={d.label}
            bg={d.on ? colors.primary : colors.card}
            fg={d.on ? colors.onPrimary : colors.text}
            border={d.on ? colors.primary : colors.border}
            onPress={() => onToggleDiet(d.label)}
          />
        ))}
      </View>

      <Text style={styles.fieldTitle}>Allergies</Text>
      <TextInput
        style={styles.allergyField}
        placeholder="Peanuts, shellfish…"
        placeholderTextColor={colors.textFaint}
        value={allergies}
        onChangeText={onAllergiesChange}
        autoCapitalize="none"
      />
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Allergies are hard filters — anything listed here is never suggested, even from a photo match.
        </Text>
      </View>

      <PrimaryButton label="Continue" onPress={onContinue} style={{ marginBottom: 12 }} />
      <View style={{ alignItems: "center" }}>
        <TextButton label="Skip for now" onPress={onSkip} color={colors.textFaint} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 24,
  },
  progressRow: { flexDirection: "row", gap: 6, marginBottom: 22 },
  progressSeg: { flex: 1, height: 4, borderRadius: 2 },
  title: {
    fontFamily: font.bold,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.4,
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: font.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
    marginBottom: 20,
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 26 },
  fieldTitle: { fontFamily: font.bold, fontSize: 16, color: colors.text, marginBottom: 10 },
  allergyField: {
    backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 15, paddingVertical: 14,
    fontFamily: font.regular, fontSize: 15, color: colors.text, marginBottom: 11,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  notice: {
    backgroundColor: colors.amberBg,
    borderWidth: 1,
    borderColor: colors.amberBorder,
    borderRadius: 14,
    padding: 13,
    marginBottom: 24,
  },
  noticeText: {
    fontFamily: font.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.amberTextSoft,
  },
});
