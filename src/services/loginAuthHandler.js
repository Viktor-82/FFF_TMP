import { useDispatch } from 'react-redux';
import { setUser } from '../redux/actions/userActions';
import { fetchAddresses } from '../redux/actions/addressActions';
import { showToast } from '../components/Shared/Notification';
import { initializeToken, startTokenExpirationCheck } from '../utils/tokenManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from '../navigation/NavigationRef'; // Импорт navigationRef

export const useLoginAuthHandler = () => {
    const dispatch = useDispatch();

    const loginAuthHandler = (userData) => {
        const { token, id, username, email, role } = userData;

        if (token && id && username && email && role) {

            initializeToken(token, true, navigationRef);
            AsyncStorage.setItem('user', JSON.stringify({ id, username, email, role }));
            dispatch(setUser({ id, username, email, role }));

            startTokenExpirationCheck(navigationRef);

            dispatch(fetchAddresses())
                .then((addresses) => {
                    if (addresses.length > 0) {
                        navigationRef.current?.navigate('Orders');
                    } else {
                        navigationRef.current?.navigate('LocationPermission');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching addresses:', error);
                    showToast('Failed to load farms. Redirecting to Find Location.', 'error');
                    navigationRef.current?.navigate('LocationPermission');
                });
        } else {
            console.error('Missing authentication data');
            showToast('Authentication failed. Please log in again.', 'error');
            navigationRef.current?.navigate('Login');
        }
    };

    return loginAuthHandler;
};