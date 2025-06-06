// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { cancelReservation } from "../../services/orderService";
// import { fetchOrdersSuccess, CLEAR_LAST_ORDER } from "../../redux/actions/orderActions";
// import { getOrdersByStatus } from "../../services/orderService";
// import CheckoutForm from "../Payments/CheckoutForm";
// import store from '../../redux/store';
// import { colors } from "../../assets/styles/colors";
// import styled from "styled-components/native";
// import { useNavigation } from "@react-navigation/native";
// import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage';
//
// const ModalOverlay = styled.View`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.5);
//   justify-content: center;
//   align-items: center;
//   z-index: 1000;
// `;
//
// const ModalContainer = styled.View`
//   background-color: white;
//   border-radius: 8px;
//   padding: 20px;
//   width: 90%;
//   max-width: 500px;
//   max-height: 80%;
//   overflow-y: auto;
//   position: relative;
// `;
//
// const CloseButton = styled.TouchableOpacity`
//   //background: none;
//   border: none;
//   font-size: 24px;
//   position: absolute;
//   right: 10px;
//   top: 10px;
// `;
//
// const Timer = styled.Text`
//   font-size: 18px;
//   font-weight: bold;
//   margin-bottom: 15px;
//   color: #333;
//   text-align: center;
// `;
//
// const TimerSum = styled.Text`
//   margin-bottom: 15px;
//   text-align: center;
// `;
//
// const MessageList = styled.View`
//   list-style-type: none;
//   padding: 0;
//   margin-bottom: 20px;
// `;
//
// const MessageItem = styled.Text`
//   margin-bottom: 10px;
//   font-size: 16px;
// `;
//
// const ButtonRow = styled.View`
//   flex-direction: row;
//   justify-content: center;
//   gap: 15px;
// `;
//
// const ActionButton = styled.TouchableOpacity`
//   background-color: ${(props) =>
//           props.variant === "confirm" ? colors.green.grass : props.variant === "cancel" ? "red" : "#ccc"};
//   color: white;
//   padding: 10px 20px;
//   border-radius: 8px;
// `;
//
// const ActionButtonText = styled.Text`
//   color: white;
//   font-size: 18px;
// `;
//
// const CheckoutViewTitle = styled.Text`
//   font-size: 18px;
//   font-weight: bold;
//   text-align: center;
//   margin-bottom: 15px;
// `;
//
// const ConfirmCanselViewTitle = styled.Text`
//   font-size: 18px;
//   font-weight: bold;
//   margin-bottom: 15px;
//   text-align: center;
// `;
//
// const SuccessViewTitle = styled.Text`
//   margin-bottom: 15px;
//   text-align: center;
//   font-size: 20px;
//   font-weight: bold;
// `;
//
// const SuccessViewOrderNum = styled.Text`
//   margin-bottom: 15px;
//   text-align: center;
// `;
//
// const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
// };
//
// const OrderConfirmationModal = ({ isOpen, onClose, totalCost }) => {
//     const dispatch = useDispatch();
//     const navigation = useNavigation();
//     const reservationResult = useSelector((state) => state.cart.reservationResult || {});
//     const products = useSelector((state) => state.product.items || []);
//
//     const [timeLeft, setTimeLeft] = useState(0);
//     const [modalView, setModalView] = useState('timer'); // 'partial' | 'timer' | 'confirmCancel' | 'noItems' | 'success'
//
//     const lastOrder = useSelector((state) => state.orders.lastOrder);
//
//     const problematicItems = Object.entries(reservationResult).filter(([_, data]) => {
//         const msg = data.message || data.error || '';
//         return msg.includes('частично') || msg.includes('закончился');
//     });
//
//     useEffect(() => {
//         if (!isOpen) return;
//
//         if (modalView === 'success') return;
//         if (modalView === 'confirmCancel') return;
//
//         if (problematicItems.length > 0) {
//             setModalView('partial');
//             return;
//         }
//         if (totalCost === 0) {
//             setModalView('noItems');
//             return;
//         }
//         if (!['partial','noItems','checkout','success'].includes(modalView)) {
//             setModalView('timer');
//         }
//     }, [isOpen, modalView, problematicItems.length, totalCost]);
//
//     useEffect(() => {
//         if (!isOpen) return;
//         if (modalView === 'success') return;
//
//         if (lastOrder && lastOrder.orderId) {
//             setModalView('success');
//             getOrdersByStatus('active')
//                 .then((orders) => {
//                     dispatch(fetchOrdersSuccess('active', orders));
//                 })
//                 .catch((error) => {
//                     console.error('Ошибка обновления активных заказов:', error);
//                 });
//         }
//     }, [isOpen, modalView, lastOrder?.orderId, dispatch]);
//
//     useEffect(() => {
//         if (!isOpen) return;
//
//         const setupTimer = async () => {
//             const countdownData = await AsyncStorage.getItem("paymentCountdown");
//             if (countdownData) {
//                 const { orderId, endTime } = JSON.parse(countdownData);
//                 const now = Date.now();
//                 const remainingTime = Math.max(0, endTime - now);
//
//                 if (remainingTime <= 0) {
//                     setTimeLeft(0);
//                     cancelReservation(orderId, reservationResult, dispatch).then(() => {
//                         onClose();
//                     });
//                     return;
//                 }
//
//                 setTimeLeft(Math.floor(remainingTime / 1000));
//
//                 const timer = setInterval(async () => {
//                     const updatedRemainingTime = endTime - Date.now();
//                     if (updatedRemainingTime <= 0) {
//                         clearInterval(timer);
//                         await AsyncStorage.removeItem("paymentCountdown");
//                         await cancelReservation(orderId, reservationResult, dispatch);
//                         onClose();
//                         setTimeLeft(0);
//                     } else {
//                         setTimeLeft(Math.floor(updatedRemainingTime / 1000));
//                     }
//                 }, 1000);
//
//                 return () => clearInterval(timer);
//             } else {
//                 console.warn("Данные таймера отсутствуют в localStorage");
//                 setTimeLeft(0);
//             }
//         };
//
//         setupTimer(); // Вызываем асинхронную функцию
//     }, [isOpen, dispatch, reservationResult, onClose]);
//
//     useEffect(() => {
//         if (modalView === 'noItems') {
//             const handleNoItems = async () => {
//                 try {
//                     const countdownData = await AsyncStorage.getItem("paymentCountdown");
//                     let orderId = null;
//                     if (countdownData) {
//                         const parsed = JSON.parse(countdownData);
//                         orderId = parsed.orderId;
//                     }
//
//                     if (reservationResult && Object.keys(reservationResult).length > 0) {
//                         await cancelReservation(orderId, reservationResult, dispatch); // Используем await вместо .then
//                         await AsyncStorage.removeItem("paymentCountdown");
//                         console.log('ВЫЗОВ ИЗ USE EFFECT');
//                         dispatch({ type: "UPDATE_RESERVATION_RESULT", payload: {} });
//                     }
//                 } catch (error) {
//                     console.error('Ошибка в useEffect:', error);
//                 }
//             };
//
//             handleNoItems(); // Вызываем асинхронную функцию
//         }
//     }, [modalView, dispatch, reservationResult]);
//
//     const handleConfirmPartial = () => {
//         setModalView('timer');
//     };
//
//     const handleCloseClick = () => {
//         setModalView('confirmCancel');
//     };
//
//     const handleCancelYes = async () => {
//         try {
//             const countdownData = await AsyncStorage.getItem("paymentCountdown");
//             console.log('paymentCountdown', countdownData);
//             let orderId = null;
//             if (countdownData) {
//                 const parsed = JSON.parse(countdownData);
//                 orderId = parsed.orderId;
//                 console.log('order id', orderId);
//             }
//
//             await cancelReservation(orderId, reservationResult, dispatch); // Используем await вместо .then
//             await AsyncStorage.removeItem("paymentCountdown");
//             onClose();
//         } catch (error) {
//             console.error('Ошибка в handleCancelYes:', error);
//         }
//     };
//
//     const handleCancelNo = () => {
//         if (problematicItems.length > 0) {
//             setModalView('partial');
//         } else {
//             setModalView('timer');
//         }
//     };
//
//     const getProductNameById = (id) => {
//         const product = products.find(p => p.id === Number(id));
//         return product ? product.name : `ID:${id}`;
//     };
//
//     const handlePayClick = () => {
//         setModalView('checkout');
//     };
//
//     const handleCloseWithReset = async () => {
//         const intervalId = store.getState().cart.paymentIntervalId;
//         if (intervalId) {
//             clearInterval(intervalId);
//             dispatch({ type: "SET_PAYMENT_INTERVAL_ID", payload: null });
//         }
//         dispatch({ type: "UPDATE_RESERVATION_RESULT", payload: {} });
//         await AsyncStorage.removeItem("paymentCountdown");
//         onClose();
//     };
//
//     const renderPartialView = () => (
//         <>
//             {totalCost !== 0 && modalView !== 'noItems' && (
//                 <CloseButton onPress={handleCloseClick}>
//                     <Text>&times;</Text>
//                 </CloseButton>
//             )}
//             <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Changes to the order</Text>
//             <MessageList>
//                 {problematicItems.map(([productId, data]) => {
//                     const msg = data.message || data.error || '';
//                     const productName = data.productName || getProductNameById(productId);
//
//                     if (msg.includes('частично')) {
//                         return (
//                             <MessageItem key={productId}>
//                                 Product "{productName}" available {data.reservedQuantity} шт.
//                             </MessageItem>
//                         );
//                     } else if (msg.includes('закончился')) {
//                         return (
//                             <MessageItem key={productId}>
//                                 The product "{productName}" is out of stock.
//                             </MessageItem>
//                         );
//                     }
//                     return null;
//                 })}
//             </MessageList>
//             {totalCost === 0 ? (
//                 <Text>There are no products to order</Text>
//             ) : (
//                 <Text>The order amount has changed: ${totalCost.toFixed(2)}</Text>
//             )}
//             <ButtonRow>
//                 {totalCost === 0 ? (
//                     <ActionButton variant="cancel" onPress={handleCloseWithReset}>
//                         <ActionButtonText>Close</ActionButtonText>
//                     </ActionButton>
//                 ) : (
//                     <ActionButton variant="confirm" onPress={handleConfirmPartial}>
//                         <ActionButtonText>Confirm</ActionButtonText>
//                     </ActionButton>
//                 )}
//             </ButtonRow>
//         </>
//     );
//
//     const renderTimerView = () => (
//         <>
//             <CloseButton onPress={handleCloseClick}>
//                 <Text>&times;</Text>
//             </CloseButton>
//             <Timer>Remaining time: {formatTime(timeLeft)}</Timer>
//             <TimerSum>Amount to be paid: ${totalCost.toFixed(2)}</TimerSum>
//             <ButtonRow>
//                 <ActionButton variant="confirm" onPress={handlePayClick}>
//                     <ActionButtonText>Pay</ActionButtonText>
//                 </ActionButton>
//             </ButtonRow>
//         </>
//     );
//
//     const renderConfirmCancelView = () => (
//         <>
//             <ConfirmCanselViewTitle>
//                 The order reserve will be removed, do you want to continue?
//             </ConfirmCanselViewTitle>
//             <ButtonRow>
//                 <ActionButton variant="confirm" onPress={handleCancelYes}>
//                     <ActionButtonText>Yes</ActionButtonText>
//                 </ActionButton>
//                 <ActionButton variant="cancel" onPress={handleCancelNo}>
//                     <ActionButtonText>No</ActionButtonText>
//                 </ActionButton>
//             </ButtonRow>
//         </>
//     );
//
//     const renderCheckoutView = () => (
//         <>
//             <CloseButton onPress={onClose}>
//                 <Text>&times;</Text>
//             </CloseButton>
//             <CheckoutViewTitle>Payment for the order</CheckoutViewTitle>
//             <CheckoutForm totalCost={totalCost} />
//         </>
//     );
//
//     const renderSuccessView = () => {
//         if (!lastOrder) return <Text>Loading...</Text>;
//
//         const handleViewOrder = () => {
//             dispatch({ type: CLEAR_LAST_ORDER });
//             navigation.navigate('Orders');
//             onClose();
//         };
//
//         const handleContinue = () => {
//             dispatch({ type: CLEAR_LAST_ORDER });
//             navigation.navigate('Categories');
//             onClose();
//         };
//
//         return (
//             <>
//                 <SuccessViewTitle>Order created successfully!</SuccessViewTitle>
//                 <SuccessViewOrderNum>Order number: {lastOrder.orderId}</SuccessViewOrderNum>
//                 <ButtonRow>
//                     <ActionButton variant="confirm" onPress={handleViewOrder}>
//                         <ActionButtonText>View order</ActionButtonText>
//                     </ActionButton>
//                     <ActionButton variant="confirm" onPress={handleContinue}>
//                         <ActionButtonText>Continue shopping</ActionButtonText>
//                     </ActionButton>
//                 </ButtonRow>
//             </>
//         );
//     };
//
//     if (!isOpen) return null;
//
//     return (
//         <Modal visible={isOpen} transparent animationType="slide">
//             <ModalOverlay>
//                 <ModalContainer>
//                     {modalView === 'partial' && renderPartialView()}
//                     {modalView === 'timer' && renderTimerView()}
//                     {modalView === 'confirmCancel' && renderConfirmCancelView()}
//                     {modalView === 'checkout' && renderCheckoutView()}
//                     {modalView === 'success' && renderSuccessView()}
//                 </ModalContainer>
//             </ModalOverlay>
//         </Modal>
//     );
// };
//
// export default OrderConfirmationModal;
//



