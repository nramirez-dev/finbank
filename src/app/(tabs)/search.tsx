import { useState, useMemo, useEffect, useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useResponsive } from '@/lib/useResponsive';
import { useThemeColors, type ThemeColors } from '@/lib/useThemeColors';

import { useTransactions } from '@/hooks/useTransactions';
import type { TransactionFilters } from '@/services/transactionService';
import { SearchBar } from '@/components/molecules/SearchBar';
import { FilterChip } from '@/components/molecules/FilterChip';
import { TransactionCard } from '@/components/molecules/TransactionCard';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { SkeletonRow } from '@/components/atoms/Skeleton';
import { ErrorState } from '@/components/organisms/ErrorState';
import { EmptyState } from '@/components/organisms/EmptyState';
import type { Transaction } from '@/domain/entities/Transaction';

const PAGE_SIZE = 10;

type TypeFilter = Transaction['type'] | 'todos';

interface ExpandedFiltersProps {
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  onChangeDateFrom: (v: string) => void;
  onChangeDateTo: (v: string) => void;
  onChangeMinAmount: (v: string) => void;
  onChangeMaxAmount: (v: string) => void;
  onClear: () => void;
  c: ThemeColors;
}

const ExpandedFilters = ({
  dateFrom,
  dateTo,
  minAmount,
  maxAmount,
  onChangeDateFrom,
  onChangeDateTo,
  onChangeMinAmount,
  onChangeMaxAmount,
  onClear,
  c,
}: ExpandedFiltersProps) => (
  <View style={[styles.expandedPanel, { backgroundColor: c.surface, borderColor: c.border }]}>
    <View style={styles.expandedGroup}>
      <Text style={[styles.expandedLabel, { color: c.textSecondary }]}>Rango de fechas</Text>
      <View style={styles.expandedRow}>
        <View style={styles.expandedHalf}>
          <Input label="Desde" value={dateFrom} onChangeText={onChangeDateFrom} placeholder="YYYY-MM-DD" />
        </View>
        <View style={styles.expandedHalf}>
          <Input label="Hasta" value={dateTo} onChangeText={onChangeDateTo} placeholder="YYYY-MM-DD" />
        </View>
      </View>
    </View>

    <View style={styles.expandedGroup}>
      <Text style={[styles.expandedLabel, { color: c.textSecondary }]}>Rango de monto</Text>
      <View style={styles.expandedRow}>
        <View style={styles.expandedHalf}>
          <Input label="Mínimo" value={minAmount} onChangeText={onChangeMinAmount} keyboardType="numeric" />
        </View>
        <View style={styles.expandedHalf}>
          <Input label="Máximo" value={maxAmount} onChangeText={onChangeMaxAmount} keyboardType="numeric" />
        </View>
      </View>
    </View>

    <Button label="Limpiar filtros" onPress={onClear} variant="ghost" size="sm" />
  </View>
);

