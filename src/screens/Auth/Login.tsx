import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {Text, Button, Input, Icon} from '@rneui/themed';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/stacks/AuthStack';
import {useAuth} from '../../contexts/AuthContext';

type LoginProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const Login = ({navigation}: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const {login, error, resetError} = useAuth();

  useEffect(() => {
    if (error) {
      setGeneralError(error);
      resetError();
    }
  }, [error, resetError]);

  const validateForm = () => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');
    setGeneralError('');

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
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (e) {
      console.log('Login error:', e);
      setGeneralError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text h1 style={styles.title}>
            Login
          </Text>
          <Text style={styles.subtitle}>Welcome back!</Text>
        </View>

        {generalError ? (
          <Text style={styles.errorText}>{generalError}</Text>
        ) : null}

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
          errorStyle={styles.errorText}
          errorMessage={emailError}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (text) {
              setPasswordError('');
            }
          }}
          secureTextEntry={!showPassword}
          inputStyle={styles.inputText}
          placeholderTextColor="black"
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
        <Button
          title="Login"
          buttonStyle={styles.button}
          onPress={handleLogin}
          disabledStyle={styles.buttonDisabled}
          disabledTitleStyle={styles.buttonDisabledTitle}
          disabled={isLoading}
        />
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Button
            title="Sign Up"
            type="clear"
            titleStyle={styles.signupButtonTitle}
            onPress={() => navigation.navigate('Signup')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'rgb(251, 246, 0)',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    justifyContent: 'flex-start',
  },
  inputText: {
    color: 'black',
  },
  titleContainer: {
    gap: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  buttonDisabled: {
    backgroundColor: '#fff787',
  },
  buttonDisabledTitle: {
    color: 'black',
  },
  subtitle: {
    color: 'black',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: 'black',
  },
  signupButtonTitle: {
    color: 'black',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default Login;
