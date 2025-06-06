// import React from 'react';
// import styled from 'styled-components/native';
// import { View, Text } from 'react-native';
// import { colors } from "../../assets/styles/colors";
//
// // Стили для контейнера заказа
// const OrderContainer = styled(View)`
//   padding: 15px; /* 0.9375rem = 15px */
//   border-width: 1px; /* 0.0625rem = 1px */
//   border-color: #ddd;
//   margin-bottom: 10px; /* 0.625rem = 10px */
//   border-radius: 5px; /* 0.3125rem = 5px */
//   background-color: #f9f9f9;
// `;
//
// // Стили для текста
// const OrderText = styled(Text)`
//   color: ${colors.brown.earth};
//   margin-bottom: 5px; /* Отступ между строками */
// `;
//
// const StrongText = styled(Text)`
//   color: #444;
//   font-weight: bold;
// `;
//
// const ItemContainer = styled(View)`
//   margin-left: 10px;
//   margin-bottom: 5px;
// `;
//
// const OrderItem = ({ order }) => {
//     return (
//         <OrderContainer>
//             <OrderText>
//                 <StrongText>Order number:</StrongText> {order.order_farm_id}
//             </OrderText>
//             <OrderText>
//                 <StrongText>Creation date:</StrongText> {new Date(order.created_at).toLocaleString()}
//             </OrderText>
//             <OrderText>
//                 <StrongText>Order amount:</StrongText> ${order.order_amount.toFixed(2)}
//             </OrderText>
//             {/*<OrderText>*/}
//             {/*    <StrongText>Delivery address:</StrongText> {order.manual_address}*/}
//             {/*</OrderText>*/}
//             {order.status === 'completed' && (
//                 <OrderText>
//                     <StrongText>Delivery time:</StrongText> {new Date(order.delivered_at).toLocaleString()}
//                 </OrderText>
//             )}
//             <OrderText>
//                 <StrongText>Order contents:</StrongText>
//                 {/*{order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}*/}
//                 {order.items.map((item) => (
//                     <ItemContainer key={item.product_id}>
//                         <OrderText>product_id: {item.product_id}</OrderText>
//                         <OrderText>quantity: {item.quantity}</OrderText>
//                         <OrderText>name: {item.name}</OrderText>
//                         <OrderText>price_at_confirmation: ${item.price_at_confirmation.toFixed(2)}</OrderText>
//                     </ItemContainer>
//                 ))}
//             </OrderText>
//         </OrderContainer>
//     );
// };
//
// export default OrderItem;

import React from 'react';
import styled from 'styled-components/native';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from "../../assets/styles/colors";
import { useNavigation, useRoute } from '@react-navigation/native';

// Общий контейнер заказа
const OrderContainer = styled(View)`
  padding: 15px;
  border-width: 1px;
  border-color: #ddd;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

// Стиль для подписи и значения
const Row = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 5px;
`;

const LabelContainer = styled(View)`
  width: 120px;
`;

const ContentContainer = styled(View)`
  flex: 1;
`;

const OrderText = styled(Text)`
  color: ${colors.brown.earth};
`;

const StrongText = styled(Text)`
  color: #444;
  font-weight: bold;
`;

const Divider = styled(View)`
  border-bottom-width: 1px;
  border-bottom-color: green;
  margin-vertical: 5px;
`;

// Каждый товар будет в отдельной "строке"
const ItemRow = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  margin-left: 20px;
`;

const ProductImage = styled(Image)`
  width: 70px;
  height: 70px;
  margin-right: 30px;
  border-radius: 5px;
`;

// Контейнер для нижней строки (текст + кнопка)
const BottomRow = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  //margin-left: 120px; /* Чтобы выровнять по тому же краю, что и товары */
`;

const PrepareText = styled(Text)`
  //color: ${colors.brown.earth};
  margin-right: 10px;
  color: #444;
  font-weight: bold;
`;

