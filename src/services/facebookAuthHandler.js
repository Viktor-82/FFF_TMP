import { useDispatch } from 'react-redux';
import { showToast } from '../components/Shared/Notification';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { useLoginAuthHandler } from './loginAuthHandler';

export const useFacebookAuthHandler = () => {
    const dispatch = useDispatch();
    const loginAuthHandler = useLoginAuthHandler();

    const handleFacebookLogin = async () => {
        try {
            // Запрос на вход в Facebook
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
                showToast('Facebook login cancelled', 'error');
                return;
            }

            // Получаем accessToken
            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                showToast('Error obtaining Facebook token', 'error');
                return;
            }

            const { accessToken } = data;
            console.log('call from facebookAuth', accessToken);

            // Отправляем accessToken на сервер
            await sendFacebookTokenToServer(accessToken);
        } catch (error) {
            console.error('Facebook login error:', error);
            showToast('Facebook login failed', 'error');
        }
    };

    const sendFacebookTokenToServer = async (accessToken) => {
        try {
            const response = await fetch('https://marketplace-usa-backend-1.onrender.com/auth/facebook/token-farmers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accessToken }),
            });

            const userData = await response.json();

            if (response.status === 403) {
                console.log('Отображение Toast:', userData.message);
                showToast(userData.message, 'error');
                return;
            }

            if (userData && userData.id && userData.username && userData.email && userData.role) {
                loginAuthHandler(userData);
            } else {
                showToast('Server response is incorrect', 'error');
            }
        } catch (error) {
            console.error('Error sending Facebook token to server:', error);
            showToast('Facebook authentication failed', 'error');
        }
    };

    return handleFacebookLogin;
};