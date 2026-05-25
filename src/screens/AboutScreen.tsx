import { Image, Linking, Text, View } from "react-native";

import { ScreenHeader } from "../components/ScreenHeader";
import { SectionHeader } from "../components/SectionHeader";
import type { LegalPage } from "./LegalScreen";
import { styles } from "../styles";

const pompomeloLogo = require("../assets/pompomelo_no_border.png");

const instructions = [
  "Create your shelf.",
  "Try to read others in the Strangers tab.",
  "Skip profiles you do not want to review right now, and remove profiles you never want to see again.",
  "View how others see you in the Essence tab.",
];

const rules = [
  "Expressing negative views is expected, but no harassment, slurs, or excessive hate.",
  "No adult content.",
  "No excessive self-promotion or solicitation.",
  "No plot spoilers allowed.",
];

export function AboutScreen({
  onOpenLegalPage,
}: {
  onOpenLegalPage: (page: LegalPage) => void;
}) {
  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="About"
        body="how the site works and the guidelines"
      />
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
        <SectionHeader
          title="Guidelines"
          body="violating these can result in a permanent ban with no warning"
        />
        <View style={[styles.disclaimerBanner, { marginTop: 8 }]}>
          <Text style={styles.disclaimerText}>
            The following rules apply to your shelf, your username, and anything
            you write and submit.
          </Text>
        </View>
        <View style={styles.instructionsList}>
          {rules.map((rule, index) => (
            <View key={rule} style={styles.instructionsRow}>
              <Text style={styles.instructionsNumber}>{index + 1}.</Text>
              <Text style={styles.instructionsText}>{rule}</Text>
            </View>
          ))}
        </View>
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
      <View style={styles.developerCredit}>
        <Image
          accessibilityIgnoresInvertColors
          source={pompomeloLogo}
          style={styles.developerLogo}
        />
        <View style={styles.developerCreditCopy}>
          <Text style={styles.developerCreditText}>developed by</Text>
          <Text
            accessibilityRole="link"
            style={styles.developerCreditPill}
            onPress={() => Linking.openURL("https://pompomelo.netlify.app/")}
          >
            pompomelo ↗
          </Text>
          <Text style={styles.developerCreditText}>
            (me! a solo dev living in toronto)
          </Text>
        </View>
      </View>
    </View>
  );
}
