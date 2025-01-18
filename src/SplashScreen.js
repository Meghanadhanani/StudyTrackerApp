// src/screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { splashIllustration } from './assets/SplashIllustration';
// import { splashIllustration } from '../assets/illustrations/SplashIllustration';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const titleFade = useRef(new Animated.Value(0)).current;
    const subtitleFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Initial animation sequence
        Animated.sequence([
            // Fade in and scale the illustration
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
            // Fade in the title
            Animated.timing(titleFade, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            // Fade in the subtitle
            Animated.timing(subtitleFade, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate to Main after 3 seconds (or 30 seconds as requested)
        const timer = setTimeout(() => {
            navigation.replace('Main'); // Using replace to prevent going back to splash
        }, 3500); // 30 seconds as requested

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Main Content */}
            <View style={styles.content}>
                {/* Animated Illustration */}
                <Animated.View style={[
                    styles.illustrationContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}>
                    <SvgXml 
                        xml={splashIllustration}
                        width={width * 0.8}
                        height={width * 0.8}
                    />
                </Animated.View>

                {/* Animated Texts */}
                <View style={styles.textContainer}>
                    <Animated.Text style={[
                        styles.title,
                        { opacity: titleFade }
                    ]}>
                        Study Tracker
                    </Animated.Text>
                    <Animated.Text style={[
                        styles.subtitle,
                        { opacity: subtitleFade }
                    ]}>
                        Track your progress, achieve your goals
                    </Animated.Text>
                </View>
            </View>

            {/* Bottom Decoration */}
            <View style={styles.bottomDecoration}>
                <View style={[styles.circle, { backgroundColor: '#4B9F89' }]} />
                <View style={[styles.circle, { backgroundColor: '#F63E38' }]} />
                <View style={[styles.circle, { backgroundColor: '#FFE3E0' }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    illustrationContainer: {
        marginBottom: 40,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 12,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    },
    bottomDecoration: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 40,
        gap: 8,
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});

export default SplashScreen;