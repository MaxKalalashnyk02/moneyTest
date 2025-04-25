import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Alert} from 'react-native';
import {Text, Button, Input} from '@rneui/themed';
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
  const {login, error, resetError} = useAuth();

  useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
      resetError();
    }
  }, [error, resetError]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (e) {
      console.log('Login error:', e);
    } finally {
      setIsLoading(false);
    }
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
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          inputStyle={styles.inputText}
          placeholderTextColor="black"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          inputStyle={styles.inputText}
          placeholderTextColor="black"
        />
        <Button
          title={isLoading ? 'Loading...' : 'Login'}
          buttonStyle={styles.button}
          onPress={handleLogin}
          loading={isLoading}
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
    alignSelf: 'flex-start',
    gap: 10,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  subtitle: {
    color: 'black',
    paddingBottom: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: 'black',
  },
  signupButtonTitle: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Login;
