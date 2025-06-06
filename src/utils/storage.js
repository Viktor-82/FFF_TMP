import { Platform } from 'react-native';
const AsyncStorage = Platform.OS === 'web'
    ? {
        getItem: (key) => Promise.resolve(localStorage.getItem(key)),
        setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
        removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
    }
    : require('@react-native-async-storage/async-storage').default;

export default AsyncStorage;

