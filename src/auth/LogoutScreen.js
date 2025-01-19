import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import React from 'react';
import StorageUtils from '../common/StorageUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomBackButton from '../navigation/BackBtn';
import SplashIllustration from '../assets/SplashIllustration';
const { width } = Dimensions.get('window');

const LogoutScreen = ({navigation}) => {
  const handleLogout = async () => {
    try {
      const token = await StorageUtils.getToken();
      if (token) {
        console.log('Token found, removing it...');
        await StorageUtils.removeToken(); // Remove token if exists
      }
      // await StorageUtils.clearAll();
      navigation.replace('SignUp');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
    <CustomBackButton title={'More'} showIcon={false} />
      <View style={styles.outerDiv}>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
          <Ionicons name="arrow-forward" size={25} color="#121212" />
        </TouchableOpacity>
      </View>
       <View style={styles.formdiv}>
          <SplashIllustration
            width={width * 0.85}
            height={width * 0.85}
            style={styles.illustration}
          />
        </View>
          {/* <Text style={styles.welcomeText}>Are you sure?</Text>
          <Text style={styles.subtitleText}>
            You will be logged out of your account
          </Text>
  
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.logoutButton]} 
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={handleCancel}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
  
        
        </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },
  outerDiv: {
    flex:1,
    // backgroundColor: '#FAFAFA',
    padding:20
  },
  formdiv: {
    flex: 4,
    // backgroundColor: '#4B9F89',
    // borderTopRightRadius: 40,
    // borderTopLeftRadius: 40,
    // elevation: 0.4,
    // padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 20,
  },
  welcomeText: {
    color: '#121212',
    fontWeight: '700',
    fontSize: 27,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 15,
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection:"row",
    justifyContent:"space-between"
  },
  logoutButton: {
    // backgroundColor: '#F63E38',
    // borderWidth:1,
    // borderColor:"#F63E38",
    borderBottomColor:"#F63E38",
    borderBottomWidth:2
   
  },
  cancelButton: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#4B9F89',
  },
  buttonText: {
    fontSize: 21,
    fontWeight: '600',
 color:"#121212"
  },
  cancelButtonText: {
    color: '#4B9F89',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
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

export default LogoutScreen;
