import { Text, View } from "react-native";

import { bookQuestions } from "../constants/books";
import type { Book } from "../types";
import { styles } from "../styles";

export function BookRow({ book, grid = false }: { book: Book; grid?: boolean }) {
  return (
    <View style={[styles.bookRow, grid && styles.bookRowGrid]}>
      <View style={styles.bookRowCopy}>
        <Text style={styles.rowPrompt}>
          {book.question ?? bookQuestions[book.slot]}
        </Text>
        <View style={styles.bookRowHeader}>
          <Text style={styles.rowTitle}>{book.title}</Text>
          <Text style={styles.rowAuthor}>{book.author}</Text>
        </View>
        <Text style={styles.rowWhy}>{book.why}</Text>
      </View>
    </View>
  );
}
