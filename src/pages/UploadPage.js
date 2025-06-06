import React from 'react';
import FarmDocUpload from "../components/Upload/FarmDocUpload";
import { View } from 'react-native';

const UploadPage = () => {
    return (
        <View style={{flex:1}}>
            <FarmDocUpload/>
        </View>
    );
};

export default UploadPage;