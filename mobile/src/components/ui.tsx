import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { colors, font, radius } from "../theme";

export function Card({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
}) {
  const content = (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
  if (!onPress) return content;
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
}

export function PrimaryButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[styles.primaryButton, style]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function TextButton({
  label,
  onPress,
  color = colors.primary,
}: {
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Text style={{ fontFamily: font.medium, fontSize: 13, color }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Pill({
  label,
  bg,
  fg,
  border,
  onPress,
}: {
  label: string;
  bg: string;
  fg: string;
  border?: string;
  onPress?: () => void;
}) {
  const content = (
    <View
      style={[
        styles.pill,
        { backgroundColor: bg, borderColor: border ?? "transparent", borderWidth: border ? 1 : 0 },
      ]}
    >
      <Text style={{ fontFamily: font.medium, fontSize: 12.5, color: fg }}>{label}</Text>
    </View>
  );
  if (!onPress) return content;
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
}

export function SectionLabel({ children, color = colors.textFaint }: { children: ReactNode; color?: string }) {
  return <Text style={[styles.sectionLabel, { color }]}>{children}</Text>;
}

export function StatTile({
  value,
  label,
  onPress,
}: {
  value: string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Card style={styles.statTile} onPress={onPress}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

export function ProgressBar({ pct, trackColor, fillColor }: { pct: number; trackColor: string; fillColor: string }) {
  return (
    <View style={[styles.progressTrack, { backgroundColor: trackColor }]}>
      <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: fillColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 15,
    shadowColor: "#14171A",
    shadowOpacity: 0.07,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: colors.onPrimary,
    fontFamily: font.bold,
    fontSize: 15.5,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  sectionLabel: {
    fontFamily: font.medium,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  statTile: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  statValue: {
    fontFamily: font.bold,
    fontSize: 17,
    color: colors.text,
  },
  statLabel: {
    fontFamily: font.regular,
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
});
