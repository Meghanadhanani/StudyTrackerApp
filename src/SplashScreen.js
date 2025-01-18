import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Import Feather icons

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

    // Navigate to Main after 3.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        {/* Animated Icon */}
        <Animated.View
          style={[
            styles.illustrationContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Icon name="book" size={100} color="#fff" style={styles.icon} />
        </Animated.View>

        {/* Animated Texts */}
        <View style={styles.textContainer}>
          <Animated.Text
            style={[
              styles.title,
              { opacity: titleFade },
            ]}
          >
            Study Tracker
          </Animated.Text>
          <Animated.Text
            style={[
              styles.subtitle,
              { opacity: subtitleFade },
            ]}
          >
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
    backgroundColor: '#4B9F89', // Background gradient-like feel
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  illustrationContainer: {
    marginBottom: 40,
    backgroundColor: '#F63E38', // Adding a background color behind the icon for contrast
    borderRadius: 12,
    padding: 20,
  },
  icon: {
    shadowColor: '#000', // Shadow effect for the icon
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // Android shadow effect
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff', // White color for title
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff', // White color for subtitle
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    opacity: 0.7, // Slight opacity to create softness
  },
  bottomDecoration: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 40,
    gap: 8,
    marginTop: 30,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff', // Border color for circles to make them stand out
  },
});

export default SplashScreen;
