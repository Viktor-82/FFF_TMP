import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { addToCart, removeFromCart, updateProductStock } from '../../redux/actions/cartActions';
import { showToast } from "./Notification";
import { colors } from "../../assets/styles/colors";
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, TouchableOpacity } from 'react-native';

// Стили для контейнера
const ControlContainer = styled(View)`
  flex-direction: row;
  //flex: 1;
  margin-top: 10px;
  align-items: center;
  justify-content: ${({ isCart }) => (isCart ? "flex-start" : "space-between")};
  gap: 6px;
  border-radius: 15px;
`;

// Стили для кнопки
const Button = styled(TouchableOpacity)`
  background-color: ${(props) => (props.disabled ? '#cccccc' : colors.neutral.white)};
  color: ${colors.brown.earth};
  border: 1px ${colors.yellowOrange.golden} solid;
  border-radius: 10px;
  width: ${(props) =>
    props.isProductPage
        ? props.single
            ? '100%' // Кнопка занимает всю ширину
            : '35%' // Процентное значение для двух кнопок
        : props.isProductCard && props.single
            ? '150px'
            : '72px'};
  height: 30px;
  font-size: 24px;
  align-items: center;
  justify-content: center;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
`;

// Стили для иконки корзины
const TrashIcon = styled(Text)`
  font-size: 20px;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
`;

// Стили для отображения количества
const QuantityDisplay = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.brown.earth};
  margin-right: ${({ isCart }) => (isCart ? "8px" : "0")};
  align-self: ${({ isCart }) => (isCart ? "flex-end" : "auto")};
`;

const QuantityControl = ({
                             productId,
                             initialQuantity = 0,
                             onAdd,
                             onRemove,
                             onChange,
                             displayQuantityOutside = false,
                             isProductCard = false,
                             isProductPage = false,
                             isCart = false,
                         }) => {
    const dispatch = useDispatch();

    // Получаем данные продукта из состояния Redux
    const product = useSelector((state) =>
        state.product.items.find((item) => item.id === productId)
    );

    const price = product ? product.price : 0;

    // Получаем текущее количество товара из корзины
    const cartItem = useSelector((state) => state.cart.items[productId]);
    const storedQuantity = cartItem ? cartItem.quantity : 0;

    // Получаем stock продукта из Redux
    const productStock = useSelector((state) => state.cart.productStock[productId]) || 0;

    const [quantity, setQuantity] = useState(storedQuantity);

    useEffect(() => {
        setQuantity(storedQuantity);
    }, [storedQuantity]);

    const handleIncrease = () => {
        if (productStock > 0) {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            dispatch(addToCart(productId, newQuantity, price));
            dispatch(updateProductStock(productId, productStock - 1));
            if (onChange) onChange(newQuantity);
        } else {
            showToast(`The product "${product.name}" is out of stock`, 'error');
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            dispatch(addToCart(productId, newQuantity, price));
            dispatch(updateProductStock(productId, productStock + 1));
            if (onChange) onChange(newQuantity);
        } else {
            handleRemove();
        }
    };

    const handleRemove = () => {
        setQuantity(0);
        dispatch(removeFromCart(productId));
        dispatch(updateProductStock(productId, productStock + quantity));
        if (onRemove) onRemove();
    };

    const handleAdd = () => {
        if (productStock > 0) {
            const newQuantity = 1;
            setQuantity(newQuantity);
            dispatch(addToCart(productId, newQuantity, price));
            dispatch(updateProductStock(productId, productStock - 1));
            if (onAdd) onAdd(newQuantity);
        } else {
            showToast(`The product "${product.name}" is out of stock`, 'error');
        }
    };

    return (
        <ControlContainer isCart={isCart}>
            {isCart && (
                <QuantityDisplay isCart>{quantity} unit</QuantityDisplay>
            )}
            {quantity === 0 ? (
                <Button
                    onPress={handleAdd}
                    disabled={productStock <= 0}
                    isProductCard={isProductCard}
                    isProductPage={isProductPage}
                    single
                >
                    <Text>Add</Text>
                </Button>
            ) : (
                <>
                    <Button onPress={handleDecrease} isProductPage={isProductPage}>
                        {/*{quantity > 1 ? <Text>-</Text> : <TrashIcon>🗑️</TrashIcon>}*/}
                        {quantity > 1 ? <Icon name="minus" size={18} color={colors.green.grass} /> : <TrashIcon>🗑️</TrashIcon>}
                    </Button>
                    {!isCart && !displayQuantityOutside && (
                        <QuantityDisplay>{quantity} unit</QuantityDisplay>
                    )}
                    <Button
                        onPress={handleIncrease}
                        disabled={productStock <= 0}
                        isProductPage={isProductPage}
                    >
                        {/*<Text>+</Text>*/}
                        <Icon name="plus" size={18} color={colors.green.grass} />
                    </Button>
                </>
            )}
        </ControlContainer>
    );
};

export default QuantityControl;