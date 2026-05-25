import { Image, Linking, Text, View } from "react-native";

import { styles } from "../styles";

const pompomeloLogo = require("../assets/pompomelo_no_border.png");

export function DeveloperCredit() {
  return (
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
          onPress={() => Linking.openURL("https://pompomelo.dev/")}
        >
          pompomelo ↗
        </Text>
        <Text style={styles.developerCreditText}>
          (me! a solo dev from toronto)
        </Text>
      </View>
    </View>
  );
}
