import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '@/types';
import { COLORS } from '@/constants/theme';
import Badge from './Badge';

interface BookingCardProps {
  booking: Booking;
  onPress?: () => void;
  showCustomer?: boolean;
  onAction?: (action: string) => void;
  onCancel?: () => void;
  onRequestCancel?: () => void;
}

export default function BookingCard({ booking, onPress, showCustomer, onAction, onCancel, onRequestCancel }: BookingCardProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });

  const content = (
    <>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>
            {booking.brand} {booking.model}
          </Text>
          {showCustomer && booking.customer_name && (
            <Text style={styles.customer}>{booking.customer_name}</Text>
          )}
        </View>
        <Badge label={booking.status} />
      </View>

      <View style={styles.dates}>
        <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
        <Text style={styles.dateText}>
          {formatDate(booking.start_date)} — {formatDate(booking.end_date)}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>₱{Number(booking.total_price).toFixed(2)}</Text>

        {/* Admin actions: pending booking → approve / reject */}
        {onAction && booking.status === 'pending' && (
          <View style={styles.actions}>
            <Pressable style={[styles.actionBtn, styles.approve]} onPress={() => onAction('approved')}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.reject]} onPress={() => onAction('rejected')}>
              <Ionicons name="close" size={18} color="#fff" />
            </Pressable>
          </View>
        )}

        {/* Admin actions: cancel_requested → approve cancel / reject cancel */}
        {onAction && booking.status === 'cancel_requested' && (
          <View style={styles.actions}>
            <Pressable style={[styles.actionBtn, styles.approve]} onPress={() => onAction('cancelled')}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.reject]} onPress={() => onAction('approved')}>
              <Ionicons name="close" size={18} color="#fff" />
            </Pressable>
          </View>
        )}

        {/* Customer action: cancel a pending booking */}
        {onCancel && booking.status === 'pending' && (
          <Pressable style={[styles.textBtn, styles.cancelBtn]} onPress={onCancel}>
            <Ionicons name="close-circle-outline" size={15} color={COLORS.error} />
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        )}

        {/* Customer action: request cancellation of an approved booking */}
        {onRequestCancel && booking.status === 'approved' && (
          <Pressable style={[styles.textBtn, styles.requestCancelBtn]} onPress={onRequestCancel}>
            <Ionicons name="alert-circle-outline" size={15} color={COLORS.warning} />
            <Text style={styles.requestCancelText}>Request Cancel</Text>
          </Pressable>
        )}

        {/* Show pending label for cancel_requested (customer view) */}
        {!onAction && booking.status === 'cancel_requested' && (
          <Text style={styles.pendingLabel}>Cancel pending review</Text>
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  titleBlock: { flex: 1, marginRight: 8 },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  customer: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  dates: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  dateText: { fontSize: 13, color: COLORS.textSecondary },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  approve: { backgroundColor: COLORS.success },
  reject: { backgroundColor: COLORS.error },
  textBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelBtn: {
    borderColor: COLORS.error,
    backgroundColor: '#fef2f2',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.error,
  },
  requestCancelBtn: {
    borderColor: COLORS.warning,
    backgroundColor: '#fffbeb',
  },
  requestCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.warning,
  },
  pendingLabel: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});
