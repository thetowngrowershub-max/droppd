import { Ionicons } from '@expo/vector-icons';
import { transitBlueColors, transitBlueRadii } from '@droppd/shared';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function ScreenHeader({ title, subtitle, onBack }: Props) {
  return (
    <View style={styles.row}>
      {onBack && (
        <Pressable accessibilityLabel="Back" onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={transitBlueColors.primary} />
        </Pressable>
      )}
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: transitBlueRadii.sm,
    borderWidth: 1,
    borderColor: transitBlueColors.border,
    backgroundColor: transitBlueColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: transitBlueColors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: transitBlueColors.textSecondary,
  },
});
