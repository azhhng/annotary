import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { styles } from "../styles";

export function ScreenHeader({
  title,
  body,
  accessory,
}: {
  title: string;
  body: string;
  accessory?: ReactNode;
}) {
  return (
    <View style={styles.screenHeader}>
      <View style={styles.screenHeaderCopy}>
        <Text style={styles.screenTitle}>{title}</Text>
        <Text style={styles.screenBody}>{body}</Text>
      </View>
      {accessory}
    </View>
  );
}
