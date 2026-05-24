import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
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
import { supabase } from "./src/lib/supabase";
import { AuthScreen } from "./src/screens/AuthScreen";
import { DailyScreen } from "./src/screens/DailyScreen";
import { EssenceScreen } from "./src/screens/EssenceScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { ShelfSetupScreen } from "./src/screens/ShelfSetupScreen";
import { ShelfScreen } from "./src/screens/ShelfScreen";
import { styles } from "./src/styles";
import type { Screen } from "./src/types";
import {
  deleteMyAccount,
  getMySelfProfile,
  hasCompletedShelf,
} from "./src/data/annotaryRepository";
import { buildPersonalityLabel } from "./src/lib/personalityLabel";

const screens: Array<{ id: Screen; label: string }> = [
  { id: "shelf", label: "Shelf" },
  { id: "daily", label: "Others" },
  { id: "essence", label: "Essence" },
  { id: "settings", label: "Settings" },
];

const paperclipIcon = require("./src/emoji-assets/linked_paperclip.svg");
const gearIcon = require("./src/emoji-assets/gear.svg");

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

export default function App() {
  const [screen, setScreen] = useState<Screen>("shelf");
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [shelfComplete, setShelfComplete] = useState<boolean | null>(null);
  const [deleteConfirming, setDeleteConfirming] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [selectedAdjectives, setSelectedAdjectives] = useState([
    "Whimsical",
    "Perceptive",
    "Dramatic",
  ]);
  const [personalityLabel, setPersonalityLabel] = useState<string | null>(null);
  const [labelRefreshToken, setLabelRefreshToken] = useState(0);
  const previousUserIdRef = useRef<string | null>(null);
  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = "Annotary";
    document.documentElement.style.setProperty("scrollbar-gutter", "stable");

    const existingStyle = document.getElementById("annotary-scrollbar-stability");

    if (!existingStyle) {
      const style = document.createElement("style");

      style.id = "annotary-scrollbar-stability";
      style.textContent =
        "#app-scroll { overflow-y: scroll !important; scrollbar-gutter: stable; }";
      document.head.appendChild(style);
    }

    const paperclipIconUri = getAssetUri(paperclipIcon);

    if (!paperclipIconUri) {
      return;
    }

    const existingIcon = document.querySelector(
      "link[rel='icon']",
    ) as HTMLLinkElement | null;
    const iconLink = existingIcon ?? document.createElement("link");

    iconLink.rel = "icon";
    iconLink.type = "image/svg+xml";
    iconLink.href = paperclipIconUri;

    if (!existingIcon) {
      document.head.appendChild(iconLink);
    }
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
      setPersonalityLabel(null);
      return () => {
        active = false;
      };
    }

    setShelfComplete(null);
    hasCompletedShelf(userId)
      .then((complete) => {
        if (active) {
          setShelfComplete(complete);
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

  if (authLoading || (session && shelfComplete === null)) {
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
        <AuthScreen />
      </SafeAreaView>
    );
  }

  const username = session.user.user_metadata?.username;
  const accountLabel = username
    ? `@${username}`
    : session.user.email ?? "Your account";

  if (!shelfComplete) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ShelfSetupScreen
          onComplete={() => {
            setShelfComplete(true);
            setScreen("shelf");
          }}
          onLogout={handleLogout}
        />
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
            {screens.map((item) => (
              <Pressable
                key={item.id}
                accessibilityLabel={item.id === "settings" ? "Settings" : item.label}
                onPress={() => setScreen(item.id)}
                style={[
                  styles.navButton,
                  item.id === "settings" && styles.navIconButton,
                  screen === item.id && styles.navButtonActive,
                ]}
              >
                {item.id === "settings" ? (
                  <Image
                    accessibilityIgnoresInvertColors
                    source={gearIcon}
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
            ))}
          </View>
        </View>

        <ScrollView
          nativeID="app-scroll"
          style={styles.content}
          contentContainerStyle={styles.contentInner}
        >
          {screen === "shelf" && (
            <ShelfScreen
              userId={userId}
              onSelfPortraitUpdated={() =>
                setLabelRefreshToken((token) => token + 1)
              }
            />
          )}
          {screen === "daily" && (
            <DailyScreen
              userId={userId}
              selected={selectedAdjectives}
              onToggle={setSelectedAdjectives}
            />
          )}
          {screen === "essence" && <EssenceScreen userId={userId} />}
          {screen === "settings" && (
            <SettingsScreen
              accountLabel={accountLabel}
              authError={authError}
              deleteBusy={deleteBusy}
              deleteConfirming={deleteConfirming}
              onCancelDelete={() => setDeleteConfirming(false)}
              onDeleteAccount={handleDeleteAccount}
              onLogout={handleLogout}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
