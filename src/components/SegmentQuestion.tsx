import { Pressable, Text, View } from "react-native";

import {
  pickerSelectedPillStyle,
  pickerTintedPillStyle,
  tintedTextStyle,
} from "../constants/personalityColors";
import { styles } from "../styles";

export function SegmentQuestion({
  title,
  options,
  active,
  wide,
  onSelect,
}: {
  title: string;
  options: string[];
  active?: string;
  wide?: boolean;
  onSelect: (option: string) => void;
}) {
  return (
    <View style={[styles.segmentQuestion, wide && styles.segmentQuestionWide]}>
      <Text style={styles.questionTitle}>{title}</Text>
      <View style={styles.segmentRow}>
        {options.map((option) => {
          const selected = option === active;

          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={[
                styles.pill,
                pickerTintedPillStyle(option),
                selected && styles.pillActive,
                selected && pickerSelectedPillStyle(option),
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  tintedTextStyle(option),
                  selected && styles.pillTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
