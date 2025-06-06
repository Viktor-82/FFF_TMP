import React from 'react';
import CommunityItem from './CommunityItem';
import { View, Text } from 'react-native';

const CommunityList = ({ items }) => {
    if (items.length === 0) {
        return <Text>No items</Text>;
    }

    return (
        <View>
            {items.map((item) => (
                <CommunityItem key={item._id} item={item} />
            ))}
        </View>
    );
};

export default CommunityList;