const PrintButton = styled(TouchableOpacity)`
  padding: 8px 12px;
  //background-color: #007bff;
  background-color: ${colors.green.grass};
  border-radius: 5px;
`;

const ButtonText = styled(Text)`
  color: white;
  font-weight: bold;
`;

const OrderItem = ({ order }) => {
    const navigation = useNavigation();
    const route = useRoute();

    const handlePrintLabel = () => {
        navigation.navigate('PrintLabel', { order });
    };

    const handleHandOver = () => {
        // navigation.navigate('PrintLabel', { order });
    };
    return (
        <OrderContainer>
            {/* Order number */}
            <Row>
                <LabelContainer>
                    <StrongText>Order number:</StrongText>
                </LabelContainer>
                <ContentContainer>
                    <OrderText>{order.order_farm_id}</OrderText>
                </ContentContainer>
            </Row>

            {/* Creation date */}
            <Row>
                <LabelContainer>
                    <StrongText>Creation date:</StrongText>
                </LabelContainer>
                <ContentContainer>
                    <OrderText>{new Date(order.created_at).toLocaleString()}</OrderText>
                </ContentContainer>
            </Row>

            {/* Order amount */}
            <Row>
                <LabelContainer>
                    <StrongText>Order amount:</StrongText>
                </LabelContainer>
                <ContentContainer>
                    <OrderText>${order.order_amount.toFixed(2)}</OrderText>
                </ContentContainer>
            </Row>

            {/* Delivery time (только если статус completed) */}
            {order.status === "completed" && (
                <Row>
                    <LabelContainer>
                        <StrongText>Delivery time:</StrongText>
                    </LabelContainer>
                    <ContentContainer>
                        <OrderText>{new Date(order.delivered_at).toLocaleString()}</OrderText>
                    </ContentContainer>
                </Row>
            )}

            {/* Надпись Order contents */}
            <Row>
                <LabelContainer>
                    <StrongText>Order contents:</StrongText>
                </LabelContainer>
            </Row>

            {/* Список товаров */}
            {order.items.map((item, index) => {
                const isLastItem = index === order.items.length - 1;

                // Ищем нужное изображение
                const mobileImage = item.images?.find((img) =>
                    img.key.endsWith('jpg_mobile.jpg')
                );

                return (
                    <View key={item._doc.product_id}>
                        <ItemRow>
                            {/* Если нашли нужное изображение, показываем слева */}
                            {mobileImage && <ProductImage source={{ uri: mobileImage.url }} />}
                            <View>
                                <OrderText>name: <StrongText>{item._doc.name}</StrongText></OrderText>
                                <OrderText>quantity: <StrongText>{item._doc.quantity}</StrongText></OrderText>
                                <OrderText>
                                    price_at_confirmation: <StrongText>${item._doc.price_at_confirmation.toFixed(2)}</StrongText>
                                </OrderText>
                                <OrderText>product_id: <StrongText>{item._doc.product_id}</StrongText></OrderText>
                            </View>
                        </ItemRow>
                        {/* Разделитель между элементами, кроме последнего */}
                        {/*{!isLastItem && <Divider />}*/}
                        <Divider />
                    </View>
                );
            })}
            {/* Блок "prepare the order and" + кнопка */}
            {order.status === 'paid' && (
                <BottomRow>
                    <PrepareText>prepare the order and</PrepareText>
                    <PrintButton onPress={handlePrintLabel}>
                        <ButtonText>print the label</ButtonText>
                    </PrintButton>
                </BottomRow>
            )}
            {order.status === 'packed' && (
                <BottomRow>
                    {/*<PrepareText>prepare the order and</PrepareText>*/}
                    <PrintButton onPress={handleHandOver}>
                        <ButtonText>hand over to the courier</ButtonText>
                    </PrintButton>
                </BottomRow>
            )}
        </OrderContainer>
    );
};

export default OrderItem;

