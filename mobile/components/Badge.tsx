import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, STATUS_COLORS } from '@/constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
  style?: ViewStyle;
}

const LABEL_MAP: Record<string, string> = {
  cancel_requested: 'Cancel Requested',
};

export default function Badge({ label, color, style }: BadgeProps) {
  const key = label.toLowerCase();
  const bgColor = color || STATUS_COLORS[key] || COLORS.textSecondary;
  const displayLabel = LABEL_MAP[key] ?? label;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor + '20' }, style]}>
      <Text style={[styles.text, { color: bgColor }]}>{displayLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
});
