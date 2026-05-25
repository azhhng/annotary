import { Image, Text, View } from "react-native";

import { brandIcon } from "../constants/brandAssets";
import { styles } from "../styles";

export function BrandLogo() {
  return (
    <View style={styles.logoLockup}>
      <Image
        accessibilityIgnoresInvertColors
        source={brandIcon}
        style={styles.logoIcon}
      />
      <Text style={styles.logo}>Annotary</Text>
    </View>
  );
}
