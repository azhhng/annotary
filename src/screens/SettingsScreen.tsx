import { Linking, Text, View } from "react-native";

import { Button } from "../components/Button";
import { DeveloperCredit } from "../components/DeveloperCredit";
import { ScreenHeader } from "../components/ScreenHeader";
import { SectionHeader } from "../components/SectionHeader";
import type { LegalPage } from "./LegalScreen";
import { styles } from "../styles";

export function SettingsScreen({
  accountLabel,
  authError,
  deleteBusy,
  deleteConfirming,
  onCancelDelete,
  onDeleteAccount,
  onLogout,
  onOpenLegalPage,
}: {
  accountLabel: string;
  authError: string | null;
  deleteBusy: boolean;
  deleteConfirming: boolean;
  onCancelDelete: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
  onOpenLegalPage: (page: LegalPage) => void;
}) {
  return (
    <View style={styles.screen}>
      <ScreenHeader title="Settings" body="manage your account and session" />
      {authError && <Text style={styles.errorText}>{authError}</Text>}
      <View style={styles.section}>
        <SectionHeader title="Account" body={accountLabel} />
        <View style={styles.settingsActions}>
          <Button variant="secondary" onPress={onLogout}>
            Log out
          </Button>
          {deleteConfirming && (
            <Button
              variant="secondary"
              disabled={deleteBusy}
              onPress={onCancelDelete}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="danger"
            disabled={deleteBusy}
            onPress={onDeleteAccount}
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
            This permanently deletes your account, shelf, and profile. Anonymous
            reads you submitted will remain in aggregate results.
          </Text>
        )}
      </View>
      <View style={styles.disclaimerBanner}>
        <Text style={styles.disclaimerText}>
          Found a bug or have a question? Email{" "}
          <Text
            accessibilityRole="link"
            style={styles.disclaimerTitle}
            onPress={() => Linking.openURL("mailto:mimibrews@gmail.com")}
          >
            mimibrews@gmail.com
          </Text>
          .
        </Text>
      </View>
      <View style={styles.legalLinkRow}>
        <Text
          accessibilityRole="link"
          onPress={() => onOpenLegalPage("privacy")}
          style={styles.inlineLink}
        >
          Privacy Policy
        </Text>
        <Text
          accessibilityRole="link"
          onPress={() => onOpenLegalPage("terms")}
          style={styles.inlineLink}
        >
          Terms of Service
        </Text>
        <Text
          accessibilityRole="link"
          onPress={() => onOpenLegalPage("community")}
          style={styles.inlineLink}
        >
          Community Guidelines
        </Text>
      </View>
      <DeveloperCredit />
    </View>
  );
}