export default function SearchScreen() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('todos');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, dateFrom, dateTo, minAmount, maxAmount]);

  const filters = useMemo<TransactionFilters>(() => ({
    ...(search && { search }),
    ...(typeFilter !== 'todos' && { type: typeFilter }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
    ...(minAmount && { minAmount: parseFloat(minAmount) }),
    ...(maxAmount && { maxAmount: parseFloat(maxAmount) }),
  }), [search, typeFilter, dateFrom, dateTo, minAmount, maxAmount]);

  const { data: allTransactions, isLoading, isError, refetch } = useTransactions(filters);

  const paginatedData = useMemo(
    () => (allTransactions ?? []).slice(0, page * PAGE_SIZE),
    [allTransactions, page],
  );

  const total = allTransactions?.length ?? 0;
  const hasMore = total > paginatedData.length;
  const remaining = total - paginatedData.length;
  const hasExpandedFilters = !!(dateFrom || dateTo || minAmount || maxAmount);

  const handleClearExpanded = useCallback(() => {
    setDateFrom('');
    setDateTo('');
    setMinAmount('');
    setMaxAmount('');
  }, []);

  const handlePressTx = useCallback(
    (tx: Transaction) => router.push(`/transaction/${tx.id}`),
    [router],
  );

  const loadMore = useCallback(() => setPage((p) => p + 1), []);

  const { px, fontScale } = useResponsive();
  const c = useThemeColors();

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      {/* Fixed header */}
      <View style={[styles.header, { paddingHorizontal: px }]}>
        <Text style={[styles.headerTitle, { fontSize: 32 + fontScale, color: c.text }]}>Buscar</Text>
        <Text style={[styles.headerSubtitle, { color: c.textSecondary }]}>Encuentra tus transacciones</Text>
      </View>

      <View style={[styles.controls, { backgroundColor: c.bg }]}>
        <SearchBar value={search} onChangeText={setSearch} />

        <View style={[styles.chipsRow, { backgroundColor: c.bg }]}>
          <FilterChip selected={typeFilter} onChange={setTypeFilter} />
        </View>

        <View style={styles.metaRow}>
          <Pressable
            onPress={() => setFiltersOpen((prev) => !prev)}
            hitSlop={8}
            style={styles.moreFiltersBtn}
          >
            <Text style={styles.moreFiltersText}>
              {filtersOpen ? 'Ocultar filtros' : 'Más filtros'}
            </Text>
            {hasExpandedFilters && <View style={styles.filterDot} />}
          </Pressable>

          {!isLoading && (
            <Text style={[styles.resultCount, { color: c.textSecondary }]}>
              {total} {total === 1 ? 'transacción encontrada' : 'transacciones encontradas'}
            </Text>
          )}
        </View>

        {filtersOpen && (
          <ExpandedFilters
            dateFrom={dateFrom}
            dateTo={dateTo}
            minAmount={minAmount}
            maxAmount={maxAmount}
            onChangeDateFrom={setDateFrom}
            onChangeDateTo={setDateTo}
            onChangeMinAmount={setMinAmount}
            onChangeMaxAmount={setMaxAmount}
            onClear={handleClearExpanded}
            c={c}
          />
        )}
      </View>

      {/* Results */}
      {isLoading ? (
        <View>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </View>
      ) : isError ? (
        <ErrorState message="Error al buscar transacciones" onRetry={refetch} />
      ) : (
        <FlatList
          data={paginatedData}
          keyExtractor={(item) => item.id}
          style={[styles.flatList, { backgroundColor: c.bg }]}
          renderItem={({ item }) => (
            <TransactionCard transaction={item} onPress={() => handlePressTx(item)} />
          )}
          ListEmptyComponent={
            <EmptyState
              message={
                hasExpandedFilters || search || typeFilter !== 'todos'
                  ? 'No se encontraron transacciones con esos filtros'
                  : 'No hay transacciones'
              }
            />
          }
          ListFooterComponent={
            hasMore ? (
              <View style={styles.loadMoreWrapper}>
                <Button
                  label={`Cargar más (${remaining} restantes)`}
                  onPress={loadMore}
                  variant="ghost"
                  size="sm"
                />
              </View>
            ) : paginatedData.length > 0 ? (
              <Text style={[styles.endText, { color: c.textMuted }]}>Fin de los resultados</Text>
            ) : null
          }
          contentContainerStyle={[styles.listContent, { backgroundColor: c.bg }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 56,
    paddingBottom: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 15,
    marginBottom: 16,
  },
  controls: {
    gap: 12,
    paddingBottom: 8,
    backgroundColor: '#0f172a',
  },
  chipsRow: {
    backgroundColor: '#0f172a',
  },
  flatList: {
    backgroundColor: '#0f172a',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  moreFiltersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moreFiltersText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  filterDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  resultCount: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
  },
  expandedPanel: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 16,
  },
  expandedGroup: {
    gap: 8,
  },
  expandedLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  expandedRow: {
    flexDirection: 'row',
    gap: 12,
  },
  expandedHalf: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    backgroundColor: '#0f172a',
  },
  loadMoreWrapper: {
    paddingVertical: 12,
  },
  endText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    paddingVertical: 16,
  },
});
