import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  Moon,
  Shield,
  Smartphone,
  Sun,
  User,
} from 'lucide-react-native';

import { useProfile, useProfiles } from '@/hooks/useProfile';
import { useAccountsByOwner } from '@/hooks/useAccounts';
import { useAppStore } from '@/store/useAppStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useThemeColors } from '@/lib/useThemeColors';
import { formatCurrency } from '@/lib/formatCurrency';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ErrorState } from '@/components/organisms/ErrorState';
import type { Account } from '@/domain/entities/Account';

const ACCOUNT_GRADIENTS: Record<Account['type'], [string, string]> = {
  corriente: ['#3b82f6', '#1d4ed8'],
  ahorros: ['#10b981', '#047857'],
};

const TYPE_LABELS: Record<Account['type'], string> = {
  corriente: 'Cuenta Corriente',
  ahorros: 'Caja de Ahorros',
};

// ─── Profile avatar chip ──────────────────────────────────────────────────────
interface ProfileChipProps {
  name: string;
  avatarUrl?: string;
  active: boolean;
  onPress: () => void;
}

const ProfileChip = ({ name, avatarUrl, active, onPress }: ProfileChipProps) => {
  const isDarkMode = useThemeStore((s) => s.isDarkMode);
  return (
  <Pressable style={styles.chip} onPress={onPress}>
    <View style={[styles.chipRing, active && styles.chipRingActive]}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.chipAvatar} />
      ) : (
        <View style={styles.chipAvatarFallback}>
          <User size={22} color="#3b82f6" strokeWidth={2} />
        </View>
      )}
    </View>
    <Text style={[styles.chipName, { color: active ? (isDarkMode ? '#ffffff' : '#0f172a') : (isDarkMode ? 'rgba(255,255,255,0.5)' : '#94A3B8'), fontWeight: active ? '700' : '500' }]} numberOfLines={1}>
      {name.split(' ')[0]}
    </Text>
    {active && <View style={styles.chipActiveDot} />}
  </Pressable>
  );
};

