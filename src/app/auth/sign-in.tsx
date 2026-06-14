import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
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
import { useToast } from '@/providers/ToastProvider';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const theme = useTheme();
  const haptics = useHaptics();
  const toast = useToast();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignIn() {
    setError('');
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      haptics.error();
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
    setLoading(false);

    if (authError) {
      haptics.error();
      setError(authError.message);
    } else {
      haptics.success();
      toast('Welcome back!');
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
              <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>
              <Text style={[styles.sub, { color: theme.textSecondary }]}>Sync your fortune across devices</Text>
            </View>
          </View>

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={v => { setEmail(v.toLowerCase()); setError(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />

          <View style={styles.passwordWrap}>
            <Input
              ref={passwordRef}
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={v => { setPassword(v); setError(''); }}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(p => !p)}
              hitSlop={12}
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              <Text style={[styles.eyeIcon, { color: theme.textMuted }]}>{showPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/auth/forgot-password')}
            style={styles.forgotWrap}
            accessibilityLabel="Forgot password"
          >
            <Text style={[styles.forgotLabel, { color: theme.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}

          <Button
            label="Sign In"
            onPress={handleSignIn}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.btn}
          />

          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: theme.textMuted }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/auth/sign-up')}>
              <Text style={[styles.switchLink, { color: theme.primary }]}>Sign Up</Text>
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
  passwordWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: Spacing.md, bottom: 16 },
  eyeIcon: { fontSize: 18 },
  forgotWrap: { alignSelf: 'flex-end', marginTop: -Spacing.xs },
  forgotLabel: { fontSize: FontSize.sm, fontWeight: '600' },
  errorText: { fontSize: FontSize.sm, textAlign: 'center' },
  btn: { marginTop: Spacing.xs },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchText: { fontSize: FontSize.sm },
  switchLink: { fontSize: FontSize.sm, fontWeight: '700' },
  skip: { alignItems: 'center', paddingVertical: Spacing.sm },
  skipLabel: { fontSize: FontSize.sm },
});
