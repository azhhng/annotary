import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { styles } from "../styles";

export function SectionHeader({
  title,
  body,
  accessory,
}: {
  title: string;
  body?: string;
  accessory?: ReactNode;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {body ? <Text style={styles.sectionSubtitle}>{body}</Text> : null}
      </View>
      {accessory}
    </View>
  );
}
