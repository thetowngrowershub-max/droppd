import { transitBlueColors, transitBlueRadii } from '@droppd/shared';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function PrimaryButton({ label, onPress, loading, disabled, variant = 'primary' }: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? transitBlueColors.primary : '#10182B'} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'secondary' && { color: transitBlueColors.primary },
            variant === 'danger' && { color: transitBlueColors.danger },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: transitBlueRadii.lg,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: transitBlueColors.accent,
    shadowColor: transitBlueColors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  secondary: {
    backgroundColor: transitBlueColors.surfaceTint,
    borderWidth: 1,
    borderColor: transitBlueColors.border,
  },
  danger: {
    backgroundColor: transitBlueColors.dangerBg,
    borderWidth: 1,
    borderColor: transitBlueColors.dangerBorder,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10182B',
  },
});
