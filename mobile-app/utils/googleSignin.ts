import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

let GoogleSignin: any;
let statusCodes: any;

if (isExpoGo) {
  console.log('Mocking GoogleSignin for Expo Go');
  GoogleSignin = {
    configure: () => {},
    hasPlayServices: async () => Promise.resolve(true),
    signIn: async () => {
      alert('Google Sign-In is not supported in Expo Go. Please use a development build.');
      return Promise.reject({ code: 'EXPO_GO_MOCK' });
    },
    signOut: async () => Promise.resolve(),
    isSignedIn: async () => Promise.resolve(false),
    getCurrentUser: async () => Promise.resolve(null),
  };

  statusCodes = {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  };
} else {
  // Real implementation for native builds
  const GoogleSigninPackage = require('@react-native-google-signin/google-signin');
  GoogleSignin = GoogleSigninPackage.GoogleSignin;
  statusCodes = GoogleSigninPackage.statusCodes;
}

export { GoogleSignin, statusCodes };
