import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import InputScreen from "./src/screens/InputScreen";
import ResultScreen from "./src/screens/ResultScreen";
import { AnalyzeResponse } from "./src/types";

export default function App() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      {result ? (
        <ResultScreen result={result} onStartOver={() => setResult(null)} />
      ) : (
        <InputScreen onResult={setResult} />
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
