import React from "react";
import { View, Text, Button } from "react-native";
import { navigationRef } from "../../navigation/NavigationRef"; // Подключаем навигацию

const StripeRefreshScreen = () => {
    return (
        <View>
            <Text>Something went wrong. Try again.</Text>
            <Button title="Try again" onPress={() => navigationRef.current?.goBack()} />
        </View>
    );
};

export default StripeRefreshScreen;

