import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme';

export default function LoginScreen() {
  const { user, register, login, resetAccount } = useAuth();
  const creating = !user; // no saved account yet, so show the create-account form
  const [name, setName] = useState(user ? user.name : '');
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (name.trim().length < 2) return setError('Enter your name (at least 2 letters).');
    if (!/^\d{4,6}$/.test(pin)) return setError('PIN must be 4 to 6 digits.');
    if (creating) {
      if (pin !== pin2) return setError('The two PINs do not match.');
      await register(name, pin);
    } else {
      const err = await login(name, pin);
      if (err) setError(err);
    }
  };

  const confirmReset = () =>
    Alert.alert('Reset account', 'This removes the account saved on this phone so you can create a new one.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          resetAccount();
          setPin('');
          setPin2('');
          setError('');
        },
      },
    ]);

  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/icon.png')} style={s.logo} />
        <Text style={s.title}>LankaBus Compass</Text>
        <View style={s.plate}>
          <Text style={s.plateText}>{creating ? 'CREATE ACCOUNT' : 'WELCOME BACK'}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.label}>Your name</Text>
          <TextInput
            style={s.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Nimal"
            placeholderTextColor={colors.faint}
            autoCapitalize="words"
          />

          <Text style={s.label}>PIN (4 to 6 digits)</Text>
          <TextInput
            style={s.input}
            value={pin}
            onChangeText={setPin}
            placeholder="••••"
            placeholderTextColor={colors.faint}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
          />

          {creating && (
            <View>
              <Text style={s.label}>Confirm PIN</Text>
              <TextInput
                style={s.input}
                value={pin2}
                onChangeText={setPin2}
                placeholder="••••"
                placeholderTextColor={colors.faint}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
              />
            </View>
          )}

          {error ? <Text style={s.error}>{error}</Text> : null}

          <Pressable style={s.button} onPress={submit}>
            <Text style={s.buttonText}>{creating ? 'Create account' : 'Log in'}</Text>
          </Pressable>

          {!creating && (
            <Pressable onPress={confirmReset} hitSlop={8}>
              <Text style={s.link}>Forgot PIN? Reset account</Text>
            </Pressable>
          )}
        </View>

        <Text style={s.note}>Your account is stored only on this phone. No internet needed.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { width: 96, height: 96, borderRadius: 24, borderWidth: 3, borderColor: colors.plate },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 16 },
  plate: {
    marginTop: 10,
    backgroundColor: colors.plate,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  plateText: { color: colors.ink, fontWeight: '900', fontSize: 13, letterSpacing: 1.5 },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    marginTop: 24,
  },
  label: { fontSize: 13, fontWeight: '700', color: colors.muted, marginBottom: 6, marginTop: 10 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.bg,
  },
  error: { color: colors.maroon, fontWeight: '700', marginTop: 12 },
  button: {
    marginTop: 18,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.plate,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  link: { color: colors.maroon, fontWeight: '700', textAlign: 'center', marginTop: 16 },
  note: { color: '#B8C7D6', fontSize: 13, marginTop: 20, textAlign: 'center' },
});