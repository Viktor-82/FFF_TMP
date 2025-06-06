import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { login, register } from '../../utils/api';
import { setUser } from '../../redux/actions/userActions';
// import { resetStore } from '../../redux/actions/resetActions';
import { colors } from '../../assets/styles/colors';
import { showToast } from '../Shared/Notification';
import { useLoginAuthHandler } from '../../services/loginAuthHandler';
import { useFacebookAuthHandler } from '../../services/facebookAuthHandler';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FacebookButton from '../../img/social_buttons/facebook.svg';
import GoogleButton from '../../img/social_buttons/google.svg';
import AppleButton from '../../img/social_buttons/apple.svg';

// Контейнер для всей формы
const LoginFormContainer = styled.View`
  flex: 1;
  align-items: center;
  padding: 20px;
  background-color: ${colors.neutral.white};
`;

// Заголовок
const HeaderText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
  color: #333;
`;

// Контейнер для ввода пароля
const InputWrapper = styled.View`
  width: 100%;
  position: relative;
`;

// Поля ввода
const Input = styled.TextInput`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid ${colors.green.grass};
  background-color: ${colors.neutral.white};
  border-radius: 5px;
  font-size: 16px;
  color: ${colors.brown.earth};
`;

const Label = styled.Text`
  font-size: 14px;
  margin: 3px 0 2px;
  width: 100%;
  color: ${colors.brown.earth};
`;

const RememberForgotContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
  margin: 2px 0;
`;

// Иконка-глаз для скрытия пароля
const ToggleIconButton = styled.TouchableOpacity`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-12px);
`;

// Кнопка отправки
const SubmitButton = styled.TouchableOpacity`
  background-color: ${colors.green.grass};
  padding: 12px;
  width: 100%;
  border-radius: 5px;
  align-items: center;
  margin-top: 20px;
`;

const SubmitButtonText = styled.Text`
  color: ${colors.neutral.white};
  font-size: 16px;
  font-weight: bold;
`;

// Контейнер для соцсетей
const SocialLoginContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-top: 5px;
  gap: 30px;
`;

// Кнопки соцсетей
const SocialIcon = styled.TouchableOpacity`
  width: 45px;
  height: 45px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
`;

// Оформление текста
const StyledText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 15px;
  color: ${colors.brown.earth};
`;

const LoginRegister = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const loginAuthHandler = useLoginAuthHandler();
    const handleFacebookLogin = useFacebookAuthHandler();

    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('AsyncStorage очищен');
        } catch (error) {
            console.error('Ошибка при очистке AsyncStorage:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const validateForm = () => {
        if (!email || !password) {
            showToast('Please fill all fields', 'error');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Invalid email format', 'error');
            return false;
        }

        if (!isLogin && password !== confirmPassword) {
            showToast("Passwords do not match!", 'error');
            return false;
        }

        return true;
    };

    const handleRegister = () => {
        if (!validateForm()) return;

        const usernamePart = email.split('@')[0];
        if (!usernamePart) {
            showToast('Invalid email address', 'error');
            return;
        }

        const registrationData = {
            username: usernamePart,
            email,
            password,
            confirmPassword,
            role: 'farmer',
        };

        register(registrationData)
            .then((response) => {
                const userData = response.data;
                if (userData) {
                    setIsLogin(true);
                    dispatch(setUser(userData));
                    navigation.navigate('Login');
                    showToast("Registration was successful.Please login.", 'info');
                } else {
                    showToast("Unexpected error occurred.", 'error');
                }
            })
            .catch((error) => {
                console.error('Ошибка регистрации:', error);
                showToast("Registration failed. Please try again.", 'error');
            });
    };

    const handleLogin = () => {
        if (!validateForm()) return;
        login(email, password, rememberMe)
            .then((response) => {
                // const userData = response.data.user;
                const userData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                if(userData && userData.id && userData.username && userData.email && userData.role) {
                    loginAuthHandler(userData);
                } else {
                    console.log('server are not response');
                }
            })
            .catch(() => showToast('Login error', 'error'));
    };

    const handleSubmit = () => {
        isLogin ? handleLogin() : handleRegister();
    };

    const handleGoogleLogin = () => {
        Linking.openURL('https://marketplace-usa-backend-1.onrender.com/auth/google/farmer-mobile');
    };

    return (
        <LoginFormContainer>
            <HeaderText>{isLogin ? 'If you have an account - LOG IN' : 'Sign Up'}</HeaderText>

            <Label>EMAIL</Label>
            <Input
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <Label>PASSWORD</Label>
            <InputWrapper>
                <Input
                    placeholder="●●●●●●●●"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordShown}
                />
                <ToggleIconButton onPress={togglePasswordVisibility}>
                    <Icon name={passwordShown ? "eye-slash" : "eye"} size={20} color={colors.brown.earth} />
                </ToggleIconButton>
            </InputWrapper>

            {isLogin && (
                <RememberForgotContainer>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#333', marginLeft: 8 }}>Remember me</Text>
                        <CheckBox
                            value={rememberMe}
                            onValueChange={setRememberMe}
                            tintColors={{ true: colors.green.grass, false: '#333' }}
                        />
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                        <Text style={{ color: '#333', textDecorationLine: 'underline' }}>
                            Forgot Password
                        </Text>
                    </TouchableOpacity>
                </RememberForgotContainer>
            )}


            {!isLogin && (
                <InputWrapper>
                    <Label>CONFIRM PASSWORD</Label>
                    <Input
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!passwordShown}
                    />
                </InputWrapper>
            )}

            <SubmitButton onPress={handleSubmit}>
                <SubmitButtonText>{isLogin ? 'LOG IN' : 'REGISTER'}</SubmitButtonText>
            </SubmitButton>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={{ color: '#555', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 45 }}>
                    {isLogin ? (
                        <>
                            Don’t have an account? Click here to{' '}
                            <Text style={{ color: 'red' }}>SIGN UP</Text>
                        </>
                    ) : (
                        "Already have an account? Log in"
                    )}
                    {'  '}
                    <Icon name="arrow-right" size={22} color="red" />
                </Text>
            </TouchableOpacity>

            {isLogin && (
                <>
                    <Text style={{ fontSize: 20, marginTop: 45, marginBottom: 15, textAlign: 'center', fontWeight: 'bold', color: '#555' }}>
                        Or click button to
                    </Text>

                    <SocialLoginContainer>
                        <SocialIcon onPress={handleFacebookLogin}>
                            <FacebookButton />
                        </SocialIcon>
                        <SocialIcon onPress={handleGoogleLogin}>
                            <GoogleButton />
                        </SocialIcon>
                        {/*<SocialIcon onPress={callTestToast}>*/}
                        <SocialIcon>
                            <AppleButton />
                        </SocialIcon>
                    </SocialLoginContainer>
                </>
            )}
        </LoginFormContainer>
    );
};

export default LoginRegister;