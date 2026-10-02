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
import CommunityScreen from "./src/screens/CommunityScreen";
import ImportScreen from "./src/screens/ImportScreen";
import ImportResultScreen from "./src/screens/ImportResultScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import PostDetailScreen from "./src/screens/PostDetailScreen";
import ComposeScreen from "./src/screens/ComposeScreen";
import CookbookScreen from "./src/screens/CookbookScreen";

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
            cookbookSummary={s.cookbookSummary}
            hasUrgent={s.hasUrgent}
            urgentBadge={s.urgentBadge}
            urgentLine={s.urgentLine}
            onGoTracker={() => s.go("tracker")}
            onGoPantry={() => s.go("pantry")}
            onGoCookbook={() => s.go("cookbook")}
            onGoSettings={() => s.go("settings")}
            onScanFridge={() => s.scan("fridge")}
            onScanReceipt={() => s.scan("receipt")}
            onScanPantry={() => s.scan("pantry")}
            onGoResult={() => s.go("result")}
            onImportRecipe={() => s.go("import")}
          />
        )}
        {s.screen === "settings" && (
          <SettingsScreen
            dietSummary={s.dietSummary}
            pantryCount={s.pantryCount}
            onBack={() => s.go("home")}
            onGoDiet={() => s.go("diet")}
            onGoPantry={() => s.go("pantry")}
            onLogOut={() => s.go("login")}
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
        {s.screen === "cooked" && (
          <CookedScreen
            onBackHome={() => s.go("home")}
            onShare={s.shareToCommunity}
            hasShared={s.hasSharedCurrent}
          />
        )}
        {s.screen === "tracker" && <TrackerScreen />}
        {s.screen === "community" && (
          <CommunityScreen
            posts={s.communityPosts}
            hasRecipeOnly={s.feedHasRecipeOnly}
            onToggleHasRecipe={s.toggleFeedHasRecipeOnly}
            sortMenuOpen={s.sortMenuOpen}
            onToggleSortMenu={s.toggleSortMenu}
            sortOptions={s.sortOptions}
            currentSortLabel={s.currentSortLabel}
            onCompose={s.openCompose}
          />
        )}
        {s.screen === "post" && s.selectedPostDetail && (
          <PostDetailScreen
            post={s.selectedPostDetail.post}
            initial={s.selectedPostDetail.initial}
            avatarMine={s.selectedPostDetail.avatarMine}
            authorShort={s.selectedPostDetail.authorShort}
            savedLabel={s.selectedPostDetail.savedLabel}
            hasRecipe={s.selectedPostDetail.hasRecipe}
            ingredients={s.selectedPostDetail.ingredients}
            matchLine={s.selectedPostDetail.matchLine}
            isSaved={s.selectedPostDetail.isSaved}
            toggleSave={s.selectedPostDetail.toggleSave}
            toggleLike={s.selectedPostDetail.toggleLike}
            commentDraft={s.commentDraft}
            onCommentDraftChange={s.setCommentDraft}
            onSendComment={s.sendComment}
            onBack={() => s.go("community")}
          />
        )}
        {s.screen === "compose" && (
          <ComposeScreen
            dish={s.composeDish}
            onDishChange={s.setComposeDish}
            caption={s.composeCaption}
            onCaptionChange={s.setComposeCaption}
            pickRows={s.composePickRows}
            savedPreview={s.composeSavedPreview}
            canSubmit={s.canSubmitPost}
            onSubmit={s.submitPost}
            onCancel={() => s.go("community")}
          />
        )}
        {s.screen === "import" && (
          <ImportScreen
            loading={s.importLoading}
            error={s.importError}
            onSubmit={s.startImport}
            onCancel={() => s.go("home")}
          />
        )}
        {s.screen === "importResult" && s.openedRecipe && (
          <ImportResultScreen
            recipe={{
              title: s.openedRecipe.title,
              servings: s.openedRecipe.servings,
              source: s.openedRecipe.source,
            }}
            haveIngredients={s.haveIngredients}
            needIngredients={s.needIngredients}
            backLabel={s.importFrom === "cookbook" ? "← Saved recipes" : "← Import another"}
            canSave={s.canSaveOpenedRecipe}
            isSaved={s.isOpenedRecipeSaved}
            showSeeAllSaved={s.isOpenedRecipeSaved && s.importFrom === "import"}
            onBack={() => (s.importFrom === "cookbook" ? s.go("cookbook") : s.go("import"))}
            onToggleSave={s.toggleSaveOpenedRecipe}
            onSeeAllSaved={() => s.go("cookbook")}
            onDone={() => s.go("home")}
          />
        )}
        {s.screen === "cookbook" && (
          <CookbookScreen
            rows={s.cookbookRows}
            filter={s.cookbookFilter}
            onSetFilter={s.setCookbookFilter}
            onBack={() => s.go("home")}
            onImportRecipe={() => s.go("import")}
            onBrowseFeed={() => s.go("community")}
          />
        )}
      </View>

      {s.showTabs && (
        <TabBar
          active={s.activeTab}
          onHome={() => s.go("home")}
          onScan={() => s.scan("fridge")}
          onPantry={() => s.go("pantry")}
          onSaved={() => s.go("tracker")}
          onCommunity={() => s.go("community")}
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
