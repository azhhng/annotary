import { Pressable, Text } from "react-native";

import { styles } from "../styles";

type Variant = "primary" | "secondary" | "danger";

const containerByVariant = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
  danger: styles.buttonDanger,
} as const;

const textByVariant = {
  primary: styles.buttonPrimaryText,
  secondary: styles.buttonSecondaryText,
  danger: styles.buttonDangerText,
} as const;

export function Button({
  variant = "primary",
  disabled = false,
  onPress,
  children,
}: {
  variant?: Variant;
  disabled?: boolean;
  onPress: () => void;
  children: string;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.buttonBase,
        containerByVariant[variant],
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={textByVariant[variant]}>{children}</Text>
    </Pressable>
  );
}
