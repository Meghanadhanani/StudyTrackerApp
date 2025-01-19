import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
  } from 'react-native';
  import React, { useState } from 'react';
  import axios from 'axios';
  import { LOGIN } from '../API/APIHelper';
import StorageUtils from '../common/StorageUtils';
import SplashIllustration from '../assets/SplashIllustration';
  
  const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleLogin = async () => {
      if (!email || !password) {
        Alert.alert('Missing Fields', 'Please fill in all required information');
        return;
      }
  
      setLoading(true);
  
      try {
          console.log("enterrr");
        const response = await axios.post(LOGIN, {
          email,
          password,
        });
  
        // Store the token
        await StorageUtils.storeToken(response.data.token);
        await StorageUtils.storeUserInfo(response.data.user);
  
        navigation.replace('Main');
      } catch (error) {
        console.error(error);
        Alert.alert(
          'Login Failed',
          error.response?.data?.message || 'Something went wrong during login'
        );
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.outerDiv}>
     <SplashIllustration
            // width={width * 0.85}
            // height={width * 0.85}
            style={styles.illustration}
          />
        </View>
        <View style={styles.formdiv}>
          <Text style={styles.welcomeText}>Login to your account</Text>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#666"
            />
          </View>
  
          <TouchableOpacity 
            style={styles.forgotPassword}
            // onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>
  
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#4B9F89',
    },
    outerDiv: {
      flex: 1,
      backgroundColor: '#4B9F89',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      color: '#FFFFFF',
      fontSize: 32,
      fontWeight: '700',
    },
    formdiv: {
      flex: 2,
      backgroundColor: '#FAFAFA',
      borderTopRightRadius: 40,
      borderTopLeftRadius: 40,
      elevation: 0.4,
      padding: 20,
    },
    welcomeText: {
      color: '#121212',
      fontWeight: '700',
      fontSize: 27,
      textAlign: 'center',
      marginBottom: 30,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
    },
    input: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#ddd',
      color: '#333',
    },
    forgotPassword: {
      alignItems: 'flex-end',
      marginBottom: 20,
    },
    forgotPasswordText: {
      color: '#4B9F89',
      fontSize: 14,
      fontWeight: '600',
    },
    button: {
      backgroundColor: '#4B9F89',
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
    },
    buttonDisabled: {
      backgroundColor: '#4B9F89',
      opacity: 0.7,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    footerText: {
      color: '#666',
      fontSize: 16,
    },
    footerLink: {
      color: '#4B9F89',
      fontSize: 16,
      fontWeight: '600',
    },
  });
  
  export default LoginScreen;