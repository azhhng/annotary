import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import type { Session } from "@supabase/supabase-js";

import { BrandLogo } from "./src/components/BrandLogo";
import { Button } from "./src/components/Button";
import { ScreenHeader } from "./src/components/ScreenHeader";
import { brandIcon } from "./src/constants/brandAssets";
import { supabase } from "./src/lib/supabase";
import { AboutScreen } from "./src/screens/AboutScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { DailyScreen } from "./src/screens/DailyScreen";
import { EssenceScreen } from "./src/screens/EssenceScreen";
import { LegalScreen, type LegalPage } from "./src/screens/LegalScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { ShelfSetupScreen } from "./src/screens/ShelfSetupScreen";
import { ShelfScreen } from "./src/screens/ShelfScreen";
import { styles } from "./src/styles";
import type { Screen } from "./src/types";
import {
  deleteMyAccount,
  getMyAccountStatus,
  getMySelfProfile,
} from "./src/data/annotaryRepository";
import { buildPersonalityLabel } from "./src/lib/personalityLabel";

const screens: Array<{ id: Screen; label: string }> = [
  { id: "shelf", label: "Self" },
  { id: "daily", label: "Strangers" },
  { id: "essence", label: "Essence" },
  { id: "about", label: "About" },
  { id: "settings", label: "Settings" },
];

const gearIcon = require("./src/emoji-assets/gear.svg");
const aboutIcon = require("./src/emoji-assets/blue_book.svg");

const iconScreens: Partial<Record<Screen, number>> = {
  about: aboutIcon,
  settings: gearIcon,
};

const legalPathByPage: Record<LegalPage, string> = {
  privacy: "/privacy",
  terms: "/terms",
  community: "/community",
};

function getLegalPageFromPath(pathname: string): LegalPage | null {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";

  if (normalizedPath === "/privacy") return "privacy";
  if (normalizedPath === "/terms") return "terms";
  if (normalizedPath === "/community") return "community";

  return null;
}

function getCurrentLegalPage() {
  if (typeof window === "undefined") {
    return null;
  }

  return getLegalPageFromPath(window.location.pathname);
}

function getAssetUri(asset: unknown) {
  if (typeof asset === "string") {
    return asset;
  }

  if (asset && typeof asset === "object" && "uri" in asset) {
    const uri = asset.uri;

    return typeof uri === "string" ? uri : null;
  }

  return null;
}

