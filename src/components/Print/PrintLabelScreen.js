// import React, { useState } from 'react';
// import {
//     TouchableOpacity,
//     Alert,
//     View as RNView,
//     Modal,
//     FlatList,
//     Text as RNText,
//     Platform,
//     Linking,
//     PermissionsAndroid
// } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import {
//     BluetoothManager,
//     BluetoothEscposPrinter,
//     BluetoothTscPrinter,
// } from "tp-react-native-bluetooth-printer";
// import styled from 'styled-components/native';
// import { colors } from '../../assets/styles/colors';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import {changeOrdersStatus} from "../../services/orderService";
//
// const Container = styled.View`
//   flex: 1;
//   padding: 20px;
//   background-color: #fff;
//   justify-content: center;
//   align-items: center;
// `;
//
// const LabelContainer = styled.View`
//   width: 100%;
//   border-width: 1px;
//   border-color: #ddd;
//   background-color: #f9f9f9;
//   padding: 20px;
//   align-items: center;
//   margin-bottom: 20px;
// `;
//
// const InfoText = styled.Text`
//   font-size: 16px;
//   //color: ${colors.brown.earth};
//   margin-vertical: 5px;
//   text-align: center;
// `;
//
// const Button = styled(TouchableOpacity)`
//   padding: 12px 20px;
//   background-color: ${colors.green.grass};
//   border-radius: 5px;
//   margin-top: 10px;
//   width: 80%;
//   align-items: center;
// `;
//
// const ButtonText = styled.Text`
//   color: #fff;
//   font-size: 16px;
//   font-weight: bold;
// `;
//
// // Кнопка "Find Printer" более компактная, чем ActionButton
// const PrinterButton = styled(TouchableOpacity)`
//   background-color: ${colors.green.grass};
//   border-radius: 5px;
//   padding: 6px 10px;
//   margin-left: 10px; /* Отступ слева, чтобы не прижиматься к тексту */
// `;
//
// const PrinterButtonText = styled.Text`
//   color: #fff;
//   font-size: 14px;
//   font-weight: bold;
// `;
//
// const PrinterInfoContainer = styled.View`
//   position: absolute;
//   top: 10px;
//   right: 20px;
//   z-index: 10;
// `;
//
// // Контейнер для строки «Printer not found» + кнопка «Find Printer»
// const NotFoundRow = styled.View`
//   flex-direction: row;
//   align-items: center;
// `;
//
// // Контейнер для модального окна со списком устройств
// const ModalContainer = styled.View`
//   flex: 1;
//   justify-content: center;
//   align-items: center;
//   background-color: rgba(0,0,0,0.5);
// `;
//
// const ModalContent = styled.View`
//   width: 80%;
//   background-color: #fff;
//   padding: 20px;
//   border-radius: 8px;
// `;
//
// const DeviceRow = styled.TouchableOpacity`
//   padding: 10px;
//   border-bottom-width: 1px;
//   border-bottom-color: #ccc;
// `;
//
// const DeviceRowText = styled.Text`
//   font-size: 16px;
// `;
//
// const PrintLabelScreen = () => {
//     const route = useRoute();
//     const { order } = route.params;
//     console.log('PrintLabelScreen order:', order);
//     // Состояние для информации о принтере и списка найденных устройств
//     const [printerInfo, setPrinterInfo] = useState(null);
//     const [foundPrinters, setFoundPrinters] = useState([]);
//     const [modalVisible, setModalVisible] = useState(false);
//
//     const str = order.order_farm_id;
//     // let farmId = '';
//     let farmId;
//     const match = str.match(/^([A-Z]{2}-[A-Z]{2}-[A-Z0-9]+)/);
//     if (match) {
//         farmId = match[1]; // "US-CA-F95"
//         console.log(farmId);
//     } else {
//         console.log("Не удалось извлечь farmId");
//     }
//
//     // Формируем QR-код с вшитыми данными
//     const qrData = JSON.stringify({
//         orderFarmId: order.order_farm_id,
//         orderAmount: order.order_amount,
//         createdAt: order.created_at,
//         packedAt: new Date().toISOString(),
//         items: order.items.map(item => ({
//             name: item._doc.name,
//             quantity: item._doc.quantity,
//             price: item._doc.price_at_confirmation, // или item.price, если так
//         })),
//         orderId: order.order_id,
//         farmId: farmId,
//         userId: order.customer_id,
//         deliveryAddress: order.manual_address,
//     });
//
//     const requestBluetoothPermissions = async () => {
//       if (Platform.OS === 'android' && Platform.Version >= 31) {
//         const granted = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//           PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         ]);
//         console.log('Permissions:', granted);
//       }
//     };
//
//     // Функция для обработки состояния Bluetooth
//     const handleBluetooth = async () => {
//         await requestBluetoothPermissions();
//         const isEnabled = await BluetoothManager.isBluetoothEnabled();
//         if (!isEnabled) {
//             if (Platform.OS === 'android') {
//                 // На Android можно попытаться включить Bluetooth программно
//                 const devices = await BluetoothManager.enableBluetooth();
//                 console.log("Bluetooth enabled, paired devices:", devices);
//             } else if (Platform.OS === 'ios') {
//                 // На iOS выводим предупреждение с предложением открыть настройки
//                 Alert.alert(
//                     "Bluetooth выключен",
//                     "Пожалуйста, включите Bluetooth в настройках устройства.",
//                     [
//                         {
//                             text: "Отмена",
//                             style: "cancel",
//                         },
//                         {
//                             text: "Открыть настройки",
//                             onPress: () => Linking.openURL('app-settings:'),
//                         },
//                     ],
//                     { cancelable: false }
//                 );
//             }
//         }
//     };
//
//     // Функция фильтрации устройств-принтеров по критерию в имени
//     const filterPrinterDevices = (devicesArray) => {
//         return devicesArray
//             .map(deviceStr => {
//                 try {
//                     return JSON.parse(deviceStr);
//                 } catch (e) {
//                     return null;
//                 }
//             })
//             .filter(device => device && device.name && device.name.toLowerCase().includes("printer"));
//     };
//
//     // Обновлённая функция сканирования, которая возвращает массив принтеров
//     const scanAndConnect = async () => {
//         try {
//             const scannedDevicesStr = await BluetoothManager.scanDevices();
//             const scannedDevices = JSON.parse(scannedDevicesStr);
//             console.log("Scanned devices:", scannedDevices);
//
//             let printerDevices = [];
//             if (scannedDevices.found && scannedDevices.found.length > 0) {
//                 printerDevices = filterPrinterDevices(scannedDevices.found);
//             }
//             if (printerDevices.length === 0 && scannedDevices.paired && scannedDevices.paired.length > 0) {
//                 printerDevices = filterPrinterDevices(scannedDevices.paired);
//             }
//
//             if (printerDevices.length === 1) {
//                 // Если найден только один принтер, подключаемся к нему автоматически
//                 const chosenDevice = printerDevices[0];
//                 console.log("Connecting to device:", chosenDevice);
//                 await BluetoothManager.connect(chosenDevice.address);
//                 console.log("Connected to printer:", chosenDevice);
//                 setPrinterInfo(chosenDevice);
//             } else if (printerDevices.length > 1) {
//                 // Если найдено несколько устройств, сохраняем их и показываем модалку для выбора
//                 setFoundPrinters(printerDevices);
//                 setModalVisible(true);
//             } else {
//                 console.log("No printer device found.");
//             }
//         } catch (error) {
//             console.error("Error during scan/connect:", error);
//         }
//     };
//
//     // Функция, вызываемая из модалки при выборе устройства
//     const selectPrinter = async (device) => {
//         try {
//             console.log("User selected device:", device);
//             await BluetoothManager.connect(device.address);
//             setPrinterInfo(device);
//             setModalVisible(false);
//         } catch (error) {
//             console.error("Error during connect after selection:", error);
//             Alert.alert("Connection error", error.message);
//         }
//     };
//
//
//     const handlePrint = async () => {
//         try {
//             // Проверяем состояние Bluetooth через вызов handleBluetooth
//             await handleBluetooth();
//             // Если принтер не подключен, можно попытаться подключиться
//             let activePrinter = printerInfo;
//             if (!activePrinter) {
//                 const connectedPrinter = await scanAndConnect();
//                 // Если после сканирования принтер всё ещё не найден, прекращаем печать
//                 if (!connectedPrinter) {
//                     Alert.alert("Printer not connected", "No printer found. Please tap 'Find Printer'.");
//                     return;
//                 }
//                 setPrinterInfo(connectedPrinter);
//                 activePrinter = connectedPrinter;
//             }
//             // Формирование параметров для печати (пример, адаптируйте под свои размеры и формат):
//             const printOptions = {
//                 width: 102, // ширина этикетки в мм (101.6 мм округляем до 102)
//                 height: 76, // высота этикетки в мм (76.2 мм округляем до 76)
//                 gap: 2,     // зазор между этикетками
//                 direction: BluetoothTscPrinter.DIRECTION.FORWARD,  // проверьте константы в документации
//                 reference: [0, 0],
//                 tear: BluetoothTscPrinter.TEAR.ON,   // автоматическая обрезка
//                 sound: 0, // звук не используется
//                 text: [
//                     {
//                         text: `Order: ${order.order_farm_id}`,
//                         x: 10,
//                         y: 60,
//                         fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
//                         rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
//                         xscal: 1,
//                         yscal: 1,
//                     },
//                     {
//                         text: `Created: ${new Date(order.created_at).toLocaleString()}`,
//                         x: 10,
//                         y: 80,
//                         fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
//                         rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
//                         xscal: 1,
//                         yscal: 1,
//                     },
//                     {
//                         text: `Delivery: ${order.deliveryAddress}`,
//                         x: 10,
//                         y: 100,
//                         fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
//                         rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
//                         xscal: 1,
//                         yscal: 1,
//                     },
//                 ],
//                 qrcode: [
//                     {
//                         code: qrData, // qrData сформирован ранее
//                         x: 10,
//                         y: 10,
//                         level: BluetoothTscPrinter.EEC.LEVEL_H,
//                         width: 3,
//                         rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
//                     },
//                 ],
//             };
//
//             // Отправка команды на печать
//             const printerResponse = await BluetoothTscPrinter.printLabel(printOptions);
//             console.log("Printer response:", printerResponse);
//             // Здесь можно сохранить printerResponse для дальнейшего использования,
//             // например, сохранить статус печати или обновить заказ на сервере.
//
//         } catch (error) {
//             console.error("Print error:", error);
//             // Обработка ошибки печати, можно вывести alert или другой UI-элемент
//         }
//     };
//
//     const handleSavePacked = () => {
//         changeOrdersStatus('packed', order.order_farm_id, farmId);
//     };
//
//     return (
//         <Container>
//             <PrinterInfoContainer>
//                 {printerInfo ? (
//                     // Если принтер найден
//                     <InfoText>
//                         Printer: {printerInfo.name || printerInfo.model || printerInfo.address}
//                     </InfoText>
//                 ) : (
//                     // Если принтер не найден, показываем надпись и кнопку
//                     <NotFoundRow>
//                         <InfoText style={{ color: 'red' }}>Printer not found</InfoText>
//                         <PrinterButton onPress={scanAndConnect}>
//                             <PrinterButtonText>Find Printer</PrinterButtonText>
//                         </PrinterButton>
//                     </NotFoundRow>
//                 )}
//             </PrinterInfoContainer>
//
//
//             <LabelContainer>
//                 {/* Отображаем QR-код для визуального контроля */}
//                 <QRCode
//                     value={qrData}
//                     size={150}
//                     backgroundColor="#fff"
//                     color="#000"
//                 />
//                 {/* Отображаем под QR текст */}
//                 <InfoText>Order number: {order.order_id}</InfoText>
//                 <InfoText>Created: {new Date(order.created_at).toLocaleString()}</InfoText>
//                 <InfoText>Delivery: {order.manual_address}</InfoText>
//             </LabelContainer>
//
//             <Button onPress={handlePrint}>
//                 <ButtonText>Print</ButtonText>
//             </Button>
//
//             <Button onPress={handleSavePacked}>
//                 <ButtonText>Save Order as Packed</ButtonText>
//             </Button>
//
//             {/* Модальное окно со списком найденных принтеров */}
//             <Modal
//                 visible={modalVisible}
//                 transparent={true}
//                 animationType="slide"
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <ModalContainer>
//                     <ModalContent>
//                         <RNText style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Select Printer</RNText>
//                         <FlatList
//                             data={foundPrinters}
//                             keyExtractor={(item) => item.address}
//                             renderItem={({ item }) => (
//                                 <DeviceRow onPress={() => selectPrinter(item)}>
//                                     <DeviceRowText>{item.name || item.address}</DeviceRowText>
//                                 </DeviceRow>
//                             )}
//                         />
//                         <Button onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
//                             <ButtonText>Cancel</ButtonText>
//                         </Button>
//                     </ModalContent>
//                 </ModalContainer>
//             </Modal>
//         </Container>
//     );
// };
//
// export default PrintLabelScreen;


