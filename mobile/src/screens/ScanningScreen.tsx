import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors, font } from "../theme";
import { ScanSourceData } from "../types/pantry";

interface Props {
  source: ScanSourceData;
  pantryCount: number;
}

export default function ScanningScreen({ source, pantryCount }: Props) {
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [sweep]);

  const translateY = sweep.interpolate({ inputRange: [0, 1], outputRange: [-120, 310] });

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <View style={styles.checkerBg} />
        <Animated.View style={[styles.sweep, { transform: [{ translateY }] }]} />
        <View style={styles.focusBox} />
        <View style={styles.hintChip}>
          <Text style={styles.hintText}>{source.hint}</Text>
        </View>
        <View style={styles.dashedBox} />
      </View>

      <Text style={styles.title}>{source.title}</Text>

      <View style={{ gap: 11 }}>
        <View style={styles.stepRow}>
          <Text style={styles.checkMark}>✓</Text>
          <Text style={styles.stepText}>{source.step1}</Text>
        </View>
        <View style={styles.stepRow}>
          <Text style={styles.checkMark}>✓</Text>
          <Text style={styles.stepText}>
            Checking against the {pantryCount} things I already knew about
          </Text>
        </View>
        <View style={styles.stepRow}>
          <Text style={styles.pendingMark}>○</Text>
          <Text style={[styles.stepText, { color: colors.textFaint }]}>
            Flagging anything that looks like a duplicate
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  frame: {
    position: "relative", borderRadius: 22, overflow: "hidden",
    height: 310, marginBottom: 22, borderWidth: 1, borderColor: colors.borderSoft,
  },
  checkerBg: { ...StyleSheet.absoluteFill, backgroundColor: colors.skeleton },
  sweep: {
    position: "absolute", left: 0, right: 0, height: 120,
    backgroundColor: "rgba(31,111,78,0.28)",
  },
  focusBox: {
    position: "absolute", left: 34, top: 54, width: 106, height: 76,
    borderWidth: 2, borderColor: "#fff", borderRadius: 10,
  },
  hintChip: {
    position: "absolute", left: 34, top: 136, backgroundColor: "#fff",
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  hintText: { fontFamily: font.semibold, fontSize: 10.5, color: colors.primary },
  dashedBox: {
    position: "absolute", right: 36, top: 156, width: 94, height: 88,
    borderWidth: 2, borderColor: "#fff", borderStyle: "dashed", borderRadius: 10,
  },
  title: {
    fontFamily: font.bold, fontSize: 23, letterSpacing: -0.35, color: colors.text, marginBottom: 14,
  },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkMark: { color: colors.primary, fontSize: 14.5 },
  pendingMark: { color: colors.textFaint, fontSize: 14.5 },
  stepText: { fontFamily: font.regular, fontSize: 14.5, color: colors.text, flex: 1 },
});
