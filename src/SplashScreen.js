import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import SplashIllustration from './assets/SplashIllustration';
import StorageUtils from './common/StorageUtils';

const {width} = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await StorageUtils.getToken();  // Get the token instead of storeToken
      console.log('Token:', token);
      const userInfo = await StorageUtils.getUserInfo();
      console.log('User Info:', userInfo.username);
      console.log('User Info:', userInfo);
      setTimeout(() => {
        if (token) {
          navigation.replace('Main');
        } else {
          navigation.replace('SignUp');
        }
      }, 2000);
    } catch (error) {
      console.error('Error checking auth status:', error);

      navigation.replace('SignUp');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <SplashIllustration
            width={width * 0.85}
            height={width * 0.85}
            style={styles.illustration}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Track Your Study Progress</Text>
          <Text style={styles.subtitle}>
            Organize your learning journey and boost your productivity
          </Text>
        </View>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    // flex: 5,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: Platform.OS === 'ios' ? 40 : 20,
  },
  textContainer: {
    // marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    lineHeight: 40,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#34495E',
    opacity: 0.8,
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    textAlign: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 50,
  },
  illustration: {
    marginVertical: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F63E38',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#4B9F89',
  },
  nextButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
});

export default SplashScreen;