function ShelfSetupRequiredNotice() {
  return (
    <View style={styles.disclaimerBanner}>
      <Text style={styles.disclaimerText}>
        You must finish setting up your shelf in the Self tab before continuing.
      </Text>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("shelf");
  const [routeLegalPage, setRouteLegalPage] = useState<LegalPage | null>(
    getCurrentLegalPage,
  );
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [legalReturnScreen, setLegalReturnScreen] = useState<Screen>("about");
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [shelfComplete, setShelfComplete] = useState<boolean | null>(null);
  const [banned, setBanned] = useState<boolean | null>(null);
  const [deleteConfirming, setDeleteConfirming] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [selectedAdjectives, setSelectedAdjectives] = useState([
    "Whimsical",
    "Perceptive",
    "Dramatic",
  ]);
  const [personalityLabel, setPersonalityLabel] = useState<string | null>(null);
  const [labelRefreshToken, setLabelRefreshToken] = useState(0);
  const contentScrollRef = useRef<ScrollView>(null);
  const previousUserIdRef = useRef<string | null>(null);
  const userId = session?.user.id ?? null;

  const scrollContentToTop = useCallback(() => {
    const scroll = () => {
      contentScrollRef.current?.scrollTo({ y: 0, animated: true });

      if (typeof document !== "undefined") {
        document
          .getElementById("app-scroll")
          ?.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    scroll();

    if (typeof requestAnimationFrame !== "undefined") {
      requestAnimationFrame(scroll);
    }

    setTimeout(scroll, 50);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = "Annotary";
    document.documentElement.style.setProperty("scrollbar-gutter", "stable");

    const existingStyle = document.getElementById(
      "annotary-scrollbar-stability",
    );

    if (!existingStyle) {
      const style = document.createElement("style");

      style.id = "annotary-scrollbar-stability";
      style.textContent =
        "#app-scroll { overflow-y: scroll !important; scrollbar-gutter: stable; }";
      document.head.appendChild(style);
    }

    const brandIconUri = getAssetUri(brandIcon);

    if (!brandIconUri) {
      return;
    }

    const existingIcon = document.querySelector(
      "link[rel='icon']",
    ) as HTMLLinkElement | null;
    const iconLink = existingIcon ?? document.createElement("link");

    iconLink.rel = "icon";
    iconLink.type = "image/svg+xml";
    iconLink.href = brandIconUri;

    if (!existingIcon) {
      document.head.appendChild(iconLink);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handlePopState = () => {
      setRouteLegalPage(getCurrentLegalPage());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        previousUserIdRef.current = data.session?.user.id ?? null;
        setSession(data.session);
        setAuthLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const nextUserId = nextSession?.user.id ?? null;

      if (previousUserIdRef.current !== nextUserId) {
        setScreen("shelf");
      }

      previousUserIdRef.current = nextUserId;
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (!userId) {
      setShelfComplete(null);
      setBanned(null);
      setPersonalityLabel(null);
      return () => {
        active = false;
      };
    }

    setShelfComplete(null);
    setBanned(null);
    getMyAccountStatus(userId)
      .then((status) => {
        if (active) {
          setShelfComplete(status.shelfComplete);
          setBanned(status.banned);

          if (!status.shelfComplete && !status.banned) {
            setScreen("about");
          }
        }
      })
      .catch((caughtError) => {
        if (active) {
          setAuthError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load your profile.",
          );
          setShelfComplete(false);
          setBanned(false);
        }
      });

    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    let active = true;

    if (!userId || !shelfComplete) {
      setPersonalityLabel(null);
      return () => {
        active = false;
      };
    }

    getMySelfProfile(userId)
      .then((profile) => {
        if (!active) return;
        setPersonalityLabel(
          buildPersonalityLabel(profile?.answers, profile?.adjectives),
        );
      })
      .catch(() => {
        if (active) {
          setPersonalityLabel(null);
        }
      });

    return () => {
      active = false;
    };
  }, [userId, shelfComplete, labelRefreshToken]);

  const handleLogout = async () => {
    setAuthError(null);
    setDeleteConfirming(false);
    setScreen("shelf");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirming) {
      setAuthError(null);
      setDeleteConfirming(true);
      return;
    }

    setDeleteBusy(true);
    setAuthError(null);

    try {
      await deleteMyAccount();
      await supabase.auth.signOut();
      setSession(null);
      setShelfComplete(null);
      setBanned(null);
      setDeleteConfirming(false);
      setScreen("shelf");
    } catch (caughtError) {
      setAuthError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not delete your account.",
      );
    } finally {
      setDeleteBusy(false);
    }
  };

  const openLegalPage = (page: LegalPage, returnScreen: Screen) => {
    setLegalReturnScreen(returnScreen);
    setRouteLegalPage(page);

    if (typeof window !== "undefined") {
      window.history.pushState(null, "", legalPathByPage[page]);
    }
  };

  const closeLegalPage = () => {
    setRouteLegalPage(null);

    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/");
    }

    if (session) {
      setScreen(legalReturnScreen);
    }
  };

  if (routeLegalPage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView
          ref={contentScrollRef}
          nativeID="app-scroll"
          style={styles.content}
          contentContainerStyle={styles.contentInner}
        >
          <LegalScreen
            page={routeLegalPage}
            onBack={closeLegalPage}
            onOpenPage={(page) => openLegalPage(page, legalReturnScreen)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (authLoading || (session && (shelfComplete === null || banned === null))) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.authShell}>
          <Text style={styles.screenBody}>Loading your account...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <AuthScreen
          mode={authMode}
          onModeChange={setAuthMode}
          onOpenLegalPage={(page) => openLegalPage(page, "about")}
        />
      </SafeAreaView>
    );
  }

  const username = session.user.user_metadata?.username;
  const accountLabel = username
    ? `@${username}`
    : (session.user.email ?? "Your account");

  if (banned) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.authShell}>
          <View style={styles.authPanel}>
            <BrandLogo />
            <Text style={styles.authTitle}>Account banned</Text>
            <Text style={styles.screenBody}>
              This account has been permanently banned from Annotary. Your shelf
              is no longer being shown to other readers and you cannot use the
              app. You can delete your account or review Annotary's policies.
            </Text>
            <Text style={styles.screenBody}>
              If you think this is a mistake, email mimibrews@gmail.com.
            </Text>
            {authError && <Text style={styles.errorText}>{authError}</Text>}
            <View style={styles.settingsActions}>
              <Button variant="secondary" onPress={handleLogout}>
                Log out
              </Button>
              {deleteConfirming && (
                <Button
                  variant="secondary"
                  disabled={deleteBusy}
                  onPress={() => setDeleteConfirming(false)}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="danger"
                disabled={deleteBusy}
                onPress={handleDeleteAccount}
              >
                {deleteBusy
                  ? "Deleting..."
                  : deleteConfirming
                    ? "Confirm delete"
                    : "Delete account"}
              </Button>
            </View>
            {deleteConfirming && (
              <Text style={styles.errorText}>
                This permanently deletes your account, shelf, and profile. A
                limited hashed email record may be kept for moderation
                enforcement.
              </Text>
            )}
            <View style={styles.legalLinkRow}>
              <Text
                accessibilityRole="link"
                onPress={() => openLegalPage("privacy", "about")}
                style={styles.inlineLink}
              >
                Privacy Policy
              </Text>
              <Text
                accessibilityRole="link"
                onPress={() => openLegalPage("terms", "about")}
                style={styles.inlineLink}
              >
                Terms of Service
              </Text>
              <Text
                accessibilityRole="link"
                onPress={() => openLegalPage("community", "about")}
                style={styles.inlineLink}
              >
                Community Guidelines
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <BrandLogo />
            <Text style={styles.tagline}>six books, one essence</Text>
          </View>
          <View style={styles.accountLine}>
            <View style={styles.accountBadgeRow}>
              <Text style={styles.accountEmail} numberOfLines={1}>
                {accountLabel}
              </Text>
            </View>
            {personalityLabel && (
              <Text style={styles.personalityLabel}>{personalityLabel}</Text>
            )}
          </View>
          <View style={styles.nav}>
            {screens.map((item) => {
              const icon = iconScreens[item.id];
              return (
                <Pressable
                  key={item.id}
                  accessibilityLabel={item.label}
                  onPress={() => setScreen(item.id)}
                  style={[
                    styles.navButton,
                    icon !== undefined && styles.navIconButton,
                    screen === item.id && styles.navButtonActive,
                  ]}
                >
                  {icon !== undefined ? (
                    <Image
                      accessibilityIgnoresInvertColors
                      source={icon}
                      style={styles.navIcon}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.navText,
                        screen === item.id && styles.navTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <ScrollView
          nativeID="app-scroll"
          style={styles.content}
          contentContainerStyle={styles.contentInner}
        >
          {screen === "shelf" &&
            (shelfComplete ? (
              <ShelfScreen
                userId={userId}
                onSelfPortraitUpdated={() =>
                  setLabelRefreshToken((token) => token + 1)
                }
              />
            ) : (
              <ShelfSetupScreen
                embedded
                onComplete={() => {
                  setShelfComplete(true);
                  setScreen("shelf");
                }}
                onLogout={handleLogout}
              />
            ))}
          {screen === "daily" &&
            (shelfComplete ? (
              <DailyScreen
                userId={userId}
                selected={selectedAdjectives}
                onToggle={setSelectedAdjectives}
                onScrollToTop={scrollContentToTop}
              />
            ) : (
              <View style={styles.screen}>
                <ScreenHeader
                  title="Strangers"
                  body="read someone else's shelf, then make a quick anonymous guess"
                />
                <ShelfSetupRequiredNotice />
              </View>
            ))}
          {screen === "essence" &&
            (shelfComplete ? (
              <EssenceScreen userId={userId} />
            ) : (
              <View style={styles.screen}>
                <ScreenHeader
                  title="Essence"
                  body="impressions will appear here once strangers describe your shelf"
                />
                <ShelfSetupRequiredNotice />
              </View>
            ))}
          {screen === "about" && (
            <AboutScreen
              onOpenLegalPage={(page) => openLegalPage(page, "about")}
            />
          )}
          {screen === "settings" && (
            <SettingsScreen
              accountLabel={accountLabel}
              authError={authError}
              deleteBusy={deleteBusy}
              deleteConfirming={deleteConfirming}
              onCancelDelete={() => setDeleteConfirming(false)}
              onDeleteAccount={handleDeleteAccount}
              onLogout={handleLogout}
              onOpenLegalPage={(page) => openLegalPage(page, "settings")}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
