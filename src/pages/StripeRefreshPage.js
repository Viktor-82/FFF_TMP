import React from 'react';
import StripeRefreshScreen from "../components/Payments/StripeRefreshScreen";
import { View } from 'react-native';

const StripeRefreshPage = () => {
    return (
        <View style={{flex:1}}>
            <StripeRefreshScreen/>
        </View>
    );
};

export default StripeRefreshPage;