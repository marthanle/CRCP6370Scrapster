import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, PrimaryButton, TextButton } from "../components/ui";
import { colors, font, radius } from "../theme";

interface Props {
  onLogIn: () => void;
  onCreateAccount: () => void;
}

export default function LoginScreen({ onLogIn, onCreateAccount }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>S</Text>
      </View>
      <Text style={styles.title}>Welcome back,{"\n"}Mara</Text>
      <Text style={styles.subtitle}>
        You've kept $32.10 out of the bin this month. Let's keep it going.
      </Text>

      <Card style={styles.field}>
        <Text style={styles.fieldLabel}>Email</Text>
        <Text style={styles.fieldValue}>mara@school.edu</Text>
      </Card>
      <Card style={[styles.field, { marginBottom: 16 }]}>
        <Text style={styles.fieldLabel}>Password</Text>
        <Text style={[styles.fieldValue, { letterSpacing: 2 }]}>••••••••</Text>
      </Card>

      <PrimaryButton label="Log in" onPress={onLogIn} style={{ marginBottom: 16 }} />

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.ssoRow}>
        <View style={styles.ssoButtonDark}>
          <Text style={styles.ssoTextLight} onPress={onLogIn}>
            Apple
          </Text>
        </View>
        <View style={styles.ssoButtonLight}>
          <Text style={styles.ssoTextDark} onPress={onLogIn}>
            Google
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>New here? </Text>
        <TextButton label="Create an account" onPress={onCreateAccount} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 56,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoText: { color: colors.onPrimary, fontFamily: font.bold, fontSize: 21 },
  title: {
    fontFamily: font.bold,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: colors.text,
    marginBottom: 7,
  },
  subtitle: {
    fontFamily: font.regular,
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.textMuted,
    marginBottom: 26,
  },
  field: { marginBottom: 10, paddingVertical: 14 },
  fieldLabel: { fontFamily: font.medium, fontSize: 11, color: colors.textFaint, marginBottom: 2 },
  fieldValue: { fontFamily: font.regular, fontSize: 15.5, color: colors.text },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontFamily: font.medium, fontSize: 11.5, color: colors.textFaint },
  ssoRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  ssoButtonDark: {
    flex: 1,
    backgroundColor: colors.text,
    borderRadius: radius.sm,
    alignItems: "center",
    paddingVertical: 14,
  },
  ssoButtonLight: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    alignItems: "center",
    paddingVertical: 14,
  },
  ssoTextLight: { color: colors.onPrimary, fontFamily: font.semibold, fontSize: 14 },
  ssoTextDark: { color: colors.text, fontFamily: font.semibold, fontSize: 14 },
  footer: { flexDirection: "row", justifyContent: "center" },
  footerText: { fontFamily: font.regular, fontSize: 13.5, color: colors.textMuted },
});
