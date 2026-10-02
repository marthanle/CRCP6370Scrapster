import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, font, radius } from "../theme";
import { BookmarkIcon } from "../components/icons";
import { CookbookFilter, CookbookRow } from "../types/pantry";

interface Props {
  rows: CookbookRow[];
  filter: CookbookFilter;
  onSetFilter: (filter: CookbookFilter) => void;
  onBack: () => void;
  onImportRecipe: () => void;
  onBrowseFeed: () => void;
}

const FILTERS: Array<{ key: CookbookFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "ready", label: "Ready-ish" },
  { key: "feed", label: "From the feed" },
];

export default function CookbookScreen({ rows, filter, onSetFilter, onBack, onImportRecipe, onBrowseFeed }: Props) {
  const hasAny = rows.length > 0 || filter !== "all";
  const isEmptyOverall = rows.length === 0 && filter === "all";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backLink}>← Home</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Saved recipes</Text>
      <Text style={styles.subtitle}>
        Ones you imported or saved from the feed, sorted by what you can make right now.
      </Text>

      {!isEmptyOverall && (
        <>
          <View style={styles.filterRow}>
            {FILTERS.map((f) => {
              const on = filter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.7}
                  onPress={() => onSetFilter(f.key)}
                  style={[styles.filterChip, { backgroundColor: on ? colors.primary : colors.card, borderColor: on ? colors.primary : colors.border }]}
                >
                  <Text style={{ fontFamily: font.medium, fontSize: 13, color: on ? colors.onPrimary : colors.text }}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ gap: 10 }}>
            {rows.map((r) => (
              <TouchableOpacity key={r.id} activeOpacity={0.85} style={styles.row} onPress={r.open}>
                <View style={styles.thumb} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.rowSource}>{r.source}</Text>
                  <Text style={styles.rowTitle} numberOfLines={2}>{r.title}</Text>
                  <View style={styles.matchRow}>
                    <View style={styles.matchTrack}>
                      <View
                        style={[
                          styles.matchFill,
                          { width: `${r.pct}%`, backgroundColor: r.ready ? colors.primary : colors.urgentWeek },
                        ]}
                      />
                    </View>
                    <Text style={[styles.matchLabel, { color: r.ready ? colors.primary : colors.amberLabel }]}>
                      {r.haveLabel}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={r.remove} style={styles.removeBtn}>
                  <BookmarkIcon color={colors.primary} size={17} filled />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            {hasAny && rows.length === 0 && (
              <Text style={styles.filteredEmpty}>Nothing here for this filter.</Text>
            )}
          </View>
        </>
      )}

      {isEmptyOverall && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No saved recipes yet</Text>
          <Text style={styles.emptyBody}>
            Paste a recipe link, or tap Save on anything in the feed that looks good.
          </Text>
        </View>
      )}

      <View style={styles.footerRow}>
        <TouchableOpacity activeOpacity={0.85} style={styles.footerPrimary} onPress={onImportRecipe}>
          <Text style={styles.footerPrimaryText}>Paste a link</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} style={styles.footerSecondary} onPress={onBrowseFeed}>
          <Text style={styles.footerSecondaryText}>Browse feed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  backLink: { fontFamily: font.medium, fontSize: 13, color: colors.primary, marginBottom: 14 },
  title: { fontFamily: font.bold, fontSize: 25, lineHeight: 29, letterSpacing: -0.4, color: colors.text, marginBottom: 5 },
  subtitle: { fontFamily: font.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginBottom: 14 },
  filterRow: { flexDirection: "row", gap: 7, marginBottom: 14 },
  filterChip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  row: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: 12, flexDirection: "row",
    gap: 12, alignItems: "center",
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  thumb: { width: 64, height: 64, borderRadius: 12, backgroundColor: colors.skeletonDish },
  rowSource: {
    fontFamily: font.medium, fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase",
    color: colors.textFaint, marginBottom: 3,
  },
  rowTitle: { fontFamily: font.semibold, fontSize: 15, lineHeight: 18.75, color: colors.text, marginBottom: 7 },
  matchRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  matchTrack: { flex: 1, height: 5, borderRadius: 3, backgroundColor: "#EDEFEC", overflow: "hidden" },
  matchFill: { height: "100%", borderRadius: 3 },
  matchLabel: { fontFamily: font.medium, fontSize: 11.5 },
  removeBtn: { width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  filteredEmpty: { fontFamily: font.regular, fontSize: 13, color: colors.textFaint, textAlign: "center", paddingVertical: 16 },
  emptyCard: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.dash, borderStyle: "dashed",
    borderRadius: radius.md, padding: 22, alignItems: "center", marginBottom: 14,
  },
  emptyTitle: { fontFamily: font.bold, fontSize: 15.5, color: colors.text, marginBottom: 5 },
  emptyBody: { fontFamily: font.regular, fontSize: 13, lineHeight: 19.5, color: colors.textMuted, textAlign: "center" },
  footerRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  footerPrimary: { flex: 1, backgroundColor: colors.primary, borderRadius: radius.sm, alignItems: "center", paddingVertical: 14 },
  footerPrimaryText: { fontFamily: font.bold, fontSize: 14.5, color: colors.onPrimary },
  footerSecondary: {
    flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, alignItems: "center", paddingVertical: 14,
  },
  footerSecondaryText: { fontFamily: font.semibold, fontSize: 14.5, color: colors.text },
});
