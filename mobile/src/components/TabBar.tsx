import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, font } from "../theme";

interface Props {
  active: "home" | "scan" | "pantry" | "saved" | undefined;
  onHome: () => void;
  onScan: () => void;
  onPantry: () => void;
  onSaved: () => void;
}

const TABS: Array<{ key: NonNullable<Props["active"]>; icon: string; label: string }> = [
  { key: "home", icon: "◱", label: "Home" },
  { key: "scan", icon: "◉", label: "Add" },
  { key: "pantry", icon: "☰", label: "Kitchen" },
  { key: "saved", icon: "$", label: "Saved" },
];

export function TabBar({ active, onHome, onScan, onPantry, onSaved }: Props) {
  const handlers: Record<NonNullable<Props["active"]>, () => void> = {
    home: onHome,
    scan: onScan,
    pantry: onPantry,
    saved: onSaved,
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const color = isActive ? colors.primary : colors.textSubtle;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={handlers[tab.key]}
          >
            <Text style={[styles.icon, { color }]}>{tab.icon}</Text>
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 10,
    backgroundColor: "rgba(246,247,244,0.97)",
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
  },
  icon: { fontSize: 17, lineHeight: 20 },
  label: { fontFamily: font.medium, fontSize: 10.5 },
});
