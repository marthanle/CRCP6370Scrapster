import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PantryItem } from "../types/pantry";
import { band } from "../hooks/useScrapsterState";
import { PrimaryButton } from "../components/ui";
import { colors, font, radius } from "../theme";

interface Props {
  pantryCount: number;
  urgentItems: PantryItem[];
  soonItems: PantryItem[];
  keepItems: PantryItem[];
  onRemove: (id: number) => void;
  onCook: () => void;
}

function Row({ item, onRemove }: { item: PantryItem; onRemove: (id: number) => void }) {
  const b = band(item.days);
  const sub = [b.word, item.qty, item.note, item.src].filter(Boolean).join(" · ");
  return (
    <View style={styles.row}>
      <View style={[styles.rowBar, { backgroundColor: b.bar }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowName}>{item.name}</Text>
        <Text style={[styles.rowSub, { color: b.fg }]}>{sub}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.7} style={styles.removeBtn} onPress={() => onRemove(item.id)}>
        <Text style={styles.removeBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

function Group({
  label,
  color,
  items,
  onRemove,
}: {
  label: string;
  color: string;
  items: PantryItem[];
  onRemove: (id: number) => void;
}) {
  if (items.length === 0) return null;
  return (
    <>
      <Text style={[styles.groupLabel, { color }]}>{label}</Text>
      <View style={styles.groupCard}>
        {items.map((item, i) => (
          <View key={item.id} style={i < items.length - 1 && styles.rowDivider}>
            <Row item={item} onRemove={onRemove} />
          </View>
        ))}
      </View>
    </>
  );
}

export default function PantryScreen({
  pantryCount,
  urgentItems,
  soonItems,
  keepItems,
  onRemove,
  onCook,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Your kitchen</Text>
        <Text style={styles.countText}>{pantryCount} items</Text>
      </View>
      <Text style={styles.subtitle}>
        Everything I think you own, oldest first. Tap ✕ on anything you've finished or thrown out.
      </Text>

      <Group label="Use now" color={colors.urgentToday} items={urgentItems} onRemove={onRemove} />
      <Group label="This week" color={colors.amberLabel} items={soonItems} onRemove={onRemove} />
      <Group label="Keeps a while" color={colors.primary} items={keepItems} onRemove={onRemove} />

      <TouchableOpacity activeOpacity={0.85} style={styles.addByHand}>
        <Text style={styles.addByHandText}>+ Add an ingredient by hand</Text>
      </TouchableOpacity>

      <PrimaryButton label="Cook from this list" onPress={onCook} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 },
  title: { fontFamily: font.bold, fontSize: 25, letterSpacing: -0.4, color: colors.text },
  countText: { fontFamily: font.medium, fontSize: 12.5, color: colors.textMuted },
  subtitle: { fontFamily: font.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginBottom: 16 },
  groupLabel: {
    fontFamily: font.medium, fontSize: 11, letterSpacing: 1.1,
    textTransform: "uppercase", marginBottom: 8,
  },
  groupCard: {
    backgroundColor: colors.card, borderRadius: radius.lg, paddingHorizontal: 15, marginBottom: 16,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  row: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 13 },
  rowBar: { width: 4, height: 34, borderRadius: 2 },
  rowName: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  rowSub: { fontFamily: font.regular, fontSize: 11.5, marginTop: 1 },
  removeBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.neutralChipBg,
    alignItems: "center", justifyContent: "center",
  },
  removeBtnText: { fontSize: 13, color: colors.neutralChipText },
  addByHand: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderStyle: "dashed",
    borderRadius: radius.md, padding: 14, alignItems: "center", marginBottom: 14,
  },
  addByHandText: { fontFamily: font.medium, fontSize: 14, color: colors.textMuted },
});