import React, { useState } from 'react';
import {
    TouchableOpacity,
    Alert,
    View as RNView,
    Modal,
    FlatList,
    Text as RNText,
    Platform,
    Linking,
    PermissionsAndroid
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BluetoothManager, BluetoothEscposPrinter } from "react-native-esc-pos-printer";
import styled from 'styled-components/native';
import { colors } from '../../assets/styles/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { changeOrdersStatus } from "../../services/orderService";

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;

const LabelContainer = styled.View`
  width: 100%;
  border-width: 1px;
  border-color: #ddd;
  background-color: #f9f9f9;
  padding: 20px;
  align-items: center;
  margin-bottom: 20px;
`;

const InfoText = styled.Text`
  font-size: 16px;
  margin-vertical: 5px;
  text-align: center;
`;

const Button = styled(TouchableOpacity)`
  padding: 12px 20px;
  background-color: ${colors.green.grass};
  border-radius: 5px;
  margin-top: 10px;
  width: 80%;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const PrinterButton = styled(TouchableOpacity)`
  background-color: ${colors.green.grass};
  border-radius: 5px;
  padding: 6px 10px;
  margin-left: 10px;
`;

const PrinterButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

const PrinterInfoContainer = styled.View`
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 10;
`;

const NotFoundRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.5);
`;

