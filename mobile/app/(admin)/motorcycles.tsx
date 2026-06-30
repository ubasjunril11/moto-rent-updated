import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { motorcycleService } from '@/services/motorcycleService';
import { Motorcycle } from '@/types';
import MotorcycleCard from '@/components/MotorcycleCard';
import EmptyState from '@/components/EmptyState';
import { COLORS } from '@/constants/theme';

export default function AdminMotorcyclesScreen() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await motorcycleService.getAll();
      if (res.success && res.data) setMotorcycles(res.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const handleDelete = (m: Motorcycle) => {
    Alert.alert('Delete Motorcycle', `Remove ${m.brand} ${m.model}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await motorcycleService.delete(m.id);
            loadData();
          } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Delete failed';
            Alert.alert('Error', msg);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/admin/motorcycle-form')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {loading ? (
        <EmptyState title="Loading..." loading />
      ) : (
        <FlatList
          data={motorcycles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MotorcycleCard
              motorcycle={item}
              onPress={() => router.push({ pathname: '/admin/motorcycle-form', params: { id: item.id } })}
              onEdit={() => router.push({ pathname: '/admin/motorcycle-form', params: { id: item.id } })}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />}
          ListEmptyComponent={<EmptyState icon="bicycle-outline" title="No motorcycles" message="Tap + to add a listing." />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, paddingBottom: 80 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.admin, alignItems: 'center', justifyContent: 'center', elevation: 6, zIndex: 10 },
});