import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cancelReservation } from "../../services/orderService";
import { fetchOrdersSuccess, CLEAR_LAST_ORDER } from "../../redux/actions/orderActions";
import { getOrdersByStatus } from "../../services/orderService";
import CheckoutForm from "../Payments/CheckoutForm";
import store from '../../redux/store';
import { colors } from "../../assets/styles/colors";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModalOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.View`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.TouchableOpacity`
  //background: none;
  border: none;
  font-size: 24px;
  position: absolute;
  right: 10px;
  top: 10px;
`;

const Timer = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
`;

const TimerSum = styled.Text`
  margin-bottom: 15px;
  text-align: center;
`;

const MessageList = styled.View`
  list-style-type: none;
  padding: 0;
  margin-bottom: 20px;
`;

const MessageItem = styled.Text`
  margin-bottom: 10px;
  font-size: 16px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 15px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${(props) =>
    props.variant === "confirm" ? colors.green.grass : props.variant === "cancel" ? "red" : "#ccc"};
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
`;

const ActionButtonText = styled.Text`
  color: white;
  font-size: 18px;
`;

const CheckoutViewTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
`;

const ConfirmCanselViewTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
`;

const SuccessViewTitle = styled.Text`
  margin-bottom: 15px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
`;

const SuccessViewOrderNum = styled.Text`
  margin-bottom: 15px;
  text-align: center;
`;

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
};