const ModalContent = styled.View`
  width: 80%;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

const DeviceRow = styled.TouchableOpacity`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

const DeviceRowText = styled.Text`
  font-size: 16px;
`;

const PrintLabelScreen = () => {
    const route = useRoute();
    const { order } = route.params;

    const [printerInfo, setPrinterInfo] = useState(null);
    const [foundPrinters, setFoundPrinters] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const str = order.order_farm_id;
    let farmId;
    const match = str.match(/^([A-Z]{2}-[A-Z]{2}-[A-Z0-9]+)/);
    if (match) {
        farmId = match[1]; // "US-CA-F95"
    }

    const qrData = JSON.stringify({
        orderFarmId: order.order_farm_id,
        orderAmount: order.order_amount,
        createdAt: order.created_at,
        packedAt: new Date().toISOString(),
        items: order.items.map(item => ({
            name: item._doc.name,
            quantity: item._doc.quantity,
            price: item._doc.price_at_confirmation,
        })),
        orderId: order.order_id,
        farmId: farmId,
        userId: order.customer_id,
        deliveryAddress: order.manual_address,
    });

    const requestBluetoothPermissions = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 31) {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);
            console.log('Permissions:', granted);
        }
    };

    const handleBluetooth = async () => {
        await requestBluetoothPermissions();
        const isEnabled = await BluetoothManager.isBluetoothEnabled();
        if (!isEnabled) {
            if (Platform.OS === 'android') {
                const devices = await BluetoothManager.enableBluetooth();
                console.log("Bluetooth enabled, paired devices:", devices);
            } else if (Platform.OS === 'ios') {
                Alert.alert(
                    "Bluetooth is off",
                    "Please enable Bluetooth in the device settings.",
                    [
                        {
                            text: "Cancel",
                            style: "cancel",
                        },
                        {
                            text: "Open settings",
                            onPress: () => Linking.openURL('app-settings:'),
                        },
                    ],
                    { cancelable: false }
                );
            }
        }
    };

    const filterPrinterDevices = (devicesArray) => {
        return devicesArray
            .map(deviceStr => {
                try {
                    return JSON.parse(deviceStr);
                } catch (e) {
                    return null;
                }
            })
            .filter(device => device && device.name && device.name.toLowerCase().includes("printer"));
    };

    const scanAndConnect = async () => {
        try {
            const scannedDevicesStr = await BluetoothManager.scanDevices();
            const scannedDevices = JSON.parse(scannedDevicesStr);
            let printerDevices = [];
            if (scannedDevices.found && scannedDevices.found.length > 0) {
                printerDevices = filterPrinterDevices(scannedDevices.found);
            }
            if (printerDevices.length === 0 && scannedDevices.paired && scannedDevices.paired.length > 0) {
                printerDevices = filterPrinterDevices(scannedDevices.paired);
            }

            if (printerDevices.length === 1) {
                const chosenDevice = printerDevices[0];
                await BluetoothManager.connect(chosenDevice.address);
                setPrinterInfo(chosenDevice);
            } else if (printerDevices.length > 1) {
                setFoundPrinters(printerDevices);
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Error during scan/connect:", error);
        }
    };

    const selectPrinter = async (device) => {
        try {
            await BluetoothManager.connect(device.address);
            setPrinterInfo(device);
            setModalVisible(false);
        } catch (error) {
            console.error("Error during connect after selection:", error);
            Alert.alert("Connection error", error.message);
        }
    };

    const handlePrint = async () => {
        try {
            await handleBluetooth();
            let activePrinter = printerInfo;
            if (!activePrinter) {
                const connectedPrinter = await scanAndConnect();
                if (!connectedPrinter) {
                    Alert.alert("Printer not connected", "No printer found. Please tap 'Find Printer'.");
                    return;
                }
                setPrinterInfo(connectedPrinter);
                activePrinter = connectedPrinter;
            }

            const printOptions = {
                width: 512,
                height: 256,
                gap: 3,
                direction: BluetoothEscposPrinter.DIRECTION.FORWARD,
                reference: [0, 0],
                text: [
                    {
                        text: `Order: ${order.order_farm_id}`,
                        x: 10,
                        y: 60,
                        fonttype: BluetoothEscposPrinter.FONTTYPE.NORMAL, // Changed to NORMAL for English
                    },
                    {
                        text: `Created: ${new Date(order.created_at).toLocaleString()}`,
                        x: 10,
                        y: 80,
                        fonttype: BluetoothEscposPrinter.FONTTYPE.NORMAL, // Changed to NORMAL for English
                    },
                ],
                qrcode: [
                    {
                        code: qrData,
                        x: 10,
                        y: 10,
                        level: BluetoothEscposPrinter.EEC.LEVEL_H,
                        width: 3,
                    },
                ],
            };

            const printerResponse = await BluetoothEscposPrinter.printLabel(printOptions);
            console.log("Printer response:", printerResponse);
        } catch (error) {
            console.error("Print error:", error);
            Alert.alert("Print Error", error.message || "Failed to print label");
        }
    };

    const handleSavePacked = () => {
        changeOrdersStatus('packed', order.order_farm_id, farmId);
    };

    return (
        <Container>
            <PrinterInfoContainer>
                {printerInfo ? (
                    <InfoText>Printer: {printerInfo.name || printerInfo.model || printerInfo.address}</InfoText>
                ) : (
                    <NotFoundRow>
                        <InfoText style={{ color: 'red' }}>Printer not found</InfoText>
                        <PrinterButton onPress={scanAndConnect}>
                            <PrinterButtonText>Find Printer</PrinterButtonText>
                        </PrinterButton>
                    </NotFoundRow>
                )}
            </PrinterInfoContainer>

            <LabelContainer>
                <QRCode value={qrData} size={150} backgroundColor="#fff" color="#000" />
                <InfoText>Order number: {order.order_id}</InfoText>
                <InfoText>Created: {new Date(order.created_at).toLocaleString()}</InfoText>
                <InfoText>Delivery: {order.manual_address}</InfoText>
            </LabelContainer>

            <Button onPress={handlePrint}>
                <ButtonText>Print</ButtonText>
            </Button>

            <Button onPress={handleSavePacked}>
                <ButtonText>Save Order as Packed</ButtonText>
            </Button>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <ModalContainer>
                    <ModalContent>
                        <RNText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Printer</RNText>
                        <FlatList
                            data={foundPrinters}
                            keyExtractor={(item) => item.address}
                            renderItem={({ item }) => (
                                <DeviceRow onPress={() => selectPrinter(item)}>
                                    <DeviceRowText>{item.name || item.address}</DeviceRowText>
                                </DeviceRow>
                            )}
                        />
                        <Button onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                    </ModalContent>
                </ModalContainer>
            </Modal>
        </Container>
    );
};

export default PrintLabelScreen;