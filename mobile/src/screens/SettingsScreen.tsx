import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { colors, font, radius } from "../theme";

interface Props {
  dietSummary: string;
  pantryCount: number;
  onBack: () => void;
  onGoDiet: () => void;
  onGoPantry: () => void;
  onLogOut: () => void;
}

export default function SettingsScreen({ dietSummary, pantryCount, onBack, onGoDiet, onGoPantry, onLogOut }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backLink}>← Home</Text>
      </TouchableOpacity>

      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Martha Le</Text>
          <Text style={styles.email}>martha@smu.edu · free plan</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Food</Text>
      <View style={styles.card}>
        <TouchableOpacity activeOpacity={0.7} style={[styles.row, styles.rowDivider]} onPress={onGoDiet}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Diet &amp; allergies</Text>
            <Text style={styles.rowSub}>{dietSummary}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={[styles.row, styles.rowDivider]} onPress={onGoPantry}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Kitchen list</Text>
            <Text style={styles.rowSub}>{pantryCount} items tracked</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Kitchen setup</Text>
            <Text style={styles.rowSub}>Stove &amp; oven · cooking for 1</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Account</Text>
      <View style={styles.card}>
        <View style={[styles.row, styles.rowDivider]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Scrapster+</Text>
            <Text style={styles.rowSub}>Meal chaining &amp; nutrition</Text>
          </View>
          <View style={styles.upgradePill}>
            <Text style={styles.upgradePillText}>Upgrade</Text>
          </View>
        </View>
        <View style={[styles.row, styles.rowDivider]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Notifications</Text>
            <Text style={styles.rowSub}>Nudge me the day before something turns</Text>
          </View>
          <Switch value={true} trackColor={{ true: colors.primary, false: colors.border }} thumbColor="#fff" />
        </View>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Email &amp; password</Text>
            <Text style={styles.rowSub}>martha@smu.edu</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.8} style={styles.logOutBtn} onPress={onLogOut}>
        <Text style={styles.logOutText}>Log out</Text>
      </TouchableOpacity>
      <Text style={styles.footerNote}>Scrapster 1.0 · your kitchen list stays on this device</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, paddingTop: 14 },
  backLink: { fontFamily: font.medium, fontSize: 13, color: colors.primary, marginBottom: 14 },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 13, marginBottom: 22 },
  avatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primaryTint,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontFamily: font.bold, fontSize: 20, color: colors.primary },
  name: { fontFamily: font.bold, fontSize: 19, letterSpacing: -0.2, color: colors.text },
  email: { fontFamily: font.regular, fontSize: 13, color: colors.textMuted, marginTop: 1 },
  sectionLabel: {
    fontFamily: font.medium, fontSize: 11, letterSpacing: 1.1, textTransform: "uppercase",
    color: colors.textFaint, marginBottom: 8,
  },
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, paddingHorizontal: 15, marginBottom: 18,
    shadowColor: "#14171A", shadowOpacity: 0.07, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.text },
  rowSub: { fontFamily: font.regular, fontSize: 12, color: colors.textMuted, marginTop: 1 },
  chevron: { fontSize: 14, color: colors.textSubtle },
  upgradePill: { backgroundColor: colors.primaryTint, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 6 },
  upgradePillText: { fontFamily: font.semibold, fontSize: 12, color: colors.primary },
  logOutBtn: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: "rgba(169,58,34,0.25)",
    borderRadius: radius.md, padding: 16, alignItems: "center", marginBottom: 12,
  },
  logOutText: { fontFamily: font.bold, fontSize: 15, color: colors.urgentToday },
  footerNote: { fontFamily: font.regular, fontSize: 12, color: colors.textSubtle, textAlign: "center" },
});
