import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButton, TextButton } from "../components/ui";
import { colors, font, radius } from "../theme";
import { ScanSourceData } from "../types/pantry";

interface PendingRow {
  name: string;
  sub: string;
  bar: string;
  fg: string;
  opacity: number;
  strike: boolean;
  actionLabel: string;
  actionBg: string;
  actionFg: string;
  isDup: boolean;
  index: number;
}

interface Props {
  source: ScanSourceData;
  pending: PendingRow[];
  hasDupes: boolean;
  dupeCount: number;
  confirmFooter: string;
  onToggleAction: (index: number, isDup: boolean) => void;
  onRetake: () => void;
  onApply: () => void;
}

export default function ConfirmScreen({
  source,
  pending,
  hasDupes,
  dupeCount,
  confirmFooter,
  onToggleAction,
  onRetake,
  onApply,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextButton label="← Retake" onPress={onRetake} />
      <Text style={styles.title}>{source.confirmTitle}</Text>
      <Text style={styles.subtitle}>Tap the pill on any row to change what happens to it.</Text>

      {hasDupes && (
        <View style={styles.dupeNotice}>
          <Text style={styles.dupeNoticeText}>
            <Text style={{ fontFamily: font.semibold, color: colors.amberText }}>
              {dupeCount} already on your list.
            </Text>{" "}
            Merge to update the amount, or skip to leave it as it was.
          </Text>
        </View>
      )}

      <View style={styles.listCard}>
        {pending.map((p, i) => (
          <View key={p.name} style={[i < pending.length - 1 && styles.rowDivider, { opacity: p.opacity }]}>
            <View style={styles.row}>
              <View style={[styles.rowBar, { backgroundColor: p.bar }]} />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.rowName,
                    p.strike && { textDecorationLine: "line-through" },
                  ]}
                >
                  {p.name}
                </Text>
                <Text style={[styles.rowSub, { color: p.fg }]}>{p.sub}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.actionPill, { backgroundColor: p.actionBg }]}
                onPress={() => onToggleAction(i, p.isDup)}
              >
                <Text style={[styles.actionPillText, { color: p.actionFg }]}>{p.actionLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <Text style={styles.addMore}>+ I also have…</Text>
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.footerNoteText}>{confirmFooter}</Text>
      </View>

      <PrimaryButton label="Update my kitchen" onPress={onApply} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  title: { fontFamily: font.bold, fontSize: 25, lineHeight: 29, letterSpacing: -0.4, color: colors.text, marginTop: 12, marginBottom: 5 },
  subtitle: { fontFamily: font.regular, fontSize: 13.5, lineHeight: 20, color: colors.textMuted, marginBottom: 16 },
  dupeNotice: {
    backgroundColor: colors.amberBg, borderWidth: 1, borderColor: colors.amberBorder,
    borderRadius: 14, padding: 13, marginBottom: 13,
  },
  dupeNoticeText: { fontFamily: font.regular, fontSize: 12.5, lineHeight: 19, color: colors.amberTextSoft },
  listCard: {
    backgroundColor: colors.card, borderRadius: radius.xl, paddingHorizontal: 15, marginBottom: 14,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  row: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 13 },
  rowBar: { width: 4, height: 38, borderRadius: 2 },
  rowName: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  rowSub: { fontFamily: font.regular, fontSize: 11.5, marginTop: 1 },
  actionPill: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20 },
  actionPillText: { fontFamily: font.semibold, fontSize: 11.5 },
  addMore: { paddingVertical: 13, fontFamily: font.medium, fontSize: 13.5, color: colors.primary },
  footerNote: { backgroundColor: colors.primaryTint, borderRadius: 14, padding: 14, marginBottom: 14 },
  footerNoteText: { fontFamily: font.regular, fontSize: 13, lineHeight: 19, color: colors.primaryTintText },
});