// ─── Setting row ──────────────────────────────────────────────────────────────
interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const SettingRow = ({ icon, label, right, onPress, isFirst, isLast }: SettingRowProps) => {
  const c = useThemeColors();
  const Inner = (
    <View style={[
      styles.row,
      { backgroundColor: c.surface, borderBottomColor: c.rowBorder },
      !isLast && styles.rowBorder,
      isFirst && styles.rowFirst,
      isLast && styles.rowLast,
    ]}>
      {icon}
      <Text style={[styles.rowLabel, { color: c.text }]}>{label}</Text>
      <View style={styles.rowRight}>{right}</View>
    </View>
  );

  return onPress ? <Pressable onPress={onPress}>{Inner}</Pressable> : Inner;
};

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { activeProfileId, setActiveProfile } = useAppStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const c = useThemeColors();
  const [notifications, setNotifications] = useState(true);

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useProfile();
  const { data: profiles = [] } = useProfiles();
  const {
    data: accounts = [],
    isLoading: accountsLoading,
    isError: accountsError,
    refetch: refetchAccounts,
  } = useAccountsByOwner(activeProfileId);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: c.bg }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* ── Page title ── */}
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: c.text }]}>Perfil</Text>
      </View>

      {/* ── Profile hero card ── */}
      <View style={styles.heroPadding}>
        <LinearGradient
          colors={c.heroCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          {profileLoading ? (
            <View style={styles.heroSkeleton}>
              <Skeleton width={100} height={100} borderRadius={50} />
              <Skeleton width={150} height={22} borderRadius={8} />
              <Skeleton width={190} height={14} borderRadius={6} />
            </View>
          ) : profileError ? (
            <ErrorState message="Error al cargar perfil" onRetry={refetchProfile} />
          ) : (
            <>
              {profile?.avatar ? (
                <Image source={{ uri: profile.avatar }} style={styles.heroAvatar} />
              ) : (
                <View style={styles.heroAvatarFallback}>
                  <Text style={styles.heroAvatarLetter}>{profile?.name?.[0] ?? 'U'}</Text>
                </View>
              )}
              <Text style={styles.heroName}>{profile?.name ?? '—'}</Text>
              <Text style={styles.heroEmail}>{profile?.email ?? '—'}</Text>
              <View style={styles.verifiedBadge}>
                <Shield size={12} color="#10b981" strokeWidth={2} />
                <Text style={styles.verifiedText}>Cuenta verificada</Text>
              </View>
            </>
          )}
        </LinearGradient>
      </View>

      {/* ── Profile selector (horizontal chips) ── */}
      {profiles.length > 1 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.textSecondary }]}>Cambiar perfil</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {profiles.map((p) => (
              <ProfileChip
                key={p.id}
                name={p.name}
                avatarUrl={p.avatar}
                active={p.id === activeProfileId}
                onPress={() => setActiveProfile(p.id)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Mis Cuentas ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: c.textSecondary }]}>Mis Cuentas</Text>
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border, ...c.cardShadow }]}>
          {accountsLoading ? (
            [0, 1].map((i) => (
              <View key={i} style={[styles.row, { backgroundColor: c.surface, borderBottomColor: c.rowBorder }, i === 0 && styles.rowFirst, styles.rowBorder]}>
                <Skeleton width={44} height={44} borderRadius={12} />
                <View style={{ flex: 1, marginLeft: 12, gap: 6 }}>
                  <Skeleton width={120} height={14} borderRadius={4} />
                  <Skeleton width={80} height={11} borderRadius={4} />
                </View>
                <Skeleton width={80} height={14} borderRadius={4} />
              </View>
            ))
          ) : accountsError ? (
            <ErrorState message="Error al cargar cuentas" onRetry={refetchAccounts} />
          ) : accounts.length === 0 ? (
            <View style={[styles.row, styles.rowFirst, styles.rowLast]}>
              <Text style={[styles.emptyText, { color: c.textMuted }]}>Sin cuentas asociadas</Text>
            </View>
          ) : (
            accounts.map((account, idx) => (
              <View
                key={account.id}
                style={[
                  styles.row,
                  { backgroundColor: c.surface, borderBottomColor: c.rowBorder },
                  idx === 0 && styles.rowFirst,
                  idx === accounts.length - 1 ? styles.rowLast : styles.rowBorder,
                ]}
              >
                <LinearGradient
                  colors={ACCOUNT_GRADIENTS[account.type]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.accountIcon}
                >
                  <CreditCard size={20} color="#fff" strokeWidth={2} />
                </LinearGradient>
                <View style={styles.accountInfo}>
                  <Text style={[styles.accountName, { color: c.text }]}>{TYPE_LABELS[account.type]}</Text>
                  <Text style={[styles.accountNumber, { color: c.textSecondary }]}>**** {account.id.slice(-4)}</Text>
                </View>
                <Text style={[styles.accountBalance, { color: c.text }]}>
                  {formatCurrency(account.balance, account.currency)}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* ── Configuración ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: c.textSecondary }]}>Configuración</Text>
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border, ...c.cardShadow }]}>
          <SettingRow
            isFirst
            icon={<View style={[styles.rowIcon, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>{isDarkMode ? <Moon size={19} color="#3b82f6" strokeWidth={2} /> : <Sun size={19} color="#3b82f6" strokeWidth={2} />}</View>}
            label="Modo oscuro"
            right={
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: 'rgba(255,255,255,0.12)', true: '#3b82f6' }}
                thumbColor="#fff"
              />
            }
          />
          <SettingRow
            icon={<View style={[styles.rowIcon, { backgroundColor: 'rgba(245,158,11,0.15)' }]}><Bell size={19} color="#f59e0b" strokeWidth={2} /></View>}
            label="Notificaciones"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: 'rgba(255,255,255,0.12)', true: '#3b82f6' }}
                thumbColor="#fff"
              />
            }
          />
          <SettingRow
            onPress={() => {}}
            icon={<View style={[styles.rowIcon, { backgroundColor: 'rgba(16,185,129,0.15)' }]}><Globe size={19} color="#10b981" strokeWidth={2} /></View>}
            label="Idioma"
            right={<><Text style={[styles.rowValueText, { color: c.textSecondary }]}>Español</Text><ChevronRight size={17} color={c.textMuted} strokeWidth={2} /></>}
          />
          <SettingRow
            isLast
            onPress={() => {}}
            icon={<View style={[styles.rowIcon, { backgroundColor: 'rgba(236,72,153,0.15)' }]}><Smartphone size={19} color="#ec4899" strokeWidth={2} /></View>}
            label="Dispositivos"
            right={<ChevronRight size={17} color={c.textMuted} strokeWidth={2} />}
          />
        </View>
      </View>

      {/* ── Seguridad ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: c.textSecondary }]}>Seguridad</Text>
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border, ...c.cardShadow }]}>
          <SettingRow
            isFirst
            onPress={() => {}}
            icon={<View style={[styles.rowIcon, { backgroundColor: 'rgba(239,68,68,0.15)' }]}><Lock size={19} color="#ef4444" strokeWidth={2} /></View>}
            label="Cambiar PIN"
            right={<ChevronRight size={17} color={c.textMuted} strokeWidth={2} />}
          />
          <SettingRow
            isLast
            onPress={() => {}}
            icon={<View style={[styles.rowIcon, { backgroundColor: 'rgba(16,185,129,0.15)' }]}><Shield size={19} color="#10b981" strokeWidth={2} /></View>}
            label="Autenticación"
            right={<><Text style={[styles.rowValueText, { color: c.textSecondary }]}>Biométrico</Text><ChevronRight size={17} color={c.textMuted} strokeWidth={2} /></>}
          />
        </View>
      </View>

      {/* ── Soporte ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: c.textSecondary }]}>Soporte</Text>
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border, ...c.cardShadow }]}>
          <SettingRow
            isFirst
            onPress={() => {}}
            icon={<View style={[styles.rowIcon, { backgroundColor: 'rgba(59,130,246,0.15)' }]}><HelpCircle size={19} color="#3b82f6" strokeWidth={2} /></View>}
            label="Centro de ayuda"
            right={<ChevronRight size={17} color={c.textMuted} strokeWidth={2} />}
          />
          <SettingRow
            isLast
            onPress={() => {}}
            icon={<View style={[styles.rowIcon, { backgroundColor: 'rgba(245,158,11,0.15)' }]}><Mail size={19} color="#f59e0b" strokeWidth={2} /></View>}
            label="Contacto"
            right={<ChevronRight size={17} color={c.textMuted} strokeWidth={2} />}
          />
        </View>
      </View>

      {/* ── Sesión ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: c.textSecondary }]}>Sesión</Text>
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border, ...c.cardShadow }]}>
          <Pressable
            onPress={handleLogout}
            style={[styles.row, styles.rowFirst, styles.rowLast, { backgroundColor: isDarkMode ? c.surface : '#FEE2E2' }]}
          >
            <View style={[styles.rowIcon, { backgroundColor: isDarkMode ? 'rgba(239,68,68,0.15)' : '#FECACA' }]}>
              <LogOut size={19} color="#ef4444" strokeWidth={2} />
            </View>
            <Text style={[styles.rowLabel, { color: '#ef4444' }]}>Cerrar sesión</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Text style={[styles.footerVersion, { color: c.textMuted }]}>FinBank v1.0.0</Text>
        <Text style={[styles.footerCopy, { color: c.textMuted }]}>© 2026 FinBank. Todos los derechos reservados.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  pageHeader: {
    paddingTop: 56,
    paddingBottom: 4,
    paddingHorizontal: 20,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
  },

  // ─── Hero card ───────────────────────────────────────────────────────────
  heroPadding: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 28,
  },
  heroCard: {
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 6,
  },
  heroSkeleton: {
    alignItems: 'center',
    gap: 12,
  },
  heroAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#3b82f6',
    marginBottom: 10,
  },
  heroAvatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59,130,246,0.18)',
    borderWidth: 3,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroAvatarLetter: {
    color: '#3b82f6',
    fontSize: 40,
    fontWeight: '700',
  },
  heroName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  heroEmail: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
    marginTop: 4,
  },
  verifiedText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },

  // ─── Sections ───────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 10,
  },

  // ─── Profile chips (horizontal) ─────────────────────────────────────────
  chipsRow: {
    gap: 20,
    paddingVertical: 4,
  },
  chip: {
    alignItems: 'center',
    gap: 6,
    minWidth: 64,
  },
  chipRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  chipRingActive: {
    borderColor: '#1B4FD8',
    borderWidth: 3,
  },
  chipAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  chipAvatarFallback: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(59,130,246,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipName: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  chipActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
  },

  // ─── Card container ──────────────────────────────────────────────────────
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },

  // ─── Generic row ────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    backgroundColor: '#1e293b',
  },
  rowFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  rowLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValueText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
  },

  // ─── Account rows ────────────────────────────────────────────────────────
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  accountNumber: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  accountBalance: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  emptyText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    textAlign: 'center',
    flex: 1,
    paddingVertical: 4,
  },

  // ─── Footer ─────────────────────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 4,
  },
  footerVersion: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    fontWeight: '600',
  },
  footerCopy: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
    textAlign: 'center',
  },
});
