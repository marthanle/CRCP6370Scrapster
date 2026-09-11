import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { analyzeIngredients } from "../api/client";
import { AnalyzeResponse } from "../types";

interface Props {
  onResult: (result: AnalyzeResponse) => void;
}

export default function InputScreen({ onResult }: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMediaType, setPhotoMediaType] = useState<string>("image/jpeg");
  const [ingredientList, setIngredientList] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library permission is required to add a photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setPhotoBase64(result.assets[0].base64 ?? null);
      setPhotoMediaType(result.assets[0].mimeType ?? "image/jpeg");
    }
  }

  async function handleSubmit() {
    if (!photoBase64 && !ingredientList.trim()) {
      setError("Add a photo or type a few ingredients first.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const result = await analyzeIngredients({
        photoBase64: photoBase64 ?? undefined,
        photoMediaType: photoBase64 ? photoMediaType : undefined,
        ingredientList: ingredientList.trim() || undefined,
      });
      onResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>What's in your kitchen?</Text>
      <Text style={styles.subtitle}>
        Snap a photo of your fridge/pantry, or type what you've got.
      </Text>

      <TouchableOpacity style={styles.photoButton} onPress={pickPhoto}>
        <Text style={styles.photoButtonText}>
          {photoUri ? "Change photo" : "Add a photo"}
        </Text>
      </TouchableOpacity>

      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      )}

      <Text style={styles.orText}>or</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. half an onion, leftover rice, spinach, two eggs"
        value={ingredientList}
        onChangeText={setIngredientList}
        multiline
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Find me a recipe</Text>
        )}
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
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#555", marginBottom: 24 },
  photoButton: {
    borderWidth: 1,
    borderColor: "#2e7d32",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  photoButtonText: { color: "#2e7d32", fontWeight: "600", fontSize: 16 },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 16,
  },
  orText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    minHeight: 100,
    fontSize: 15,
    textAlignVertical: "top",
  },
  error: { color: "#c62828", marginTop: 16 },
  submitButton: {
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
