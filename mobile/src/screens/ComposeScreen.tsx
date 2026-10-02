import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, font, radius } from "../theme";
import { ComposePickRow } from "../types/pantry";

interface Props {
  dish: string;
  onDishChange: (text: string) => void;
  caption: string;
  onCaptionChange: (text: string) => void;
  pickRows: ComposePickRow[];
  savedPreview: string;
  canSubmit: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ComposeScreen({
  dish,
  onDishChange,
  caption,
  onCaptionChange,
  pickRows,
  savedPreview,
  canSubmit,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancel}>← Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerRight}>New post</Text>
        </View>

        <Text style={styles.title}>Share what you made</Text>
        <Text style={styles.subtitle}>Show people what a fridge of odds and ends can turn into.</Text>

        <TouchableOpacity activeOpacity={0.8} style={styles.photoSlot}>
          <View style={styles.photoPlus}>
            <Text style={styles.photoPlusText}>+</Text>
          </View>
          <Text style={styles.photoSlotLabel}>Add a photo of the dish</Text>
        </TouchableOpacity>

        <Text style={styles.fieldLabel}>What's it called?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Fridge-clean-out fried rice"
          placeholderTextColor={colors.textFaint}
          value={dish}
          onChangeText={onDishChange}
        />

        <View style={styles.pickHeaderRow}>
          <Text style={styles.fieldLabel}>What did you rescue?</Text>
          <Text style={styles.pickHeaderSub}>from your kitchen</Text>
        </View>
        <View style={styles.pickWrap}>
          {pickRows.map((p) => (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.7}
              onPress={p.toggle}
              style={[
                styles.pickChip,
                { backgroundColor: p.on ? colors.primary : colors.card, borderColor: p.on ? colors.primary : colors.border },
              ]}
            >
              <Text style={{ fontFamily: font.medium, fontSize: 13, color: p.on ? colors.onPrimary : colors.text }}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>
          Anything to add? <Text style={styles.optional}>optional</Text>
        </Text>
        <TextInput
          style={styles.textarea}
          placeholder="A tip, a swap, how it turned out…"
          placeholderTextColor={colors.textFaint}
          value={caption}
          onChangeText={onCaptionChange}
          multiline
          numberOfLines={3}
        />

        <View style={styles.savedPreviewRow}>
          <Text style={styles.savedPreviewLabel}>Shows on your post as</Text>
          <Text style={styles.savedPreviewValue}>{savedPreview}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[styles.submitButton, { opacity: canSubmit ? 1 : 0.45 }]}
        >
          <Text style={styles.submitButtonText}>Post to community</Text>
        </TouchableOpacity>
        {!canSubmit && <Text style={styles.needsNameHint}>Give your dish a name to post it.</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  cancel: { fontFamily: font.medium, fontSize: 13, color: colors.primary },
  headerRight: { fontFamily: font.medium, fontSize: 12.5, color: colors.textMuted },
  title: { fontFamily: font.bold, fontSize: 25, lineHeight: 29, letterSpacing: -0.4, color: colors.text, marginBottom: 6 },
  subtitle: { fontFamily: font.regular, fontSize: 13.5, lineHeight: 20, color: colors.textMuted, marginBottom: 16 },
  photoSlot: {
    height: 150, borderRadius: radius.md, backgroundColor: colors.skeletonDish,
    borderWidth: 1.5, borderColor: colors.dash, borderStyle: "dashed",
    alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 16,
  },
  photoPlus: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center", justifyContent: "center",
  },
  photoPlusText: { fontSize: 20, fontFamily: font.semibold, color: colors.primary },
  photoSlotLabel: { fontFamily: font.medium, fontSize: 12, color: "#5E665F" },
  fieldLabel: { fontFamily: font.bold, fontSize: 14.5, color: colors.text, marginBottom: 8 },
  optional: { fontFamily: font.regular, color: colors.textFaint },
  input: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    paddingHorizontal: 15, paddingVertical: 14, fontFamily: font.regular, fontSize: 15, color: colors.text,
    marginBottom: 16,
  },
  pickHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 },
  pickHeaderSub: { fontFamily: font.medium, fontSize: 12, color: colors.textMuted },
  pickWrap: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 16 },
  pickChip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  textarea: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    paddingHorizontal: 15, paddingVertical: 13, fontFamily: font.regular, fontSize: 14.5, color: colors.text,
    minHeight: 80, textAlignVertical: "top", marginBottom: 14,
  },
  savedPreviewRow: {
    backgroundColor: colors.primaryTint, borderRadius: radius.sm, padding: 15,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14,
  },
  savedPreviewLabel: { fontFamily: font.regular, fontSize: 13, color: colors.primaryTintText },
  savedPreviewValue: { fontFamily: font.bold, fontSize: 14, color: colors.primary },
  submitButton: { backgroundColor: colors.primary, borderRadius: radius.sm, alignItems: "center", paddingVertical: 16 },
  submitButtonText: { fontFamily: font.bold, fontSize: 15.5, color: colors.onPrimary },
  needsNameHint: { textAlign: "center", fontFamily: font.regular, fontSize: 12, color: colors.textFaint, marginTop: 10 },
});