const OrderConfirmationModal = ({ isOpen, onClose, totalCost }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const reservationResult = useSelector((state) => state.cart.reservationResult || {});
    const products = useSelector((state) => state.product.items || []);

    const [timeLeft, setTimeLeft] = useState(0);
    const [modalView, setModalView] = useState('timer'); // 'partial' | 'timer' | 'confirmCancel' | 'noItems' | 'success'

    const lastOrder = useSelector((state) => state.orders.lastOrder);

    const problematicItems = Object.entries(reservationResult).filter(([_, data]) => {
        const msg = data.message || data.error || '';
        return msg.includes('частично') || msg.includes('закончился');
    });

    useEffect(() => {
        if (!isOpen) return;

        if (modalView === 'success') return;
        if (modalView === 'confirmCancel') return;

        if (problematicItems.length > 0) {
            setModalView('partial');
            return;
        }
        if (totalCost === 0) {
            setModalView('noItems');
            return;
        }
        if (!['partial','noItems','checkout','success'].includes(modalView)) {
            setModalView('timer');
        }
    }, [isOpen, modalView, problematicItems.length, totalCost]);

    useEffect(() => {
        if (!isOpen) return;
        if (modalView === 'success') return;

        if (lastOrder && lastOrder.orderId) {
            setModalView('success');
            getOrdersByStatus('active')
                .then((orders) => {
                    dispatch(fetchOrdersSuccess('active', orders));
                })
                .catch((error) => {
                    console.error('Ошибка обновления активных заказов:', error);
                });
        }
    }, [isOpen, modalView, lastOrder?.orderId, dispatch]);

    const timerRef = useRef(null);

    // useEffect(() => {
    //     if (!isOpen) return;
    //
    //     const setupTimer = async () => {
    //         const countdownData = await AsyncStorage.getItem("paymentCountdown");
    //         if (countdownData) {
    //             const { orderId, endTime } = JSON.parse(countdownData);
    //             const now = Date.now();
    //             const remainingTime = Math.max(0, endTime - now);
    //
    //             if (remainingTime <= 0) {
    //                 setTimeLeft(0);
    //                 cancelReservation(orderId, reservationResult, dispatch).then(() => {
    //                     onClose();
    //                 });
    //                 return;
    //             }
    //
    //             setTimeLeft(Math.floor(remainingTime / 1000));
    //
    //             const timer = setInterval(async () => {
    //                 const updatedRemainingTime = endTime - Date.now();
    //                 if (updatedRemainingTime <= 0) {
    //                     clearInterval(timer);
    //                     await AsyncStorage.removeItem("paymentCountdown");
    //                     await cancelReservation(orderId, reservationResult, dispatch);
    //                     onClose();
    //                     setTimeLeft(0);
    //                 } else {
    //                     setTimeLeft(Math.floor(updatedRemainingTime / 1000));
    //                 }
    //             }, 1000);
    //
    //             return () => clearInterval(timer);
    //         } else {
    //             console.warn("Данные таймера отсутствуют в localStorage");
    //             setTimeLeft(0);
    //         }
    //     };
    //
    //     setupTimer(); // Вызываем асинхронную функцию
    //
    //     return () => {
    //         if (timerRef.current) {
    //             clearInterval(timerRef.current);
    //             timerRef.current = null;
    //         }
    //     };
    // }, [isOpen, dispatch, reservationResult, onClose]);
    useEffect(() => {
        if (!isOpen) return;

        if (modalView === 'success') {
            console.log("Оплата успешна, таймер остановлен.");
            return; // 🚨 Остановка таймера после оплаты
        }

        const setupTimer = async () => {
            const countdownData = await AsyncStorage.getItem("paymentCountdown");
            if (!countdownData) {
                console.warn("Данные таймера отсутствуют в AsyncStorage");
                setTimeLeft(0);
                return;
            }

            const { orderId, endTime } = JSON.parse(countdownData);
            const now = Date.now();
            const remainingTime = Math.max(0, endTime - now);

            if (remainingTime <= 0) {
                setTimeLeft(0);
                await cancelReservation(orderId, reservationResult, dispatch);
                onClose();
                return;
            }

            setTimeLeft(Math.floor(remainingTime / 1000));

            // Сохраняем `setInterval` в `useRef`
            timerRef.current = setInterval(async () => {
                const updatedRemainingTime = endTime - Date.now();
                if (updatedRemainingTime <= 0) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                    await AsyncStorage.removeItem("paymentCountdown");
                    await cancelReservation(orderId, reservationResult, dispatch);
                    onClose();
                    setTimeLeft(0);
                } else {
                    setTimeLeft(Math.floor(updatedRemainingTime / 1000));
                }
            }, 1000);
        };

        setupTimer();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isOpen, dispatch, modalView, reservationResult, onClose]);

    useEffect(() => {
        if (modalView === 'noItems') {
            const handleNoItems = async () => {
                try {
                    const countdownData = await AsyncStorage.getItem("paymentCountdown");
                    let orderId = null;
                    if (countdownData) {
                        const parsed = JSON.parse(countdownData);
                        orderId = parsed.orderId;
                    }

                    if (reservationResult && Object.keys(reservationResult).length > 0) {
                        await cancelReservation(orderId, reservationResult, dispatch); // Используем await вместо .then
                        await AsyncStorage.removeItem("paymentCountdown");
                        console.log('ВЫЗОВ ИЗ USE EFFECT');
                        dispatch({ type: "UPDATE_RESERVATION_RESULT", payload: {} });
                    }
                } catch (error) {
                    console.error('Ошибка в useEffect:', error);
                }
            };

            handleNoItems(); // Вызываем асинхронную функцию
        }
    }, [modalView, dispatch, reservationResult]);

    const handleConfirmPartial = () => {
        setModalView('timer');
    };

    const handleCloseClick = () => {
        setModalView('confirmCancel');
    };

    // const handleCancelYes = async () => {
    //     try {
    //         const countdownData = await AsyncStorage.getItem("paymentCountdown");
    //         console.log('paymentCountdown', countdownData);
    //         let orderId = null;
    //         if (countdownData) {
    //             const parsed = JSON.parse(countdownData);
    //             orderId = parsed.orderId;
    //             console.log('order id', orderId);
    //         }
    //
    //         // Очищаем локальный таймер
    //         if (timerRef.current) {
    //             clearInterval(timerRef.current);
    //             timerRef.current = null;
    //         }
    //
    //
    //         await cancelReservation(orderId, reservationResult, dispatch); // Используем await вместо .then
    //         await AsyncStorage.removeItem("paymentCountdown");
    //         setModalView('timer'); // открывает timer на следующем Confirm Order
    //         onClose();
    //     } catch (error) {
    //         console.error('Ошибка в handleCancelYes:', error);
    //     }
    // };
    const handleCancelYes = async () => {
        try {
            const countdownData = await AsyncStorage.getItem("paymentCountdown");
            let orderId = null;
            if (countdownData) {
                const parsed = JSON.parse(countdownData);
                orderId = parsed.orderId;
            }



            await cancelReservation(orderId, reservationResult, dispatch);
            await AsyncStorage.removeItem("paymentCountdown");

            // Очищаем локальный таймер
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                console.log('Локальный таймер очищен');
            }

            // Очищаем Redux-таймер
            const intervalId = store.getState().cart.paymentIntervalId;
            if (intervalId) {
                clearInterval(intervalId);
                dispatch({ type: "SET_PAYMENT_INTERVAL_ID", payload: null });
                console.log('Redux-таймер очищен');
            }

            setModalView('timer');
            onClose();
        } catch (error) {
            console.error('Ошибка в handleCancelYes:', error);
        }
    };


    const handleCancelNo = () => {
        if (problematicItems.length > 0) {
            setModalView('partial');
        } else {
            setModalView('timer');
        }
    };

    const getProductNameById = (id) => {
        const product = products.find(p => p.id === Number(id));
        return product ? product.name : `ID:${id}`;
    };

    const handlePayClick = () => {
        setModalView('checkout');
    };

    const handleCloseWithReset = async () => {
        const intervalId = store.getState().cart.paymentIntervalId;
        if (intervalId) {
            clearInterval(intervalId);
            dispatch({ type: "SET_PAYMENT_INTERVAL_ID", payload: null });
        }
        dispatch({ type: "UPDATE_RESERVATION_RESULT", payload: {} });
        await AsyncStorage.removeItem("paymentCountdown");
        onClose();
    };

    const renderPartialView = () => (
        <>
            {totalCost !== 0 && modalView !== 'noItems' && (
                <CloseButton onPress={handleCloseClick}>
                    <Text>&times;</Text>
                </CloseButton>
            )}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Changes to the order</Text>
            <MessageList>
                {problematicItems.map(([productId, data]) => {
                    const msg = data.message || data.error || '';
                    const productName = data.productName || getProductNameById(productId);

                    if (msg.includes('частично')) {
                        return (
                            <MessageItem key={productId}>
                                Product "{productName}" available {data.reservedQuantity} шт.
                            </MessageItem>
                        );
                    } else if (msg.includes('закончился')) {
                        return (
                            <MessageItem key={productId}>
                                The product "{productName}" is out of stock.
                            </MessageItem>
                        );
                    }
                    return null;
                })}
            </MessageList>
            {totalCost === 0 ? (
                <Text>There are no products to order</Text>
            ) : (
                <Text>The order amount has changed: ${totalCost.toFixed(2)}</Text>
            )}
            <ButtonRow>
                {totalCost === 0 ? (
                    <ActionButton variant="cancel" onPress={handleCloseWithReset}>
                        <ActionButtonText>Close</ActionButtonText>
                    </ActionButton>
                ) : (
                    <ActionButton variant="confirm" onPress={handleConfirmPartial}>
                        <ActionButtonText>Confirm</ActionButtonText>
                    </ActionButton>
                )}
            </ButtonRow>
        </>
    );

    const renderTimerView = () => (
        <>
            <CloseButton onPress={handleCloseClick}>
                <Text>&times;</Text>
            </CloseButton>
            <Timer>Remaining time: {formatTime(timeLeft)}</Timer>
            <TimerSum>Amount to be paid: ${totalCost.toFixed(2)}</TimerSum>
            <ButtonRow>
                <ActionButton variant="confirm" onPress={handlePayClick}>
                    <ActionButtonText>Pay</ActionButtonText>
                </ActionButton>
            </ButtonRow>
        </>
    );

    const renderConfirmCancelView = () => (
        <>
            <ConfirmCanselViewTitle>
                The order reserve will be removed, do you want to continue?
            </ConfirmCanselViewTitle>
            <ButtonRow>
                <ActionButton variant="confirm" onPress={handleCancelYes}>
                    <ActionButtonText>Yes</ActionButtonText>
                </ActionButton>
                <ActionButton variant="cancel" onPress={handleCancelNo}>
                    <ActionButtonText>No</ActionButtonText>
                </ActionButton>
            </ButtonRow>
        </>
    );

    const renderCheckoutView = () => (
        <>
            <CloseButton onPress={onClose}>
                <Text>&times;</Text>
            </CloseButton>
            <CheckoutViewTitle>Payment for the order</CheckoutViewTitle>
            <CheckoutForm totalCost={totalCost} />
        </>
    );

    const renderSuccessView = () => {
        if (!lastOrder) return <Text>Loading...</Text>;

        const handleViewOrder = () => {
            dispatch({ type: CLEAR_LAST_ORDER });
            navigation.navigate('Orders');
            onClose();
        };

        const handleContinue = () => {
            dispatch({ type: CLEAR_LAST_ORDER });
            navigation.navigate('Categories');
            onClose();
        };

        return (
            <>
                <SuccessViewTitle>Order created successfully!</SuccessViewTitle>
                <SuccessViewOrderNum>Order number: {lastOrder.orderId}</SuccessViewOrderNum>
                <ButtonRow>
                    <ActionButton variant="confirm" onPress={handleViewOrder}>
                        <ActionButtonText>View order</ActionButtonText>
                    </ActionButton>
                    <ActionButton variant="confirm" onPress={handleContinue}>
                        <ActionButtonText>Continue shopping</ActionButtonText>
                    </ActionButton>
                </ButtonRow>
            </>
        );
    };

    if (!isOpen) return null;

    return (
        <Modal visible={isOpen} transparent animationType="slide">
            <ModalOverlay>
                <ModalContainer>
                    {modalView === 'partial' && renderPartialView()}
                    {modalView === 'timer' && renderTimerView()}
                    {modalView === 'confirmCancel' && renderConfirmCancelView()}
                    {modalView === 'checkout' && renderCheckoutView()}
                    {modalView === 'success' && renderSuccessView()}
                </ModalContainer>
            </ModalOverlay>
        </Modal>
    );
};

export default OrderConfirmationModal;

