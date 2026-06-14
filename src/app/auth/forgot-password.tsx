import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FortunaLogo } from '@/components/ui/FortunaLogo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useHaptics } from '@/hooks/useHaptics';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const haptics = useHaptics();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSend() {
    setError('');
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      haptics.error();
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      haptics.error();
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.resetPasswordForEmail(trimmed);
    setLoading(false);

    if (authError) {
      haptics.error();
      setError(authError.message);
    } else {
      haptics.success();
      setSent(true);
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
              <Text style={[styles.title, { color: theme.text }]}>Reset Password</Text>
              <Text style={[styles.sub, { color: theme.textSecondary }]}>We'll send a reset link to your inbox</Text>
            </View>
          </View>

          {sent ? (
            <View style={[styles.successBox, { backgroundColor: theme.primaryDim, borderColor: theme.primary + '44' }]}>
              <Text style={styles.successIcon}>✉️</Text>
              <Text style={[styles.successText, { color: theme.text }]}>
                Check your inbox — reset link sent to
              </Text>
              <Text style={[styles.successEmail, { color: theme.primary }]}>{email.trim().toLowerCase()}</Text>
            </View>
          ) : (
            <>
              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={v => { setEmail(v.toLowerCase()); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                autoFocus
              />

              {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}

              <Button
                label="Send Reset Link"
                onPress={handleSend}
                loading={loading}
                fullWidth
                size="lg"
                style={styles.btn}
              />
            </>
          )}

          <TouchableOpacity onPress={() => router.back()} style={styles.backWrap} accessibilityLabel="Back to sign in">
            <Text style={[styles.backLabel, { color: theme.primary }]}>← Back to Sign In</Text>
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
  successBox: { borderRadius: 12, borderWidth: 1, padding: Spacing.lg, alignItems: 'center', gap: Spacing.sm },
  successIcon: { fontSize: 36 },
  successText: { fontSize: FontSize.md, textAlign: 'center' },
  successEmail: { fontSize: FontSize.md, fontWeight: '700' },
  errorText: { fontSize: FontSize.sm },
  btn: { marginTop: Spacing.xs },
  backWrap: { alignItems: 'center', paddingVertical: Spacing.sm },
  backLabel: { fontSize: FontSize.sm, fontWeight: '600' },
});
