// import React, { useState } from 'react';
// import {
//     View,
//     TextInput,
//     TouchableOpacity,
//     Text,
//     Alert,
//     StyleSheet,
//     SafeAreaView,
//     ActivityIndicator,
//     Dimensions,
//     KeyboardAvoidingView,
//     Platform,
//     Animated,
// } from 'react-native';
// import axios from 'axios';

// const { width } = Dimensions.get('window');

// const SignUpScreen = () => {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [focusedInput, setFocusedInput] = useState(null);

//     const handleSignUp = async () => {
//         if (!username || !email || !password) {
//             Alert.alert('Missing Fields', 'Please fill in all required information');
//             return;
//         }

//         setLoading(true);

//         try {
//             const response = await axios.post('http://192.168.1.5:5000/signup', {
//                 username,
//                 email,
//                 password,
//             });

//             Alert.alert('Welcome!', 'Your account has been created successfully');
//             console.log(response.data);
//         } catch (error) {
//             console.error(error);
//             Alert.alert('Oops!', 'Something went wrong during sign-up');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const renderInput = (label, value, setValue, placeholder, keyboardType = 'default', isSecure = false) => (
//         <View style={[
//             styles.inputWrapper,
//             focusedInput === label && styles.inputWrapperFocused
//         ]}>
//             <Text style={styles.inputLabel}>{label}</Text>
//             <TextInput
//                 style={styles.input}
//                 placeholder={placeholder}
//                 placeholderTextColor="#999"
//                 value={value}
//                 onChangeText={setValue}
//                 keyboardType={keyboardType}
//                 secureTextEntry={isSecure}
//                 onFocus={() => setFocusedInput(label)}
//                 onBlur={() => setFocusedInput(null)}
//                 autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
//             />
//         </View>
//     );

//     return (
//         <SafeAreaView style={styles.container}>
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 style={styles.keyboardAvoid}
//             >
//                 <View style={styles.content}>
//                     {/* Header Section */}
//                     <View style={styles.headerSection}>
//                         <Text style={styles.welcomeText}>Welcome!</Text>
//                         <Text style={styles.subHeaderText}>Join our learning community</Text>
//                     </View>

//                     {/* Main Card */}
//                     <View style={styles.mainCard}>
//                         <View style={styles.formContainer}>
//                             {renderInput('Username', username, setUsername, 'Create your username')}
//                             {renderInput('Email', email, setEmail, 'Enter your email address', 'email-address')}
//                             {renderInput('Password', password, setPassword, 'Choose a strong password', 'default', true)}

//                             <TouchableOpacity
//                                 style={styles.signUpButton}
//                                 onPress={handleSignUp}
//                                 disabled={loading}
//                             >
//                                 {loading ? (
//                                     <ActivityIndicator color="#FFF6F5" />
//                                 ) : (
//                                     <>
//                                         <Text style={styles.buttonText}>Create Account</Text>
//                                         <View style={styles.buttonIcon}>
//                                             <Text style={styles.buttonIconText}>→</Text>
//                                         </View>
//                                     </>
//                                 )}
//                             </TouchableOpacity>
//                         </View>
//                     </View>

//                     {/* Footer Section */}
//                     <View style={styles.footerSection}>
//                         <TouchableOpacity style={styles.loginButton}>
//                             <Text style={styles.loginText}>Already have an account?</Text>
//                             <Text style={styles.loginTextBold}>Log In</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FAFAFA',
//     },
//     keyboardAvoid: {
//         flex: 1,
//     },
//     content: {
//         flex: 1,
//         paddingHorizontal: 20,
//         paddingTop: Platform.OS === 'ios' ? 20 : 40,
//     },
//     headerSection: {
//         marginBottom: 30,
//         paddingHorizontal: 10,
//     },
//     welcomeText: {
//         fontSize: 36,
//         fontWeight: '700',
//         color: '#333333',
//         marginBottom: 8,
//     },
//     subHeaderText: {
//         fontSize: 16,
//         color: '#333333',
//         opacity: 0.7,
//     },
//     mainCard: {
//         backgroundColor: '#EAF5F2',
//         borderRadius: 24,
//         padding: 24,
//         marginBottom: 24,
//         shadowColor: '#4B9F89',
//         shadowOffset: {
//             width: 0,
//             height: 8,
//         },
//         shadowOpacity: 0.15,
//         shadowRadius: 12,
//         elevation: 8,
//     },
//     formContainer: {
//         gap: 20,
//     },
//     inputWrapper: {
//         backgroundColor: '#FAFAFA',
//         borderRadius: 16,
//         padding: 16,
//         borderWidth: 2,
//         borderColor: 'transparent',
//     },
//     inputWrapperFocused: {
//         borderColor: '#4B9F89',
//         shadowColor: '#4B9F89',
//         shadowOffset: {
//             width: 0,
//             height: 4,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 4,
//     },
//     inputLabel: {
//         fontSize: 12,
//         fontWeight: '600',
//         color: '#4B9F89',
//         marginBottom: 8,
//         textTransform: 'uppercase',
//         letterSpacing: 1,
//     },
//     input: {
//         fontSize: 16,
//         color: '#333333',
//         padding: 0,
//     },
//     signUpButton: {
//         backgroundColor: '#F63E38',
//         borderRadius: 16,
//         height: 56,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 10,
//         shadowColor: '#F63E38',
//         shadowOffset: {
//             width: 0,
//             height: 4,
//         },
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//         elevation: 4,
//     },
//     buttonText: {
//         color: '#FFF6F5',
//         fontSize: 18,
//         fontWeight: '600',
//         marginRight: 12,
//     },
//     buttonIcon: {
//         width: 24,
//         height: 24,
//         backgroundColor: 'rgba(255,255,255,0.2)',
//         borderRadius: 12,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     buttonIconText: {
//         color: '#FFF6F5',
//         fontSize: 16,
//     },
//     footerSection: {
//         alignItems: 'center',
//         paddingVertical: 20,
//     },
//     loginButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 8,
//     },
//     loginText: {
//         color: '#333333',
//         fontSize: 15,
//     },
//     loginTextBold: {
//         color: '#F63E38',
//         fontSize: 15,
//         fontWeight: '600',
//     },
// });

// export default SignUpScreen;
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {SIGNUP} from '../API/APIHelper';
import StorageUtils from '../common/StorageUtils';
import SplashIllustration from '../assets/SplashIllustration';

const SignUpScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill in all required information');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(SIGNUP, {
        username,
        email,
        password,
      });

      // Store token and user info
      await StorageUtils.storeToken(response.data.token);
      await StorageUtils.storeUserInfo({
        username,
        email,
        // any other user info from response
      });

      Alert.alert('Welcome!', 'Your account has been created successfully');
      navigation.navigate('Main');
    } catch (error) {
      console.error(error);
      Alert.alert('Oops!', 'Something went wrong during sign-up');
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async () => {
    navigation.navigate('LoginScreen')
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.outerDiv}><SplashIllustration
            // width={width * 0.85}
            // height={width * 0.85}
            style={styles.illustration}
          /></View>
      <View style={styles.formdiv}>
        <Text style={styles.welcomeText}>Create an account</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#666"
          />
        </View>

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

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B9F89',
  },
  outerDiv: {
    flex: 1,
    backgroundColor: '#4B9F89',
  },
  formdiv: {
    flex: 2.5,
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
  button: {
    backgroundColor: '#4B9F89',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
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
