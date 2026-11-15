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
import { Ionicons } from '@expo/vector-icons';
import { useAuth, isEmail, isPhone } from '../context/AuthContext';
import { colors, radius } from '../theme';

function PasswordField({ value, onChangeText, placeholder, show, onToggle }) {
  return (
    <View style={s.passWrap}>
      <TextInput
        style={s.passInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.faint}
        secureTextEntry={!show}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable onPress={onToggle} hitSlop={10}>
        <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.muted} />
      </Pressable>
    </View>
  );
}

export default function LoginScreen() {
  const { user, register, login, resetAccount } = useAuth();
  const creating = !user; // no saved account yet, so show the create-account form
  const [name, setName] = useState('');
  const [contact, setContact] = useState(user ? user.contact : '');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (creating && name.trim().length < 2) return setError('Enter your name (at least 2 letters).');
    if (!isEmail(contact) && !isPhone(contact)) {
      return setError('Enter a valid email address or phone number.');
    }
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (creating) {
      if (password !== password2) return setError('The two passwords do not match.');
      await register(name, contact, password);
    } else {
      const err = await login(contact, password);
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
          setPassword('');
          setPassword2('');
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
          {creating && (
            <View>
              <Text style={s.label}>Your name</Text>
              <TextInput
                style={s.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Nimal Perera"
                placeholderTextColor={colors.faint}
                autoCapitalize="words"
              />
            </View>
          )}

          <Text style={s.label}>Email or phone number</Text>
          <TextInput
            style={s.input}
            value={contact}
            onChangeText={setContact}
            placeholder="name@email.com or 0771234567"
            placeholderTextColor={colors.faint}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={s.label}>Password</Text>
          <PasswordField
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            show={show}
            onToggle={() => setShow(!show)}
          />

          {creating && (
            <View>
              <Text style={s.label}>Confirm password</Text>
              <PasswordField
                value={password2}
                onChangeText={setPassword2}
                placeholder="Type it again"
                show={show}
                onToggle={() => setShow(!show)}
              />
            </View>
          )}

          {error ? <Text style={s.error}>{error}</Text> : null}

          <Pressable style={s.button} onPress={submit}>
            <Text style={s.buttonText}>{creating ? 'Create account' : 'Log in'}</Text>
          </Pressable>

          {!creating && (
            <Pressable onPress={confirmReset} hitSlop={8}>
              <Text style={s.link}>Forgot password? Reset account</Text>
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
  passWrap: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    backgroundColor: colors.bg,
  },
  passInput: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 0 },
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