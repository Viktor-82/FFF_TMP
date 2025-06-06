import React from 'react';
import OrderItem from './OrderItem';
import { View, Text } from 'react-native';

const OrderList = ({ orders }) => {
    if (orders.length === 0) {
        return <Text>No orders</Text>;
    }

    return (
        <View>
            {orders.map((order) => (
                <OrderItem key={order.order_farm_id} order={order} />
            ))}
        </View>
    );
};

export default OrderList;
