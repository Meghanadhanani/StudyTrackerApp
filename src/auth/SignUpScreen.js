import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

const SignUpScreen = () => {
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
            const response = await axios.post('http://192.168.1.5:5000/signup', {
                username,
                email,
                password,
            });

            Alert.alert('Welcome!', 'Your account has been created successfully');
            console.log(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Oops!', 'Something went wrong during sign-up');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, value, setValue, placeholder, keyboardType = 'default', isSecure = false) => (
        <View style={[
            styles.inputWrapper,
            focusedInput === label && styles.inputWrapperFocused
        ]}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={setValue}
                keyboardType={keyboardType}
                secureTextEntry={isSecure}
                onFocus={() => setFocusedInput(label)}
                onBlur={() => setFocusedInput(null)}
                autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <View style={styles.content}>
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <Text style={styles.welcomeText}>Welcome!</Text>
                        <Text style={styles.subHeaderText}>Join our learning community</Text>
                    </View>

                    {/* Main Card */}
                    <View style={styles.mainCard}>
                        <View style={styles.formContainer}>
                            {renderInput('Username', username, setUsername, 'Create your username')}
                            {renderInput('Email', email, setEmail, 'Enter your email address', 'email-address')}
                            {renderInput('Password', password, setPassword, 'Choose a strong password', 'default', true)}
                            
                            <TouchableOpacity
                                style={styles.signUpButton}
                                onPress={handleSignUp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF6F5" />
                                ) : (
                                    <>
                                        <Text style={styles.buttonText}>Create Account</Text>
                                        <View style={styles.buttonIcon}>
                                            <Text style={styles.buttonIconText}>→</Text>
                                        </View>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer Section */}
                    <View style={styles.footerSection}>
                        <TouchableOpacity style={styles.loginButton}>
                            <Text style={styles.loginText}>Already have an account?</Text>
                            <Text style={styles.loginTextBold}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    keyboardAvoid: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
    },
    headerSection: {
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    welcomeText: {
        fontSize: 36,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 8,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#333333',
        opacity: 0.7,
    },
    mainCard: {
        backgroundColor: '#EAF5F2',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#4B9F89',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    formContainer: {
        gap: 20,
    },
    inputWrapper: {
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    inputWrapperFocused: {
        borderColor: '#4B9F89',
        shadowColor: '#4B9F89',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B9F89',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        fontSize: 16,
        color: '#333333',
        padding: 0,
    },
    signUpButton: {
        backgroundColor: '#F63E38',
        borderRadius: 16,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#F63E38',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFF6F5',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 12,
    },
    buttonIcon: {
        width: 24,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIconText: {
        color: '#FFF6F5',
        fontSize: 16,
    },
    footerSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    loginText: {
        color: '#333333',
        fontSize: 15,
    },
    loginTextBold: {
        color: '#F63E38',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default SignUpScreen;