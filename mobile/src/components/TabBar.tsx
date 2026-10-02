import { ComponentType } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, font } from "../theme";
import { FeedIcon, HomeIcon, KitchenIcon, SavedIcon, ScanIcon } from "./icons";

interface Props {
  active: "home" | "scan" | "pantry" | "saved" | "community" | undefined;
  onHome: () => void;
  onScan: () => void;
  onPantry: () => void;
  onSaved: () => void;
  onCommunity: () => void;
}

const TABS: Array<{
  key: NonNullable<Props["active"]>;
  Icon: ComponentType<{ color: string; size?: number }>;
  label: string;
}> = [
  { key: "home", Icon: HomeIcon, label: "Home" },
  { key: "scan", Icon: ScanIcon, label: "Add" },
  { key: "pantry", Icon: KitchenIcon, label: "Kitchen" },
  { key: "community", Icon: FeedIcon, label: "Feed" },
  { key: "saved", Icon: SavedIcon, label: "Saved" },
];

export function TabBar({ active, onHome, onScan, onPantry, onSaved, onCommunity }: Props) {
  const handlers: Record<NonNullable<Props["active"]>, () => void> = {
    home: onHome,
    scan: onScan,
    pantry: onPantry,
    saved: onSaved,
    community: onCommunity,
  };

  return (
    <View style={styles.container}>
      {TABS.map(({ key, Icon, label }) => {
        const isActive = active === key;
        const color = isActive ? colors.primary : colors.tabInactive;
        return (
          <TouchableOpacity key={key} style={styles.tab} activeOpacity={0.7} onPress={handlers[key]}>
            <Icon color={color} size={24} />
            <Text style={[styles.label, { color }]}>{label}</Text>
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
    backgroundColor: "rgba(246,247,244,0.94)",
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    paddingVertical: 4,
  },
  label: { fontFamily: font.medium, fontSize: 10.5 },
});
