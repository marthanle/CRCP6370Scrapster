import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, font, radius } from "../theme";

interface Props {
  pantryCount: number;
  pantrySummary: string;
  hasUrgent: boolean;
  urgentBadge: string;
  urgentLine: string;
  onGoTracker: () => void;
  onGoPantry: () => void;
  onScanFridge: () => void;
  onScanReceipt: () => void;
  onScanPantry: () => void;
  onGoResult: () => void;
}

const actionRows = [
  { key: "fridge", icon: "◉", title: "Photo of the fridge", subtitle: "Re-check what's actually left", primary: true },
  { key: "receipt", icon: "▤", title: "Scan a grocery receipt", subtitle: "Fastest after a shop — prices included" },
  { key: "pantry", icon: "▥", title: "Photo of the pantry shelf", subtitle: "Dry goods, cans, the back of the cupboard" },
];

export default function HomeScreen({
  pantryCount,
  pantrySummary,
  hasUrgent,
  urgentBadge,
  urgentLine,
  onGoTracker,
  onGoPantry,
  onScanFridge,
  onScanReceipt,
  onScanPantry,
  onGoResult,
}: Props) {
  const handlers: Record<string, () => void> = {
    fridge: onScanFridge,
    receipt: onScanReceipt,
    pantry: onScanPantry,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.dateText}>Tuesday, 6:12pm</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.85} style={styles.savedCard} onPress={onGoTracker}>
        <Text style={styles.savedLabel}>Saved this month</Text>
        <View style={styles.savedRow}>
          <Text style={styles.savedAmount}>$32.10</Text>
          <Text style={styles.savedItems}>9 items{"\n"}rescued</Text>
        </View>
        <View style={styles.savedBarRow}>
          <View style={[styles.savedBarSeg, { flex: 3, backgroundColor: colors.onPrimaryMuted }]} />
          <View style={[styles.savedBarSeg, { flex: 2, backgroundColor: "rgba(188,229,210,0.6)" }]} />
          <View style={[styles.savedBarSeg, { flex: 4, backgroundColor: "rgba(188,229,210,0.28)" }]} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.85} style={styles.kitchenRow} onPress={onGoPantry}>
        <View style={styles.kitchenBadge}>
          <Text style={styles.kitchenBadgeText}>{pantryCount}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.kitchenTitle}>Your kitchen</Text>
          <Text style={styles.kitchenSubtitle}>{pantrySummary}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Add what you got</Text>
      <Text style={styles.sectionSubtitle}>
        Anything new goes on top of what I already know about.
      </Text>

      <View style={{ gap: 9, marginBottom: 18 }}>
        {actionRows.map((row) => (
          <TouchableOpacity
            key={row.key}
            activeOpacity={0.85}
            style={row.primary ? styles.actionRowPrimary : styles.actionRow}
            onPress={handlers[row.key]}
          >
            <View style={row.primary ? styles.actionIconPrimary : styles.actionIcon}>
              <Text style={{ fontSize: 17, color: row.primary ? colors.onPrimary : colors.primary }}>
                {row.icon}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={row.primary ? styles.actionTitlePrimary : styles.actionTitle}>{row.title}</Text>
              <Text style={row.primary ? styles.actionSubtitlePrimary : styles.actionSubtitle}>
                {row.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity activeOpacity={0.85} style={styles.typeItIn} onPress={onGoPantry}>
          <Text style={styles.typeItInText}>Or type it in</Text>
        </TouchableOpacity>
      </View>

      {hasUrgent && (
        <TouchableOpacity activeOpacity={0.85} style={styles.urgentBanner} onPress={onGoResult}>
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentBadgeText}>{urgentBadge}</Text>
          </View>
          <Text style={styles.urgentLine}>{urgentLine}</Text>
          <Text style={styles.urgentCta}>Cook it →</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  dateText: { fontFamily: font.medium, fontSize: 13, color: colors.textMuted },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontFamily: font.bold, fontSize: 13.5, color: colors.primary },
  savedCard: { backgroundColor: colors.primary, borderRadius: radius.xl, padding: 19, marginBottom: 18 },
  savedLabel: { fontFamily: font.medium, fontSize: 12, color: colors.onPrimaryMuted, marginBottom: 5 },
  savedRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 },
  savedAmount: { fontFamily: font.bold, fontSize: 42, lineHeight: 42, letterSpacing: -1, color: colors.onPrimary },
  savedItems: { fontFamily: font.medium, fontSize: 11.5, lineHeight: 15.5, color: colors.onPrimaryMuted, textAlign: "right" },
  savedBarRow: { flexDirection: "row", gap: 3 },
  savedBarSeg: { height: 5, borderRadius: 3 },
  kitchenRow: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: 14,
    flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  kitchenBadge: {
    width: 36, height: 36, borderRadius: 11, backgroundColor: colors.primaryTint,
    alignItems: "center", justifyContent: "center",
  },
  kitchenBadgeText: { fontFamily: font.bold, fontSize: 13.5, color: colors.primary },
  kitchenTitle: { fontFamily: font.semibold, fontSize: 14.5, color: colors.text },
  kitchenSubtitle: { fontFamily: font.regular, fontSize: 12.5, color: colors.textMuted, marginTop: 1 },
  chevron: { fontSize: 14, color: colors.textSubtle },
  sectionTitle: { fontFamily: font.bold, fontSize: 23, letterSpacing: -0.4, color: colors.text, marginBottom: 4 },
  sectionSubtitle: { fontFamily: font.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginBottom: 13 },
  actionRow: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: 15,
    flexDirection: "row", alignItems: "center", gap: 13,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  actionRowPrimary: {
    backgroundColor: colors.primary, borderRadius: radius.md, padding: 15,
    flexDirection: "row", alignItems: "center", gap: 13,
  },
  actionIcon: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primaryTint,
    alignItems: "center", justifyContent: "center",
  },
  actionIconPrimary: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  actionTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  actionTitlePrimary: { fontFamily: font.bold, fontSize: 15, color: colors.onPrimary },
  actionSubtitle: { fontFamily: font.regular, fontSize: 12.5, color: colors.textMuted, marginTop: 1 },
  actionSubtitlePrimary: { fontFamily: font.regular, fontSize: 12.5, color: colors.onPrimaryMuted, marginTop: 1 },
  typeItIn: {
    backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    borderStyle: "dashed", padding: 14, alignItems: "center",
  },
  typeItInText: { fontFamily: font.medium, fontSize: 14, color: colors.textMuted },
  urgentBanner: {
    backgroundColor: colors.amberBg, borderWidth: 1, borderColor: colors.amberBorder,
    borderRadius: radius.md, padding: 14, flexDirection: "row", alignItems: "center", gap: 12,
  },
  urgentBadge: {
    width: 36, height: 36, borderRadius: 11, backgroundColor: colors.amberChip,
    alignItems: "center", justifyContent: "center",
  },
  urgentBadgeText: { fontFamily: font.bold, fontSize: 12.5, color: colors.amberText },
  urgentLine: { flex: 1, fontFamily: font.regular, fontSize: 13, lineHeight: 19, color: colors.amberTextSoft },
  urgentCta: { fontFamily: font.semibold, fontSize: 13, color: colors.amberText },
});
