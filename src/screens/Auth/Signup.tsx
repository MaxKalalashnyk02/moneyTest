import React, {useState, useEffect} from 'react';
import {StyleSheet, View, SafeAreaView, ScrollView, Alert} from 'react-native';
import {Text, Button, Input} from '@rneui/themed';
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
  const {register, error, resetError} = useAuth();

  useEffect(() => {
    if (error) {
      Alert.alert('Signup Error', error);
      resetError();
    }
  }, [error, resetError]);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      await register(email, password, name);
    } catch (e) {
      console.log('Signup error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text h1 style={styles.title}>
            Sign Up
          </Text>
          <Text style={styles.subtitle}>Create your account</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            inputStyle={styles.inputText}
            placeholderTextColor="black"
          />
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
          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            inputStyle={styles.inputText}
            placeholderTextColor="black"
          />
          <Button
            title={isLoading ? 'Creating Account...' : 'Sign Up'}
            buttonStyle={styles.button}
            onPress={handleSignup}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>

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
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
  },
  inputText: {
    color: 'black',
  },
  formContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 30,
    marginTop: 20,
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
  loginButtonTitle: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Signup;
