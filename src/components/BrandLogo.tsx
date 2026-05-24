import { Image, Text, View } from "react-native";

import { styles } from "../styles";

const paperclipIcon = require("../emoji-assets/linked_paperclip.svg");

export function BrandLogo() {
  return (
    <View style={styles.logoLockup}>
      <Image
        accessibilityIgnoresInvertColors
        source={paperclipIcon}
        style={styles.logoIcon}
      />
      <Text style={styles.logo}>Annotary</Text>
    </View>
  );
}
