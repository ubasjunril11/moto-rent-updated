import { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { bookingService } from '@/services/bookingService';
import { useNotifications } from '@/context/NotificationContext';
import { Booking } from '@/types';
import BookingCard from '@/components/BookingCard';
import EmptyState from '@/components/EmptyState';
import AppModal from '@/components/AppModal';
import { COLORS } from '@/constants/theme';

const FILTERS: { label: string; value: string | undefined }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Cancel Req.', value: 'cancel_requested' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Completed', value: 'completed' },
  { label: 'All', value: undefined },
];

function getActionLabel(status: string): string {
  if (status === 'approved') return 'Approve';
  if (status === 'rejected') return 'Reject';
  if (status === 'cancelled') return 'Approve Cancel';
  return 'Reject Cancel';
}

function getFeedbackTitle(status: string): string {
  if (status === 'approved') return 'Booking Approved!';
  if (status === 'cancelled') return 'Cancellation Approved';
  if (status === 'rejected') return 'Booking Rejected';
  return 'Cancel Request Rejected';
}

function getFeedbackMessage(booking: Booking, status: string): string {
  const name = booking.customer_name ?? 'Customer';
  const bike = `${booking.brand} ${booking.model}`;
  if (status === 'approved') return `${name}'s booking for ${bike} has been approved.`;
  if (status === 'cancelled') return `${name}'s cancellation request for ${bike} has been approved.`;
  if (status === 'rejected') return `${name}'s booking for ${bike} has been rejected.`;
  return `${name}'s cancellation request for ${bike} has been rejected. Booking remains active.`;
}

export default function AdminBookingsScreen() {
  const { markAllRead } = useNotifications();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | undefined>('pending');

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    booking: Booking | null;
    status: string;
  }>({ visible: false, booking: null, status: '' });

  const [feedbackModal, setFeedbackModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({ visible: false, title: '', message: '', type: 'success' });

  const loadData = useCallback(async () => {
    try {
      const res = await bookingService.getAll(filter);
      if (res.success && res.data) setBookings(res.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      loadData();
      markAllRead();
    }, [loadData, markAllRead])
  );

  const handleAction = (booking: Booking, status: string) => {
    setConfirmModal({ visible: true, booking, status });
  };

  const confirmAction = async () => {
    const { booking, status } = confirmModal;
    setConfirmModal({ visible: false, booking: null, status: '' });

    if (!booking) return;

    try {
      await bookingService.updateStatus(booking.id, status);
      await loadData();
      setFeedbackModal({
        visible: true,
        title: getFeedbackTitle(status),
        message: getFeedbackMessage(booking, status),
        type: 'success',
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update booking status.';
      setFeedbackModal({
        visible: true,
        title: 'Action Failed',
        message: msg,
        type: 'error',
      });
    }
  };

  const actionLabel = getActionLabel(confirmModal.status);

  const confirmMessage = confirmModal.booking
    ? confirmModal.status === 'cancelled'
      ? `Approve the cancellation request from ${confirmModal.booking.customer_name} for ${confirmModal.booking.brand} ${confirmModal.booking.model}?`
      : confirmModal.status === 'approved' && confirmModal.booking.status === 'cancel_requested'
      ? `Reject the cancellation request? The booking for ${confirmModal.booking.brand} ${confirmModal.booking.model} will remain active.`
      : `Are you sure you want to ${actionLabel.toLowerCase()} ${confirmModal.booking.customer_name}'s booking for ${confirmModal.booking.brand} ${confirmModal.booking.model}?`
    : '';

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.label}
            style={[styles.filterChip, filter === f.value && styles.filterActive]}
            onPress={() => {
              setLoading(true);
              setFilter(f.value);
            }}
          >
            <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <EmptyState title="Loading..." loading />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BookingCard booking={item} showCustomer onAction={(status) => handleAction(item, status)} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadData();
              }}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No bookings"
              message={filter ? `No ${filter.replace('_', ' ')} bookings.` : 'No bookings found.'}
            />
          }
        />
      )}

      <AppModal
        visible={confirmModal.visible}
        title={`${actionLabel}?`}
        message={confirmMessage}
        type="confirm"
        confirmText={actionLabel}
        cancelText="Back"
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ visible: false, booking: null, status: '' })}
      />

      <AppModal
        visible={feedbackModal.visible}
        title={feedbackModal.title}
        message={feedbackModal.message}
        type={feedbackModal.type}
        onConfirm={() => setFeedbackModal((m) => ({ ...m, visible: false }))}
        onCancel={() => setFeedbackModal((m) => ({ ...m, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  filterRow: { flexDirection: 'row', padding: 12, gap: 8, flexWrap: 'wrap' },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterActive: { backgroundColor: COLORS.admin, borderColor: COLORS.admin },
  filterText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: '#fff' },
  list: { padding: 16, flexGrow: 1 },
});
