import React from 'react';
import StripeSuccessScreen from "../components/Payments/StripeSuccessScreen";
import { View } from 'react-native';

const StripeSuccessPage = () => {
    return (
        <View style={{flex:1}}>
            <StripeSuccessScreen/>
        </View>
    );
};

export default StripeSuccessPage;