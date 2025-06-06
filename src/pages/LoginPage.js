import React from 'react';
import LoginRegister from "../components/Auth/LoginRegister";
import { View } from 'react-native';

const LoginPage = () => {
    return (
        <View style={{flex:1}}>
            <LoginRegister/>
        </View>
    );
};

export default LoginPage;