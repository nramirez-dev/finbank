import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
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
} from 'lucide-react-native';

import { useProfile, useProfiles } from '@/hooks/useProfile';
import { useAccountsByOwner } from '@/hooks/useAccounts';
import { useAppStore } from '@/store/useAppStore';
import { useThemeStore } from '@/store/useThemeStore';
import { formatCurrency } from '@/lib/formatCurrency';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { Account } from '@/domain/entities/Account';

const ACCOUNT_GRADIENTS: Record<Account['type'], [string, string]> = {
  corriente: ['#3b82f6', '#1d4ed8'],
  ahorros:   ['#10b981', '#047857'],
};

export default function ProfileScreen() {
  const { activeProfileId, setActiveProfile } = useAppStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [notifications, setNotifications] = useState(true);

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: profiles = [] } = useProfiles();
  const { data: accounts = [], isLoading: accountsLoading } = useAccountsByOwner(activeProfileId);

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
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* ── Header ── */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Perfil</Text>
      </View>

      {/* ── Profile card ── */}
      <View style={styles.sectionPadded}>
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileGradient}
        >
          {profileLoading ? (
            <View style={{ alignItems: 'center', gap: 12 }}>
              <Skeleton width={100} height={100} borderRadius={50} />
              <Skeleton width={140} height={20} borderRadius={8} />
              <Skeleton width={180} height={14} borderRadius={6} />
            </View>
          ) : (
            <>
              {profile?.avatar ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarLetter}>{profile?.name?.[0] ?? 'U'}</Text>
                </View>
              )}
              <Text style={styles.profileName}>{profile?.name ?? '—'}</Text>
              <Text style={styles.profileEmail}>{profile?.email ?? '—'}</Text>
              <View style={styles.verifiedBadge}>
                <Shield size={12} color="#10b981" strokeWidth={2} />
                <Text style={styles.verifiedText}>Verificado</Text>
              </View>
            </>
          )}
        </LinearGradient>
      </View>

      {/* ── Profile switcher ── */}
      {profiles.length > 1 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cambiar perfil</Text>
          {profiles.map((p) => (
            <Pressable
              key={p.id}
              style={[styles.settingItem, p.id === activeProfileId && styles.settingItemActive]}
              onPress={() => setActiveProfile(p.id)}
            >
              <View style={[styles.settingIcon, { backgroundColor: 'rgba(59,130,246,0.12)' }]}>
                <Text style={styles.profileInitial}>{p.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>{p.name}</Text>
                <Text style={styles.settingSubLabel}>{p.email}</Text>
              </View>
              {p.id === activeProfileId && (
                <View style={styles.activeDot} />
              )}
            </Pressable>
          ))}
        </View>
      )}

      {/* ── Accounts ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Cuentas</Text>
        {accountsLoading ? (
          [1, 2].map((i) => <Skeleton key={i} height={72} borderRadius={16} style={styles.skeletonAccount} />)
        ) : accounts.length === 0 ? (
          <Text style={styles.emptyText}>Sin cuentas asociadas</Text>
        ) : (
          accounts.map((account) => (
            <View key={account.id} style={styles.accountItem}>
              <LinearGradient
                colors={ACCOUNT_GRADIENTS[account.type]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.accountMiniCard}
              >
                <CreditCard size={20} color="#fff" strokeWidth={2} />
              </LinearGradient>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{account.type} · {account.currency}</Text>
                <Text style={styles.accountNumber}>**** {account.id.slice(-4)}</Text>
              </View>
              <Text style={styles.accountBalance}>
                {formatCurrency(account.balance, account.currency)}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* ── Preferences ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>

        <View style={styles.settingItem}>
          <View style={[styles.settingIcon, { backgroundColor: 'rgba(59,130,246,0.12)' }]}>
            <Moon size={20} color="#3b82f6" strokeWidth={2} />
          </View>
          <Text style={styles.settingLabel}>Modo oscuro</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#3b82f6' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={[styles.settingIcon, { backgroundColor: 'rgba(245,158,11,0.12)' }]}>
            <Bell size={20} color="#f59e0b" strokeWidth={2} />
          </View>
          <Text style={styles.settingLabel}>Notificaciones</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#3b82f6' }}
            thumbColor="#fff"
          />
        </View>

        <Pressable style={styles.settingItem}>
          <View style={[styles.settingIcon, { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
            <Globe size={20} color="#10b981" strokeWidth={2} />
          </View>
          <Text style={styles.settingLabel}>Idioma</Text>
          <Text style={styles.settingValue}>Español</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.25)" strokeWidth={2} />
        </Pressable>

        <Pressable style={styles.settingItem}>
          <View style={[styles.settingIcon, { backgroundColor: 'rgba(236,72,153,0.12)' }]}>
            <Smartphone size={20} color="#ec4899" strokeWidth={2} />
          </View>
          <Text style={styles.settingLabel}>Dispositivos</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.25)" strokeWidth={2} />
        </Pressable>
      </View>

      {/* ── Security ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seguridad</Text>

        <Pressable style={styles.settingItem}>
          <View style={[styles.settingIcon, { backgroundColor: 'rgba(239,68,68,0.12)' }]}>
            <Lock size={20} color="#ef4444" strokeWidth={2} />
          </View>
          <Text style={styles.settingLabel}>Cambiar PIN</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.25)" strokeWidth={2} />
        </Pressable>

        <Pressable style={styles.settingItem}>
          <View style={[styles.settingIcon, { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
            <Shield size={20} color="#10b981" strokeWidth={2} />
          </View>
          <Text style={styles.settingLabel}>Autenticación</Text>
          <Text style={styles.settingValue}>Biométrico</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.25)" strokeWidth={2} />
        </Pressable>
      </View>

      {/* ── Support ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soporte</Text>

        <Pressable style={styles.settingItem}>
          <View style={[styles.settingIcon, { backgroundColor: 'rgba(59,130,246,0.12)' }]}>
            <HelpCircle size={20} color="#3b82f6" strokeWidth={2} />
          </View>
          <Text style={styles.settingLabel}>Centro de ayuda</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.25)" strokeWidth={2} />
        </Pressable>

        <Pressable style={styles.settingItem}>
          <View style={[styles.settingIcon, { backgroundColor: 'rgba(245,158,11,0.12)' }]}>
            <Mail size={20} color="#f59e0b" strokeWidth={2} />
          </View>
          <Text style={styles.settingLabel}>Contacto</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.25)" strokeWidth={2} />
        </Pressable>
      </View>

      {/* ── Logout ── */}
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={20} color="#ef4444" strokeWidth={2} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Text style={styles.footerVersion}>FinBank v1.0.0</Text>
        <Text style={styles.footerCopy}>© 2026 FinBank. Todos los derechos reservados.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  pageHeader: {
    paddingTop: 56,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
  },
  sectionPadded: {
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 12,
  },
  profileGradient: {
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#3b82f6',
  },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59,130,246,0.18)',
    borderWidth: 3,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLetter: {
    color: '#3b82f6',
    fontSize: 40,
    fontWeight: '700',
  },
  profileName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginBottom: 14,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
  },
  verifiedText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 16,
    marginBottom: 10,
    gap: 12,
  },
  settingItemActive: {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59,130,246,0.07)',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  settingSubLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 2,
  },
  settingValue: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    marginRight: 6,
  },
  profileInitial: {
    color: '#3b82f6',
    fontSize: 18,
    fontWeight: '700',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  skeletonAccount: {
    marginBottom: 10,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 12,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 16,
    marginBottom: 10,
    gap: 12,
  },
  accountMiniCard: {
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
    textTransform: 'capitalize',
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
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
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
