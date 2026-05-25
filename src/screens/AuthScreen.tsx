import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { BrandLogo } from "../components/BrandLogo";
import { Button } from "../components/Button";
import { supabase } from "../lib/supabase";
import { LegalScreen, type LegalPage } from "./LegalScreen";
import { colors, styles } from "../styles";

type AuthMode = "login" | "signup";

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";
  const minimumPasswordLength = isSignup ? 8 : 1;
  const normalizedUsername = username.trim().toLowerCase();
  const usernameIsValid = /^[a-z0-9_]{3,24}$/.test(normalizedUsername);
  const canSubmit =
    email.trim().length > 0 &&
    password.length >= minimumPasswordLength &&
    (!isSignup || usernameIsValid) &&
    (!isSignup || ageConfirmed) &&
    !busy;

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error: authError } = isSignup
        ? await signUpWithUsername({
            email: email.trim(),
            password,
            username: normalizedUsername,
          })
        : await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

      if (authError) {
        throw authError;
      }

      if (isSignup && !data.session) {
        setMessage("Check your email to confirm your account, then log in.");
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    const nextMode = isSignup ? "login" : "signup";

    setMode(nextMode);
    setAgeConfirmed(false);
    setError(null);
    setMessage(null);
  };

  if (legalPage) {
    return (
      <ScrollView
        nativeID="app-scroll"
        style={styles.content}
        contentContainerStyle={styles.contentInner}
      >
        <LegalScreen
          page={legalPage}
          onBack={() => setLegalPage(null)}
          onOpenPage={setLegalPage}
        />
      </ScrollView>
    );
  }

  return (
    <View style={styles.authShell}>
      <View style={styles.authPanel}>
        <BrandLogo />
        <Text style={styles.authTitle}>
          {isSignup ? "Create your account" : "Log in to your account"}
        </Text>
        <Text style={styles.screenBody}>
          Save your shelf, read other profiles, and see how people describe
          your books.
        </Text>

        <View style={styles.authForm}>
          {isSignup && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="username"
                onChangeText={setUsername}
                placeholder="letters, numbers, underscore"
                placeholderTextColor={colors.placeholder}
                style={styles.textInput}
                value={username}
              />
              {username.length > 0 && !usernameIsValid && (
                <Text style={styles.helperText}>
                  Use 3-24 letters, numbers, or underscores.
                </Text>
              )}
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.placeholder}
              style={styles.textInput}
              value={email}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete={isSignup ? "new-password" : "current-password"}
              onChangeText={setPassword}
              placeholder={isSignup ? "At least 8 characters" : "Password"}
              placeholderTextColor={colors.placeholder}
              secureTextEntry
              style={styles.textInput}
              value={password}
            />
          </View>

          {isSignup && (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: ageConfirmed }}
              onPress={() => setAgeConfirmed((confirmed) => !confirmed)}
              style={styles.checkboxRow}
            >
              <View
                style={[
                  styles.checkboxBox,
                  ageConfirmed && styles.checkboxBoxChecked,
                ]}
              >
                {ageConfirmed && <Text style={styles.checkboxMark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                I confirm that I am at least 16 years old.
              </Text>
            </Pressable>
          )}

          {isSignup && (
            <Text style={styles.legalConsentText}>
              By creating an account, you agree to the{" "}
              <Text
                accessibilityRole="link"
                onPress={() => setLegalPage("terms")}
                style={styles.inlineLink}
              >
                Terms of Service
              </Text>
              ,{" "}
              <Text
                accessibilityRole="link"
                onPress={() => setLegalPage("privacy")}
                style={styles.inlineLink}
              >
                Privacy Policy
              </Text>
              , and{" "}
              <Text
                accessibilityRole="link"
                onPress={() => setLegalPage("community")}
                style={styles.inlineLink}
              >
                Community Guidelines
              </Text>
              .
            </Text>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}
          {message && <Text style={styles.successText}>{message}</Text>}

          <Button
            disabled={!canSubmit}
            onPress={handleSubmit}
          >
            {busy
              ? isSignup
                ? "Creating..."
                : "Logging in..."
              : isSignup
                ? "Create account"
                : "Log in"}
          </Button>
        </View>

        <Pressable onPress={switchMode} style={styles.authSwitch}>
          <Text style={styles.buttonSecondaryText}>
            {isSignup
              ? "Already have an account? Log in"
              : "Need an account? Create one"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

async function signUpWithUsername({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) {
  const { data: usernameAvailable, error: usernameError } = await supabase.rpc(
    "is_username_available",
    { requested_username: username },
  );

  if (usernameError) {
    throw usernameError;
  }

  if (!usernameAvailable) {
    throw new Error("That username is already taken.");
  }

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });
}
