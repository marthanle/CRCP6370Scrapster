import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import * as SplashScreen from "expo-splash-screen";

import { useScrapsterState } from "./src/hooks/useScrapsterState";
import { TabBar } from "./src/components/TabBar";
import { colors } from "./src/theme";

import LoginScreen from "./src/screens/LoginScreen";
import DietScreen from "./src/screens/DietScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PantryScreen from "./src/screens/PantryScreen";
import ScanningScreen from "./src/screens/ScanningScreen";
import ConfirmScreen from "./src/screens/ConfirmScreen";
import ResultScreen from "./src/screens/ResultScreen";
import BudgetScreen from "./src/screens/BudgetScreen";
import RecipeScreen from "./src/screens/RecipeScreen";
import CookedScreen from "./src/screens/CookedScreen";
import TrackerScreen from "./src/screens/TrackerScreen";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  const s = useScrapsterState();

  const onLayout = useCallback(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container} onLayout={onLayout}>
      <View style={styles.content}>
        {s.screen === "login" && (
          <LoginScreen onLogIn={() => s.go("home")} onCreateAccount={() => s.go("diet")} />
        )}
        {s.screen === "diet" && (
          <DietScreen
            diets={s.diets}
            onToggleDiet={s.toggleDiet}
            onContinue={() => s.go("home")}
            onSkip={() => s.go("home")}
          />
        )}
        {s.screen === "home" && (
          <HomeScreen
            pantryCount={s.pantryCount}
            pantrySummary={s.pantrySummary}
            hasUrgent={s.hasUrgent}
            urgentBadge={s.urgentBadge}
            urgentLine={s.urgentLine}
            onGoTracker={() => s.go("tracker")}
            onGoPantry={() => s.go("pantry")}
            onScanFridge={() => s.scan("fridge")}
            onScanReceipt={() => s.scan("receipt")}
            onScanPantry={() => s.scan("pantry")}
            onGoResult={() => s.go("result")}
          />
        )}
        {s.screen === "pantry" && (
          <PantryScreen
            pantryCount={s.pantryCount}
            urgentItems={s.urgentItems}
            soonItems={s.soonItems}
            keepItems={s.keepItems}
            onRemove={s.removeFromPantry}
            onCook={() => s.go("result")}
          />
        )}
        {s.screen === "scanning" && (
          <ScanningScreen source={s.activeSourceData} pantryCount={s.pantryCount} />
        )}
        {s.screen === "confirm" && (
          <ConfirmScreen
            source={s.activeSourceData}
            pending={s.pending}
            hasDupes={s.hasDupes}
            dupeCount={s.dupeCount}
            confirmFooter={s.confirmFooter}
            onToggleAction={s.cyclePendingAction}
            onRetake={() => s.go("home")}
            onApply={s.applyPending}
          />
        )}
        {s.screen === "result" && (
          <ResultScreen
            onBack={() => s.go("home")}
            onGoBudget={() => s.go("budget")}
            onGoRecipe={() => s.go("recipe")}
          />
        )}
        {s.screen === "budget" && (
          <BudgetScreen onBack={() => s.go("result")} onSkipAndCook={() => s.go("recipe")} />
        )}
        {s.screen === "recipe" && (
          <RecipeScreen
            doneMap={s.doneMap}
            doneLabel={s.doneLabel}
            onToggleStep={s.toggleStepDone}
            onBack={() => s.go("result")}
            onGoBudget={() => s.go("budget")}
            onMarkCooked={s.markCooked}
          />
        )}
        {s.screen === "cooked" && <CookedScreen onBackHome={() => s.go("home")} />}
        {s.screen === "tracker" && <TrackerScreen />}
      </View>

      {s.showTabs && (
        <TabBar
          active={s.activeTab}
          onHome={() => s.go("home")}
          onScan={() => s.scan("fridge")}
          onPantry={() => s.go("pantry")}
          onSaved={() => s.go("tracker")}
        />
      )}
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
});
