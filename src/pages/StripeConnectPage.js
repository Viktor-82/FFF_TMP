import React from 'react';
import StripeConnect from "../components/Payments/StripeConnect";
import { View } from 'react-native';

const StripeConnectPage = () => {
    return (
        <View style={{flex:1}}>
            <StripeConnect/>
        </View>
    );
};

export default StripeConnectPage;