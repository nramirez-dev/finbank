import { useState, useMemo, useEffect, useCallback } from 'react';
import { FlatList, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

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
}: ExpandedFiltersProps) => (
  <View className="mx-4 p-4 bg-white dark:bg-dark-surface rounded-xl border border-slate-200 dark:border-slate-700 gap-4">
    <View className="gap-2">
      <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Rango de fechas
      </Text>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            label="Desde"
            value={dateFrom}
            onChangeText={onChangeDateFrom}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View className="flex-1">
          <Input
            label="Hasta"
            value={dateTo}
            onChangeText={onChangeDateTo}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>
    </View>

    <View className="gap-2">
      <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Rango de monto
      </Text>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            label="Mínimo"
            value={minAmount}
            onChangeText={onChangeMinAmount}
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <Input
            label="Máximo"
            value={maxAmount}
            onChangeText={onChangeMaxAmount}
            keyboardType="numeric"
          />
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

  // Reset page whenever filters change
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

  return (
    <View className="flex-1 bg-slate-50 dark:bg-dark-bg">
      {/* Fixed header — search + filters */}
      <View className="pt-14 pb-3 gap-3 bg-slate-50 dark:bg-dark-bg">
        <Text className="px-4 text-2xl font-bold text-slate-900 dark:text-white">Buscar</Text>

        <SearchBar value={search} onChangeText={setSearch} />

        <FilterChip selected={typeFilter} onChange={setTypeFilter} />

        <View className="px-4 flex-row items-center justify-between">
          <Pressable
            onPress={() => setFiltersOpen((prev) => !prev)}
            hitSlop={8}
            className="flex-row items-center gap-2"
          >
            <Text className="text-sm font-medium text-primary">
              {filtersOpen ? 'Ocultar filtros' : 'Más filtros'}
            </Text>
            {hasExpandedFilters && (
              <View className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Pressable>

          {!isLoading && (
            <Text className="text-xs text-slate-500 dark:text-slate-400">
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
              <View className="px-4 py-4">
                <Button
                  label={`Cargar más (${remaining} restantes)`}
                  onPress={loadMore}
                  variant="ghost"
                  size="sm"
                />
              </View>
            ) : paginatedData.length > 0 ? (
              <Text className="text-center text-xs text-slate-400 dark:text-slate-600 py-4">
                Fin de los resultados
              </Text>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}
