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
import { useUpdateSettings } from '@/hooks/useSettings';
import { supabase } from '@/lib/supabase';

function getPasswordStrength(pw: string): { label: string; color: string; score: number } {
  if (pw.length === 0) return { label: '', color: 'transparent', score: 0 };
  if (pw.length < 6) return { label: 'Weak', color: '#F87171', score: 1 };
  if (pw.length < 10 || !/[0-9]/.test(pw)) return { label: 'Fair', color: '#F59E0B', score: 2 };
  return { label: 'Strong', color: '#10B981', score: 3 };
}

export default function SignUpScreen() {
  const theme = useTheme();
  const haptics = useHaptics();
  const toast = useToast();
  const { mutate: updateSettings } = useUpdateSettings();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const strength = getPasswordStrength(password);

  function handleConfirmBlur() {
    if (confirm && confirm !== password) {
      setConfirmError('Passwords do not match.');
    } else {
      setConfirmError('');
    }
  }

  async function handleSignUp() {
    setError('');
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) { haptics.error(); setError('Please fill in all fields.'); return; }
    if (password !== confirm) { haptics.error(); setConfirmError('Passwords do not match.'); return; }
    if (password.length < 6) { haptics.error(); setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({ email: trimmedEmail, password });
    setLoading(false);

    if (authError) {
      haptics.error();
      setError(authError.message);
    } else {
      if (name.trim()) updateSettings({ userName: name.trim() });
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

          <Input
            label="Name"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
            autoCorrect={false}
            onSubmitEditing={() => emailRef.current?.focus()}
            blurOnSubmit={false}
          />

          <Input
            ref={emailRef}
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

          <View>
            <View style={styles.passwordWrap}>
              <Input
                ref={passwordRef}
                label="Password"
                placeholder="Min. 6 characters"
                value={password}
                onChangeText={v => { setPassword(v); setError(''); }}
                secureTextEntry={!showPassword}
                returnKeyType="next"
                autoCorrect={false}
                onSubmitEditing={() => confirmRef.current?.focus()}
                blurOnSubmit={false}
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
            {password.length > 0 && (
              <View style={styles.strengthRow}>
                {[1, 2, 3].map(i => (
                  <View
                    key={i}
                    style={[styles.strengthBar, { backgroundColor: i <= strength.score ? strength.color : theme.border }]}
                  />
                ))}
                <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              </View>
            )}
          </View>

          <View style={styles.passwordWrap}>
            <Input
              ref={confirmRef}
              label="Confirm Password"
              placeholder="Repeat password"
              value={confirm}
              onChangeText={v => { setConfirm(v); setConfirmError(''); }}
              secureTextEntry={!showConfirm}
              returnKeyType="done"
              autoCorrect={false}
              onBlur={handleConfirmBlur}
              onSubmitEditing={handleSignUp}
              error={confirmError}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowConfirm(p => !p)}
              hitSlop={12}
              accessibilityLabel={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              <Text style={[styles.eyeIcon, { color: theme.textMuted }]}>{showConfirm ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}

          <Button
            label="Create Account"
            onPress={handleSignUp}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.btn}
          />

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
  passwordWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: Spacing.md, bottom: 16 },
  eyeIcon: { fontSize: 18 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: 6 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { fontSize: FontSize.xs, fontWeight: '600', width: 40 },
  errorText: { fontSize: FontSize.sm, textAlign: 'center' },
  btn: { marginTop: Spacing.xs },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchText: { fontSize: FontSize.sm },
  switchLink: { fontSize: FontSize.sm, fontWeight: '700' },
  skip: { alignItems: 'center', paddingVertical: Spacing.sm },
  skipLabel: { fontSize: FontSize.sm },
});
