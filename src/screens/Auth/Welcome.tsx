import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Text, Button, normalize} from '@rneui/themed';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/stacks/AuthStack';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

const WelcomeScreen = ({navigation}: WelcomeScreenProps) => {
  const handleLogin = () => navigation.navigate('Login');
  const handleSignup = () => navigation.navigate('Signup');

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text h1 style={styles.title}>
            Money Tracker
          </Text>
          <Text h4>Money Tracker helps you track your money</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            buttonStyle={styles.button}
            onPress={handleLogin}
          />
          <Button
            title="Signup"
            buttonStyle={styles.button}
            onPress={handleSignup}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: 'rgb(251, 246, 0)',
  },
  container: {
    paddingHorizontal: normalize(15),
    justifyContent: 'flex-end',
    height: '100%',
    gap: 20,
  },
  titleContainer: {
    gap: 5,
  },
  title: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 30,
  },
});
