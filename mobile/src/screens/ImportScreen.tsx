import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { PrimaryButton, TextButton } from "../components/ui";
import { colors, font, radius } from "../theme";

interface Props {
  loading: boolean;
  error: string | null;
  onSubmit: (url: string) => void;
  onCancel: () => void;
}

export default function ImportScreen({ loading, error, onSubmit, onCancel }: Props) {
  const [url, setUrl] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <TextButton label="← Cancel" onPress={onCancel} />
        <Text style={styles.title}>Import a recipe</Text>
        <Text style={styles.subtitle}>
          Paste a link to any recipe and I'll check it against your kitchen — what you already
          have, and what's left to buy.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="https://example.com/some-recipe"
          placeholderTextColor={colors.textFaint}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          editable={!loading}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <PrimaryButton
          label={loading ? "Reading the recipe…" : "Import"}
          onPress={() => url.trim() && onSubmit(url.trim())}
          style={loading ? styles.buttonLoading : undefined}
        />
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Fetching the page and reading the ingredients…</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  title: {
    fontFamily: font.bold, fontSize: 25, letterSpacing: -0.4, color: colors.text,
    marginTop: 12, marginBottom: 6,
  },
  subtitle: { fontFamily: font.regular, fontSize: 14, lineHeight: 21, color: colors.textMuted, marginBottom: 20 },
  input: {
    backgroundColor: colors.card, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, paddingVertical: 14, fontFamily: font.regular, fontSize: 15, color: colors.text,
    marginBottom: 16,
  },
  error: { fontFamily: font.regular, fontSize: 13, color: colors.urgentToday, marginBottom: 14 },
  buttonLoading: { opacity: 0.7 },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "center", marginTop: 14 },
  loadingText: { fontFamily: font.regular, fontSize: 12.5, color: colors.textMuted, flexShrink: 1 },
});
