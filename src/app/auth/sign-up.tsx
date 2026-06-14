import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FortunaLogo } from '@/components/ui/FortunaLogo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useHaptics } from '@/hooks/useHaptics';
import { useToast } from '@/providers/ToastProvider';
import { supabase } from '@/lib/supabase';

export default function SignUpScreen() {
  const theme = useTheme();
  const haptics = useHaptics();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!email.trim() || !password) { haptics.error(); Alert.alert('Missing Fields', 'Please fill in all fields.'); return; }
    if (password !== confirm) { haptics.error(); Alert.alert('Password Mismatch', 'Passwords do not match.'); return; }
    if (password.length < 6) { haptics.error(); Alert.alert('Weak Password', 'Password must be at least 6 characters.'); return; }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    setLoading(false);

    if (error) {
      haptics.error();
      toast(error.message, 'error');
    } else {
      haptics.success();
      toast('Account created! Check your email to verify.');
      router.replace('/(tabs)');
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <View style={styles.handleWrap}><View style={[styles.handle, { backgroundColor: theme.border }]} /></View>

        <View style={styles.content}>
          <View style={styles.logoRow}>
            <FortunaLogo size={56} />
            <View>
              <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
              <Text style={[styles.sub, { color: theme.textSecondary }]}>Sync your fortune everywhere</Text>
            </View>
          </View>

          <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" returnKeyType="next" />
          <Input label="Password" placeholder="Min. 6 characters" value={password} onChangeText={setPassword} secureTextEntry returnKeyType="next" />
          <Input label="Confirm Password" placeholder="Repeat password" value={confirm} onChangeText={setConfirm} secureTextEntry returnKeyType="done" />

          <Button label="Create Account" onPress={handleSignUp} loading={loading} fullWidth size="lg" style={styles.btn} />

          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: theme.textMuted }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/auth/sign-in')}>
              <Text style={[styles.switchLink, { color: theme.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.back()} style={styles.skip}>
            <Text style={[styles.skipLabel, { color: theme.textMuted }]}>Use without account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  kav: { flex: 1 },
  handleWrap: { alignItems: 'center', paddingTop: Spacing.sm },
  handle: { width: 40, height: 4, borderRadius: 2 },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, gap: Spacing.md },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '800' },
  sub: { fontSize: FontSize.sm, marginTop: 2 },
  btn: { marginTop: Spacing.sm },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchText: { fontSize: FontSize.sm },
  switchLink: { fontSize: FontSize.sm, fontWeight: '700' },
  skip: { alignItems: 'center', paddingVertical: Spacing.sm },
  skipLabel: { fontSize: FontSize.sm },
});
