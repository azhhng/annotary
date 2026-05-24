import { Pressable, Text, View } from "react-native";

import { adjectiveOptions } from "../constants/adjectives";
import {
  pickerSelectedPillStyle,
  pickerTintedPillStyle,
  tintedTextStyle,
} from "../constants/personalityColors";
import { styles } from "../styles";
import { SectionHeader } from "./SectionHeader";

export function AdjectivePicker({
  selected,
  onChange,
  max = 3,
  title = "Pick three adjectives",
}: {
  selected: string[];
  onChange: (next: string[]) => void;
  max?: number;
  title?: string;
}) {
  const toggle = (word: string) => {
    if (selected.includes(word)) {
      onChange(selected.filter((item) => item !== word));
      return;
    }

    if (selected.length < max) {
      onChange([...selected, word]);
    }
  };

  return (
    <View>
      <SectionHeader
        title={title}
        accessory={
          <Text style={styles.counter}>
            {selected.length}/{max}
          </Text>
        }
      />
      <View style={[styles.chipRow, styles.sectionContent]}>
        {adjectiveOptions.map((word) => {
          const active = selected.includes(word);

          return (
            <Pressable
              key={word}
              onPress={() => toggle(word)}
              style={[
                styles.pill,
                pickerTintedPillStyle(word),
                active && styles.pillActive,
                active && pickerSelectedPillStyle(word),
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  tintedTextStyle(word),
                  active && styles.pillTextActive,
                ]}
              >
                {word}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
