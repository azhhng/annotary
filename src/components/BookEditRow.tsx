import { Text, TextInput, View } from "react-native";

import { shelfDescriptionMaxLength } from "../constants/shelf";
import { colors, styles } from "../styles";
import type { ShelfBookInput } from "../types";

type EditableField = "title" | "author" | "why";

export function BookEditRow({
  book,
  prompt,
  onChange,
}: {
  book: ShelfBookInput;
  prompt: string;
  onChange: (field: EditableField, value: string) => void;
}) {
  return (
    <View style={[styles.bookRow, styles.bookRowGrid, styles.setupBookRow]}>
      <Text style={styles.rowPrompt}>{prompt}</Text>
      <TextInput
        onChangeText={(value) => onChange("title", value)}
        placeholder="Book title"
        placeholderTextColor={colors.placeholder}
        style={styles.rowTitleInput}
        value={book.title}
      />
      <TextInput
        onChangeText={(value) => onChange("author", value)}
        placeholder="Author"
        placeholderTextColor={colors.placeholder}
        style={styles.rowAuthorInput}
        value={book.author}
      />
      <TextInput
        maxLength={shelfDescriptionMaxLength}
        multiline
        numberOfLines={4}
        onChangeText={(value) => onChange("why", value)}
        placeholder="Why this book belongs here"
        placeholderTextColor={colors.placeholder}
        scrollEnabled
        style={styles.rowWhyInput}
        value={book.why}
      />
      <Text style={styles.characterCounter}>
        {book.why.length}/{shelfDescriptionMaxLength}
      </Text>
    </View>
  );
}
