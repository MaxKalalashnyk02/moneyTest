import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text, Button, Input, Icon} from '@rneui/themed';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/stacks/AuthStack';
import {useAuth} from '../../contexts/AuthContext';

type SignupProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
};

const Signup = ({navigation}: SignupProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const {register, error, resetError} = useAuth();

  useEffect(() => {
    if (error) {
      setGeneralError(error);
      resetError();
    }
  }, [error, resetError]);

  const validateForm = () => {
    let isValid = true;

    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await register(email, password, name);
    } catch (e) {
      console.log('Signup error:', e);
      setGeneralError('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled">
            <View style={styles.titleContainer}>
              <Text h1 style={styles.title}>
                Sign Up
              </Text>
              <Text style={styles.subtitle}>Create your account</Text>
            </View>

            {generalError ? (
              <Text style={styles.errorText}>{generalError}</Text>
            ) : null}

            <Input
              placeholder="Full Name"
              value={name}
              onChangeText={text => {
                setName(text);
                if (text.trim()) {
                  setNameError('');
                }
              }}
              inputStyle={styles.inputText}
              placeholderTextColor="black"
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.fieldContainer}
              errorStyle={styles.errorText}
              errorMessage={nameError}
            />
            <Input
              placeholder="Email"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (text.trim()) {
                  setEmailError('');
                }
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              inputStyle={styles.inputText}
              placeholderTextColor="black"
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.fieldContainer}
              errorStyle={styles.errorText}
              errorMessage={emailError}
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (text.length >= 6) {
                  setPasswordError('');
                }
              }}
              secureTextEntry={!showPassword}
              inputStyle={styles.inputText}
              placeholderTextColor="black"
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.fieldContainer}
              textContentType="oneTimeCode"
              autoComplete="off"
              errorStyle={styles.errorText}
              errorMessage={passwordError}
              rightIcon={
                <Icon
                  name={showPassword ? 'eye' : 'eye-off'}
                  type="feather"
                  size={18}
                  color="black"
                  onPress={togglePasswordVisibility}
                />
              }
            />
            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (text === password) {
                  setConfirmPasswordError('');
                }
              }}
              secureTextEntry={!showConfirmPassword}
              inputStyle={styles.inputText}
              placeholderTextColor="black"
              inputContainerStyle={styles.inputContainer}
              containerStyle={styles.fieldContainer}
              textContentType="oneTimeCode"
              autoComplete="off"
              errorStyle={styles.errorText}
              errorMessage={confirmPasswordError}
              rightIcon={
                <Icon
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  type="feather"
                  size={18}
                  color="black"
                  onPress={toggleConfirmPasswordVisibility}
                />
              }
            />
            <Button
              title="Sign Up"
              buttonStyle={styles.button}
              onPress={handleSignup}
              disabledStyle={styles.buttonDisabled}
              disabledTitleStyle={styles.buttonDisabledTitle}
              disabled={isLoading}
            />

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Button
                title="Login"
                type="clear"
                titleStyle={styles.loginButtonTitle}
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'rgb(251, 246, 0)',
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  titleContainer: {
    gap: 5,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    color: 'black',
  },
  inputText: {
    color: 'black',
  },
  inputContainer: {
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
    backgroundColor: 'transparent',
  },
  fieldContainer: {
    paddingHorizontal: 0,
    marginBottom: 5,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 30,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#fff787',
  },
  buttonDisabledTitle: {
    color: 'black',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    color: 'black',
  },
  loginButtonTitle: {
    color: 'black',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default Signup;
