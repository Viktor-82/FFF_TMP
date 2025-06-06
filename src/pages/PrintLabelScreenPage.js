import React from 'react';
import { View } from 'react-native';
import PrintLabelScreen from "../components/Print/PrintLabelScreen";
import BackButton from "../components/Buttons/BackButton";

const PrintLabelScreenPage = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <BackButton />
            <PrintLabelScreen />
        </View>
    );
};

export default PrintLabelScreenPage;
