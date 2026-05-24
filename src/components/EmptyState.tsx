import { Text, View } from "react-native";

import { styles } from "../styles";
import type { EmptyStateQuote } from "../constants/quotes";

export function EmptyState({
  title,
  quote,
}: {
  title: string;
  quote: EmptyStateQuote;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateCopy}>
        <Text style={styles.emptyStateTitle}>{title}</Text>
        <Text style={styles.emptyStateQuote}>
          <Text style={styles.emptyStateQuoteText}>{quote.text}</Text>
          <Text> {quote.attribution}</Text>
        </Text>
      </View>
    </View>
  );
}
