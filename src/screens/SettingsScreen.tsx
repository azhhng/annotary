import { Image, Text, View } from "react-native";

import { Button } from "../components/Button";
import { ScreenHeader } from "../components/ScreenHeader";
import { SectionHeader } from "../components/SectionHeader";
import { styles } from "../styles";

const pompomeloLogo = require("../assets/pompomelo_no_border.png");

const instructions = [
  "Create your shelf.",
  "Try to read others in the Others tab.",
  "Skip profiles you do not want to review right now, and remove profiles you never want to see again.",
  "View how others see you in the Essence tab.",
];

export function SettingsScreen({
  accountLabel,
  authError,
  deleteBusy,
  deleteConfirming,
  onCancelDelete,
  onDeleteAccount,
  onLogout,
}: {
  accountLabel: string;
  authError: string | null;
  deleteBusy: boolean;
  deleteConfirming: boolean;
  onCancelDelete: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
}) {
  return (
    <View style={styles.screen}>
      <ScreenHeader title="Settings" body="manage your account and session" />
      {authError && <Text style={styles.errorText}>{authError}</Text>}
      <View style={styles.section}>
        <SectionHeader title="How the website works" />
        <View style={styles.instructionsList}>
          {instructions.map((instruction, index) => (
            <View key={instruction} style={styles.instructionsRow}>
              <Text style={styles.instructionsNumber}>{index + 1}.</Text>
              <Text style={styles.instructionsText}>{instruction}</Text>
            </View>
          ))}
        </View>
      </View>
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
      <View style={styles.developerCredit}>
        <Image
          accessibilityIgnoresInvertColors
          source={pompomeloLogo}
          style={styles.developerLogo}
        />
        <View style={styles.developerCreditCopy}>
          <Text style={styles.developerCreditText}>developed by</Text>
          <Text style={styles.developerCreditPill}>pompomelo</Text>
          <Text style={styles.developerCreditText}>
            (me! a solo dev living in toronto)
          </Text>
        </View>
      </View>
    </View>
  );
}
