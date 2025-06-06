// // import React, { useState, useEffect } from 'react';
// // import { View, Text, Image, TextInput, Switch, TouchableOpacity } from 'react-native';
// // import styled from 'styled-components/native';
// // // Пример импортов цветовой схемы (адаптируйте под ваш проект)
// // import { colors } from "../../assets/styles/colors";
// //
// // /* =============================
// //    Стили
// //    ============================= */
// //
// // // Контейнер всей карточки
// // const ProductCardContainer = styled.View`
// //   flex-direction: column;
// //   padding: 10px;
// //   margin-bottom: 10px;
// //   border-width: 1px;
// //   border-color: #e0e0e0;
// //   border-radius: 10px;
// //   background-color: ${colors.neutral.white};
// // `;
// //
// // // Горизонтальный ряд для отображения «лейбл: значение»
// // const FieldRow = styled.View`
// //   flex-direction: row;
// //   align-items: center;
// //   margin-bottom: 5px;
// //   //flex-wrap: wrap;
// // `;
// //
// // const FieldRowSpecial = styled.View`
// //   flex-direction: row;
// //   align-items: flex-start;
// //   margin-bottom: 6px;
// // `;
// //
// // const ImageContainer = styled.Image`
// //   width: 75px;
// //   height: 75px;
// //   margin-right: 10px;
// //   border-radius: 3px;
// // `;
// //
// // const TextContainer = styled.View`
// //   flex: 1; /* Занимает все оставшееся место */
// // `;
// //
// // // «Лейбл» поля
// // const FieldLabel = styled.Text`
// //   font-weight: bold;
// //   width: 130px;
// //   color: ${colors.brown.earth};
// // `;
// //
// // const FieldLabelSpecial = styled.Text`
// //   font-weight: bold;
// //   width: 45px;
// //   color: ${colors.brown.earth};
// // `;
// //
// // // Стандартное отображение значения (read-only)
// // const FieldValue = styled.Text`
// //   flex: 1;
// //   flex-wrap: wrap;
// // `;
// //
// // // Специальное отображение цены — если есть promotional_price, делаем красный зачёркнутый текст
// // const PriceValue = styled.Text`
// //   color: ${({ isStriked }) => (isStriked ? 'red' : '#333')};
// //   text-decoration-line: ${({ isStriked }) => (isStriked ? 'line-through' : 'none')};
// // `;
// //
// // // Поле для редактирования (quick edit)
// // const EditableInput = styled.TextInput`
// //   flex: 1;
// //   border: 1px solid #ccc;
// //   padding: 1px 5px;
// //   //color: ${colors.brown.earth};
// //   color: blue;
// //   margin-bottom: ${({ isFirst }) => (isFirst ? "6px" : "0")};
// // `;
// //
// // // Кнопка (используем TouchableOpacity)
// // const Button = styled(TouchableOpacity)`
// //   padding: 4px 10px;
// //   //background-color: ${colors.green.olive};
// //   background-color: ${colors.green.grass};
// //   border-radius: 8px;
// //   margin-right: 10px;
// // `;
// //
// // // Текст внутри кнопки
// // const ButtonText = styled(Text)`
// //   font-size: 15px;
// //   color: ${colors.neutral.white};
// // `;
// //
// // /* =============================
// //    Основной компонент
// //    ============================= */
// // const WarehouseProductCard = ({ product, onEdit, onViewAsCustomer }) => {
// //     // Данные, которые хотим отредактировать «быстро»
// //     const [price, setPrice] = useState(product.price);
// //     const [promotionalPrice, setPromotionalPrice] = useState(product.promotional_price);
// //     const [stock, setStock] = useState(product.stock);
// //     const [published, setPublished] = useState(product.published);
// //
// //     // Режим быстрого редактирования
// //     const [isQuickEdit, setIsQuickEdit] = useState(false);
// //     // Отслеживаем, менялось ли что-либо
// //     const [hasChanges, setHasChanges] = useState(false);
// //
// //     // Проверяем, есть ли изменения по сравнению с исходными пропами
// //     useEffect(() => {
// //         if (
// //             price !== product.price ||
// //             promotionalPrice !== product.promotional_price ||
// //             stock !== product.stock ||
// //             published !== product.published
// //         ) {
// //             setHasChanges(true);
// //         } else {
// //             setHasChanges(false);
// //         }
// //     }, [price, promotionalPrice, stock, published]);
// //
// //     // Логика клика по кнопке Quick Edit / Save
// //     const handleQuickEditPress = () => {
// //         if (!isQuickEdit) {
// //             // Включаем режим quick edit
// //             setIsQuickEdit(true);
// //         } else {
// //             // Уже в режиме quick edit
// //             if (hasChanges) {
// //                 // Сохраняем (на уровне состояния компонента)
// //                 // В реальном проекте здесь может быть отправка на сервер или вызов onSave и т.д.
// //                 console.log("Saving changes (quick edit)...");
// //                 // Снова выключаем режим редактирования
// //                 setIsQuickEdit(false);
// //             } else {
// //                 // Если нет изменений, просто выходим из режима
// //                 setIsQuickEdit(false);
// //             }
// //         }
// //     };
// //
// //     // Текст кнопки «Quick Edit» / «Save»
// //     let quickEditButtonLabel = "Quick Edit";
// //     if (isQuickEdit && hasChanges) {
// //         quickEditButtonLabel = "Save";
// //     }
// //
// //     // Кнопка Edit (открытие другого компонента)
// //     const handleEditPress = () => {
// //         if (onEdit) {
// //             onEdit(product);
// //         }
// //     };
// //
// //     // Кнопка View as customer
// //     const handleViewAsCustomer = () => {
// //         if (onViewAsCustomer) {
// //             onViewAsCustomer(product);
// //         }
// //     };
// //
// //     // Подпись под переключателем published
// //     const publishedLabel = published ? "publish" : "hide";
// //
// //     // test
// //
// //     return (
// //         <ProductCardContainer>
// //             {/* Пример отображения фото, product_id и name */}
// //             <FieldRowSpecial>
// //                 <ImageContainer source={{ uri: product.photo }} />
// //                 <TextContainer>
// //                     <FieldRowSpecial>
// //                         <FieldLabelSpecial>Name:</FieldLabelSpecial>
// //                         <FieldValue>{product.name}</FieldValue>
// //                     </FieldRowSpecial>
// //                     <FieldRowSpecial>
// //                         <FieldLabelSpecial>Stock:</FieldLabelSpecial>
// //                         {isQuickEdit ? (
// //                             <EditableInput  isFirst={true}
// //                                 value={stock.toString()}
// //                                 onChangeText={(val) => setStock(val.replace(/[^0-9]/g, ""))}
// //                                 keyboardType="numeric"
// //                             />
// //                         ) : (
// //                             <FieldValue>{stock}</FieldValue>
// //                         )}
// //                     </FieldRowSpecial>
// //                     <FieldRowSpecial>
// //                         <FieldLabelSpecial>Price:</FieldLabelSpecial>
// //                         {isQuickEdit ? (
// //                             <EditableInput
// //                                 value={price.toString()}
// //                                 onChangeText={(val) => setPrice(val.replace(/[^0-9]/g, ""))}
// //                                 keyboardType="numeric"
// //                             />
// //                         ) : (
// //                             <PriceValue isStriked={promotionalPrice && promotionalPrice !== ""}>
// //                                 {price}
// //                             </PriceValue>
// //                         )}
// //                     </FieldRowSpecial>
// //                 </TextContainer>
// //             </FieldRowSpecial>
// //
// //             {/* promotional_price */}
// //             {(isQuickEdit || product.promotional_price !== null) && (
// //                 <FieldRow>
// //                     <FieldLabel>Promotional Price:</FieldLabel>
// //                     {isQuickEdit ? (
// //                         <EditableInput
// //                             value={promotionalPrice?.toString() || ""}
// //                             onChangeText={(val) => setPromotionalPrice(val.replace(/[^0-9.]/g, ""))}
// //                             keyboardType="numeric"
// //                         />
// //                     ) : (
// //                         <FieldValue>{promotionalPrice}</FieldValue>
// //                     )}
// //                 </FieldRow>
// //             )}
// //
// //             {/* published (switch + подпись) */}
// //             <FieldRow>
// //                 <FieldLabel>Published:</FieldLabel>
// //                 {isQuickEdit ? (
// //                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
// //                         <Switch
// //                             value={published}
// //                             onValueChange={(val) => setPublished(val)}
// //                         />
// //                         <Text style={{ marginLeft: 5 }}>{publishedLabel}</Text>
// //                     </View>
// //                 ) : (
// //                     <Text>{publishedLabel}</Text>
// //                 )}
// //             </FieldRow>
// //
// //             <FieldRow>
// //                 <FieldLabel>Unit:</FieldLabel>
// //                 <FieldValue>{product.unit}</FieldValue>
// //             </FieldRow>
// //
// //             {product.unit_description && (
// //                 <FieldRow>
// //                     <FieldLabel>Unit Description:</FieldLabel>
// //                     <FieldValue>{product.unit_description}</FieldValue>
// //                 </FieldRow>
// //             )}
// //
// //             <FieldRow>
// //                 <FieldLabel>Description:</FieldLabel>
// //                 <FieldValue>{product.description}</FieldValue>
// //             </FieldRow>
// //
// //             {product.additionalDetails && (
// //                 <FieldRow>
// //                     <FieldLabel>Additional details:</FieldLabel>
// //                     <FieldValue>{product.additionalDetails}</FieldValue>
// //                 </FieldRow>
// //             )}
// //
// //             {product.category && (
// //                 <FieldRow>
// //                     <FieldLabel>Category:</FieldLabel>
// //                     <FieldValue>{product.category}</FieldValue>
// //                 </FieldRow>
// //             )}
// //
// //             {product.subcategory && (
// //                 <FieldRow>
// //                     <FieldLabel>Subcategory:</FieldLabel>
// //                     <FieldValue>{product.subcategory}</FieldValue>
// //                 </FieldRow>
// //             )}
// //
// //             {product.custom_category && (
// //                 <FieldRow>
// //                     <FieldLabel>Custom Cat:</FieldLabel>
// //                     <FieldValue>{product.custom_category}</FieldValue>
// //                 </FieldRow>
// //             )}
// //
// //             {product.custom_subcategory && (
// //                 <FieldRow>
// //                     <FieldLabel>Custom Subcat:</FieldLabel>
// //                     <FieldValue>{product.custom_subcategory}</FieldValue>
// //                 </FieldRow>
// //             )}
// //
// //             {/* Кнопки */}
// //             <FieldRow style={{ justifyContent: 'space-between', marginTop: 10 }}>
// //                 <Button onPress={handleEditPress}>
// //                     <ButtonText>Edit</ButtonText>
// //                 </Button>
// //                 {/*<Button onPress={handleViewAsCustomer}>*/}
// //                 {/*    <ButtonText>View as customer</ButtonText>*/}
// //                 {/*</Button>*/}
// //                 <Button onPress={handleQuickEditPress}>
// //                     <ButtonText>{quickEditButtonLabel}</ButtonText>
// //                 </Button>
// //             </FieldRow>
// //         </ProductCardContainer>
// //     );
// // };
// //
// // export default WarehouseProductCard;
//
//
// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TextInput, Switch, TouchableOpacity } from 'react-native';
// import { useDispatch } from "react-redux";
// import { updateProductChanges, clearProductChanges } from "../../redux/actions/productChangesActions";
// import axios from "axios";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import styled from 'styled-components/native';
// import { showToast } from '../Shared/Notification';
// // Пример импортов цветовой схемы (адаптируйте под ваш проект)
// import { colors } from "../../assets/styles/colors";
//
// /* =============================
//   Стили
//   ============================= */
//
// // Контейнер всей карточки
// const ProductCardContainer = styled.View`
//  flex-direction: column;
//  padding: 10px;
//  margin-bottom: 10px;
//  border-width: 1px;
//  border-color: #e0e0e0;
//  border-radius: 10px;
//  background-color: ${colors.neutral.white};
// `;
//
// // Горизонтальный ряд для отображения «лейбл: значение»
// const FieldRow = styled.View`
//  flex-direction: row;
//  align-items: center;
//  margin-bottom: 5px;
//  //flex-wrap: wrap;
// `;
//
// const FieldRowSpecial = styled.View`
//  flex-direction: row;
//  align-items: flex-start;
//  margin-bottom: 6px;
// `;
//
// const ImageContainer = styled.Image`
//  width: 75px;
//  height: 75px;
//  margin-right: 10px;
//  border-radius: 3px;
// `;
//
// const TextContainer = styled.View`
//  flex: 1; /* Занимает все оставшееся место */
// `;
//
// // «Лейбл» поля
// const FieldLabel = styled.Text`
//  font-weight: bold;
//  width: 130px;
//  color: ${colors.brown.earth};
// `;
//
// const FieldLabelSpecial = styled.Text`
//  font-weight: bold;
//  width: 45px;
//  color: ${colors.brown.earth};
// `;
//
// // Стандартное отображение значения (read-only)
// const FieldValue = styled.Text`
//  flex: 1;
//  flex-wrap: wrap;
// `;
//
// // Специальное отображение цены — если есть promotional_price, делаем красный зачёркнутый текст
// const PriceValue = styled.Text`
//  color: ${({ isStriked }) => (isStriked ? 'red' : '#333')};
//  text-decoration-line: ${({ isStriked }) => (isStriked ? 'line-through' : 'none')};
// `;
//
// // Поле для редактирования (quick edit)
// const EditableInput = styled.TextInput`
//  flex: 1;
//  border: 1px solid #ccc;
//  padding: 1px 5px;
//  //color: blue;
//  color: ${({ hasError }) => (hasError ? 'red' : 'blue')};
//  text-decoration-line: ${({ hasError }) => (hasError ? 'line-through' : 'none')};
//  margin-bottom: ${({ isFirst }) => (isFirst ? "6px" : "0")};
// `;
//
// // Кнопка (используем TouchableOpacity)
// const Button = styled(TouchableOpacity)`
//  padding: 4px 10px;
//  //background-color: ${colors.green.grass};
//  background-color: ${({ disabled }) => (disabled ? colors.neutral.gray : colors.green.grass)};
//  border-radius: 8px;
//  margin-right: 10px;
//  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
// `;
//
// // Текст внутри кнопки
// const ButtonText = styled(Text)`
//  font-size: 15px;
//  color: ${colors.neutral.white};
// `;
//
// /* =============================
//   Основной компонент
//   ============================= */
// const WarehouseProductCard = ({ product, onEdit, onViewAsCustomer }) => {
//     // Данные, которые хотим отредактировать «быстро»
//     const [price, setPrice] = useState(product.price);
//     const [promotionalPrice, setPromotionalPrice] = useState(product.promotional_price);
//     const [stock, setStock] = useState(product.stock);
//     const [published, setPublished] = useState(product.published);
//     const [isQuickEdit, setIsQuickEdit] = useState(false);
//     const [hasChanges, setHasChanges] = useState(false);
//     const [promotionalPriceError, setPromotionalPriceError] = useState(false);
//     const [changeData, setChangeData] = useState({});
//     const dispatch = useDispatch();
//
//     // Проверяем, есть ли изменения по сравнению с исходными пропами
//     useEffect(() => {
//         if (
//             price !== product.price ||
//             // promotionalPrice !== product.promotional_price ||
//             (promotionalPrice !== "" ? promotionalPrice : null) !== product.promotional_price ||
//             stock !== product.stock ||
//             published !== product.published
//         ) {
//             setHasChanges(true);
//         } else {
//             setHasChanges(false);
//         }
//     }, [price, promotionalPrice, stock, published]);
//
//     useEffect(() => {
//         if (promotionalPrice >= price) {
//             setPromotionalPriceError(true);
//             showToast('Promotional price should be lower price', 'error');
//         } else {
//             setPromotionalPriceError(false);
//         }
//     }, [price, promotionalPrice]);
//
//     // Логика клика по кнопке Quick Edit / Save
//     // const handleQuickEditPress = async () => {
//     //     if (!isQuickEdit) {
//     //         setIsQuickEdit(true);
//     //     } else {
//     //         if (hasChanges) {
//     //             // Записываем изменения в Redux (только измененные поля)
//     //             dispatch(updateProductChanges(product.product_id, {
//     //                 price: price !== product.price ? price : undefined,
//     //                 promotional_price: promotionalPrice !== product.promotional_price ? promotionalPrice : undefined,
//     //                 stock: stock !== product.stock ? stock : undefined,
//     //                 published: published !== product.published ? published : undefined
//     //             }));
//     //
//     //             setChangeData(product.product_id, {
//     //                 price: price !== product.price ? price : undefined,
//     //                 promotional_price: promotionalPrice !== product.promotional_price ? promotionalPrice : undefined,
//     //                 stock: stock !== product.stock ? stock : undefined,
//     //                 published: published !== product.published ? published : undefined
//     //             });
//     //
//     //             const productId = changeData.product_id;
//     //             const changes = changeData.changes;
//     //
//     //             console.log('productId', productId);
//     //             console.log('changes', changes);
//     //
//     //             try {
//     //                 const token = await AsyncStorage.getItem('authToken');
//     //                 const response = await axios.post(`https://marketplace-usa-backend-1.onrender.com/api/products/update-product/${productId}`, changes, {
//     //                     // headers: { "Content-Type": "application/json" },
//     //                      headers: { Authorization: `Bearer ${token}` }
//     //                 });
//     //
//     //                 if (response.status === 200) {
//     //                     showToast("Изменения успешно сохранены!", "success");
//     //                     dispatch(clearProductChanges());
//     //                 } else {
//     //                     showToast("Ошибка при сохранении", "error");
//     //                 }
//     //             } catch (error) {
//     //                 showToast("Ошибка соединения", "error");
//     //             }
//     //
//     //             // Выключаем режим редактирования
//     //             setIsQuickEdit(false);
//     //         } else {
//     //             // Если нет изменений, просто выходим из режима
//     //             setIsQuickEdit(false);
//     //         }
//     //     }
//     // };
//
//     const handleQuickEditPress = async () => {
//         // Если мы уже в режиме редактирования, то при повторном клике — это «Save»
//         if (isQuickEdit) {
//             if (hasChanges) {
//                 // 1) Сформировали объект «changes» прямо тут
//                 const changes = {
//                     price: price !== product.price ? price : undefined,
//                     promotional_price: promotionalPrice !== product.promotional_price ? promotionalPrice : undefined,
//                     stock: stock !== product.stock ? stock : undefined,
//                     published: published !== product.published ? published : undefined
//                 };
//
//                 // 2) Обновили Redux
//                 dispatch(updateProductChanges(product.product_id, changes));
//
//                 // 3) (Необязательно) Сохранили локально, если нужно
//                 setChangeData({ product_id: product.product_id, changes });
//
//                 // 4) Сразу отправили запрос, используя «changes»
//                 try {
//                     const token = await AsyncStorage.getItem('authToken');
//                     const response = await axios.post(
//                         `https://marketplace-usa-backend-1.onrender.com/api/products/update-product/${product.product_id}`,
//                         changes,
//                         {
//                             headers: {
//                                 Authorization: `Bearer ${token}`,
//                             },
//                         }
//                     );
//
//                     if (response.status === 200) {
//                         showToast("Изменения успешно сохранены!", "success");
//                         dispatch(clearProductChanges());
//                     } else {
//                         showToast("Ошибка при сохранении", "error");
//                     }
//                 } catch (error) {
//                     showToast("Ошибка соединения", "error");
//                 }
//             }
//
//             // В любом случае выходим из режима редактирования
//             setIsQuickEdit(false);
//
//         } else {
//             // Если мы ещё не в режиме редактирования — включаем его
//             setIsQuickEdit(true);
//         }
//     };
//
//
//     // Текст кнопки «Quick Edit» / «Save»
//     let quickEditButtonLabel = "Quick Edit";
//     if (isQuickEdit && hasChanges) {
//         quickEditButtonLabel = "Save";
//     }
//
//     // Кнопка Edit (открытие другого компонента)
//     const handleEditPress = () => {
//         if (onEdit) {
//             onEdit(product);
//         }
//     };
//
//     // Подпись под переключателем published
//     const publishedLabel = published ? "publish" : "hide";
//
//     return (
//         <ProductCardContainer>
//             {/* Пример отображения фото, product_id и name */}
//             <FieldRowSpecial>
//                 <ImageContainer source={{ uri: product.photo }} />
//                 <TextContainer>
//                     <FieldRowSpecial>
//                         <FieldLabelSpecial>Name:</FieldLabelSpecial>
//                         <FieldValue>{product.name}</FieldValue>
//                     </FieldRowSpecial>
//                     <FieldRowSpecial>
//                         <FieldLabelSpecial>Stock:</FieldLabelSpecial>
//                         {isQuickEdit ? (
//                             <EditableInput  isFirst={true}
//                                             value={stock.toString()}
//                                             onChangeText={(val) => setStock(val.replace(/[^0-9]/g, ""))}
//                                             keyboardType="numeric"
//                             />
//                         ) : (
//                             <FieldValue>{stock}</FieldValue>
//                         )}
//                     </FieldRowSpecial>
//                     <FieldRowSpecial>
//                         <FieldLabelSpecial>Price:</FieldLabelSpecial>
//                         {isQuickEdit ? (
//                             <EditableInput
//                                 value={price.toString()}
//                                 onChangeText={(val) => setPrice(val.replace(/[^0-9]/g, ""))}
//                                 keyboardType="numeric"
//                             />
//                         ) : (
//                             <PriceValue isStriked={promotionalPrice && promotionalPrice !== ""}>
//                                 {price}
//                             </PriceValue>
//                         )}
//                     </FieldRowSpecial>
//                 </TextContainer>
//             </FieldRowSpecial>
//
//             {/* promotional_price */}
//             {(isQuickEdit || product.promotional_price !== null) && (
//                 <FieldRow>
//                     <FieldLabel>Promotional Price:</FieldLabel>
//                     {isQuickEdit ? (
//                         <EditableInput
//                             value={promotionalPrice?.toString() || ""}
//                             onChangeText={(val) => setPromotionalPrice(val.replace(/[^0-9.]/g, ""))}
//                             keyboardType="numeric"
//                             hasError={promotionalPriceError}
//                         />
//                     ) : (
//                         <FieldValue>{promotionalPrice}</FieldValue>
//                     )}
//                 </FieldRow>
//             )}
//
//             {/* published (switch + подпись) */}
//             <FieldRow>
//                 <FieldLabel>Published:</FieldLabel>
//                 {isQuickEdit ? (
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                         <Switch
//                             value={published}
//                             onValueChange={(val) => setPublished(val)}
//                         />
//                         <Text style={{ marginLeft: 5 }}>{publishedLabel}</Text>
//                     </View>
//                 ) : (
//                     <Text>{publishedLabel}</Text>
//                 )}
//             </FieldRow>
//
//             <FieldRow>
//                 <FieldLabel>Unit:</FieldLabel>
//                 <FieldValue>{product.unit}</FieldValue>
//             </FieldRow>
//
//             {product.unit_description && (
//                 <FieldRow>
//                     <FieldLabel>Unit Description:</FieldLabel>
//                     <FieldValue>{product.unit_description}</FieldValue>
//                 </FieldRow>
//             )}
//
//             <FieldRow>
//                 <FieldLabel>Description:</FieldLabel>
//                 <FieldValue>{product.description}</FieldValue>
//             </FieldRow>
//
//             {product.additionalDetails && (
//                 <FieldRow>
//                     <FieldLabel>Additional details:</FieldLabel>
//                     <FieldValue>{product.additionalDetails}</FieldValue>
//                 </FieldRow>
//             )}
//
//             {product.category && (
//                 <FieldRow>
//                     <FieldLabel>Category:</FieldLabel>
//                     <FieldValue>{product.category}</FieldValue>
//                 </FieldRow>
//             )}
//
//             {product.subcategory && (
//                 <FieldRow>
//                     <FieldLabel>Subcategory:</FieldLabel>
//                     <FieldValue>{product.subcategory}</FieldValue>
//                 </FieldRow>
//             )}
//
//             {product.custom_category && (
//                 <FieldRow>
//                     <FieldLabel>Custom Cat:</FieldLabel>
//                     <FieldValue>{product.custom_category}</FieldValue>
//                 </FieldRow>
//             )}
//
//             {product.custom_subcategory && (
//                 <FieldRow>
//                     <FieldLabel>Custom Subcat:</FieldLabel>
//                     <FieldValue>{product.custom_subcategory}</FieldValue>
//                 </FieldRow>
//             )}
//
//             {/* Кнопки */}
//             <FieldRow style={{ justifyContent: 'space-between', marginTop: 10 }}>
//                 <Button onPress={handleEditPress}>
//                     <ButtonText>Edit</ButtonText>
//                 </Button>
//                 <Button onPress={handleQuickEditPress} disabled={promotionalPriceError}>
//                     <ButtonText>{quickEditButtonLabel}</ButtonText>
//                 </Button>
//             </FieldRow>
//         </ProductCardContainer>
//     );
// };
//
// export default WarehouseProductCard;


import React, { useState, useEffect } from 'react';
import { View, Text, Image, Switch, TouchableOpacity } from 'react-native';
import { useDispatch } from "react-redux";
import { updateProductChanges, clearProductChanges } from "../../redux/actions/productChangesActions";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProduct } from "../../redux/actions/productsAction";
import { clearNewProduct } from "../../redux/actions/newProductAction";
import { fetchCategories } from "../../services/categoryService";
import styled from 'styled-components/native';
import { showToast } from '../Shared/Notification';
import { colors } from "../../assets/styles/colors";

/* =============================
  Стили
  ============================= */

// Контейнер всей карточки
const ProductCardContainer = styled.View`
  flex-direction: column;
  padding: 10px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: #e0e0e0;
  border-radius: 10px;
  background-color: ${colors.neutral.white};
`;

// Горизонтальный ряд для отображения «лейбл: значение»
const FieldRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

const FieldRowSpecial = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 6px;
`;

const ImageContainer = styled.Image`
  width: 75px;
  height: 75px;
  margin-right: 10px;
  border-radius: 3px;
`;

const TextContainer = styled.View`
  flex: 1; /* Занимает всё оставшееся место */
`;

// «Лейбл» поля
const FieldLabel = styled.Text`
  font-weight: bold;
  width: 135px;
  color: ${colors.brown.earth};
`;

const FieldLabelSpecial = styled.Text`
  font-weight: bold;
  flex-shrink: 0;
  min-width: 50px;
  color: ${colors.brown.earth};
`;

// Стандартное отображение значения (read-only)
const FieldValue = styled.Text`
  flex: 1;
  flex-wrap: wrap;
`;

// Специальное отображение цены — если есть promotional_price, делаем красный зачёркнутый текст
const PriceValue = styled.Text`
  color: ${({ isStriked }) => (isStriked ? 'red' : '#333')};
  text-decoration-line: ${({ isStriked }) => (isStriked ? 'line-through' : 'none')};
`;

// Поле для редактирования (quick edit)
const EditableInput = styled.TextInput`
  flex: 1;
  border: 1px solid #ccc;
  padding: 1px 5px;
  color: ${({ hasError }) => (hasError ? 'red' : 'blue')};
  text-decoration-line: ${({ hasError }) => (hasError ? 'line-through' : 'none')};
  margin-bottom: ${({ isFirst }) => (isFirst ? "6px" : "0")};
`;

// Кнопка
const Button = styled(TouchableOpacity)`
  padding: 4px 10px;
  background-color: ${({ disabled }) => (disabled ? colors.neutral.gray : colors.green.grass)};
  border-radius: 8px;
  margin-right: 10px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

// Текст внутри кнопки
const ButtonText = styled(Text)`
  font-size: 15px;
  color: ${colors.neutral.white};
`;

/* =============================
  Основной компонент
  ============================= */
const WarehouseProductCard = ({ product, onEdit, onViewAsCustomer }) => {
    // Локальные стейты
    const [price, setPrice] = useState(product.price);
    const [promotionalPrice, setPromotionalPrice] = useState(
        product.promotional_price ? product.promotional_price.toString() : ""
    );
    const [stock, setStock] = useState(product.stock);
    const [published, setPublished] = useState(product.published);
    const [isQuickEdit, setIsQuickEdit] = useState(false);

    // Флаг, есть ли изменения
    const [hasChanges, setHasChanges] = useState(false);
    const [promotionalPriceError, setPromotionalPriceError] = useState(false);

    const dispatch = useDispatch();

    // Отслеживаем изменение price, promotionalPrice, stock, published
    useEffect(() => {
        const promotionalNumber = parseFloat(promotionalPrice);
        const productPromo = product.promotional_price ? parseFloat(product.promotional_price) : null;

        // Сравниваем текущие значения со значениями из product
        if (
            parseFloat(price) !== parseFloat(product.price) ||
            (promotionalPrice !== "" ? promotionalNumber : null) !== productPromo ||
            parseInt(stock, 10) !== parseInt(product.stock, 10) ||
            published !== product.published
        ) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    }, [price, promotionalPrice, stock, published, product]);

    // Валидируем promotionalPrice
    useEffect(() => {
        // Числовые значения
        const p = parseFloat(price) || 0;
        const pp = parseFloat(promotionalPrice) || 0;

        if (promotionalPrice !== "" && pp >= p) {
            setPromotionalPriceError(true);
            showToast("Promotional price should be lower than the regular price", "error");
        } else {
            setPromotionalPriceError(false);
        }
    }, [price, promotionalPrice]);

    // Обработчик нажатия на кнопку Quick Edit / Save
    const handleQuickEditPress = async () => {
        // 1) Если мы еще не в режиме редактирования
        if (!isQuickEdit) {
            // просто включаем режим Quick Edit
            setIsQuickEdit(true);
            return;
        }

        // 2) Если уже в режиме редактирования => сохраняем
        if (hasChanges) {
            // Формируем объект changes
            const changes = {
                price: parseFloat(price) !== parseFloat(product.price)
                    ? parseFloat(price)
                    : undefined,
                promotional_price: promotionalPrice !== ""
                    ? parseFloat(promotionalPrice)
                    : null, // Если пустая строка => null
                stock: parseInt(stock, 10) !== parseInt(product.stock, 10)
                    ? parseInt(stock, 10)
                    : undefined,
                published: published !== product.published
                    ? published
                    : undefined
            };

            // Обновляем Redux
            dispatch(updateProductChanges(product.product_id, changes));

            // Отправляем запрос на сервер
            try {
                const token = await AsyncStorage.getItem("authToken");
                const response = await axios.put(
                    `https://marketplace-usa-backend-1.onrender.com/api/products/update-product/${product.product_id}`,
                    changes,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    showToast("Changes saved successfully!", "success");
                    console.log(response.data.product);
                    dispatch(updateProduct(response.data.product));
                    dispatch(clearProductChanges());
                } else {
                    showToast("Error while saving", "error");
                }
            } catch (error) {
                console.log("SAVE ERROR", error);
                showToast("Connection error", "error");
            }
        }

        // Выходим из режима редактирования (даже если не было изменений)
        setIsQuickEdit(false);
    };

    // Текст для кнопки
    let quickEditButtonLabel = "Quick Edit";
    if (isQuickEdit && hasChanges) {
        quickEditButtonLabel = "Save";
    } else if (isQuickEdit && !hasChanges) {
        // Когда уже в режиме редактирования, но изменений нет
        quickEditButtonLabel = "Quick Edit";
    }

    // Кнопка Edit (открытие полного экрана или чего-то ещё)
    const handleEditPress = async () => {
        await fetchCategories(dispatch);
        dispatch(clearNewProduct());
        if (onEdit) {
            onEdit(product, true);
        }
    };

    const handleViewPress = () => {
        if (onViewAsCustomer) {
            onViewAsCustomer(product);
        }
    };

    // Подпись под переключателем published
    const publishedLabel = published ? "publish" : "hide";

    return (
        <ProductCardContainer>
            {/* Верхняя часть (фото + Name + Stock + Price) */}
            <FieldRowSpecial>
                <ImageContainer source={{ uri: product.photo }} />
                <TextContainer>
                    <FieldRowSpecial>
                        <FieldLabelSpecial>Name:</FieldLabelSpecial>
                        <FieldValue>{product.name}</FieldValue>
                    </FieldRowSpecial>

                    <FieldRowSpecial>
                        <FieldLabelSpecial>Stock:</FieldLabelSpecial>
                        {isQuickEdit ? (
                            <EditableInput
                                isFirst={true}
                                value={stock.toString()}
                                // onChangeText={(val) =>
                                //     setStock(val.replace(/[^0-9]/g, ""))
                                // }
                                onChangeText={(val) => {
                                    const cleanedVal = val.replace(/[^0-9]/g, "");
                                    setStock(cleanedVal === "" ? 0 : parseInt(cleanedVal, 10));
                                }}
                                keyboardType="numeric"
                            />
                        ) : (
                            <FieldValue>{stock}</FieldValue>
                        )}
                    </FieldRowSpecial>

                    <FieldRowSpecial>
                        <FieldLabelSpecial>Price:</FieldLabelSpecial>
                        {isQuickEdit ? (
                            <EditableInput
                                value={price.toString()}
                                onChangeText={(val) =>
                                    setPrice(val.replace(/[^0-9.]/g, ""))
                                }
                                keyboardType="numeric"
                            />
                        ) : (
                            <PriceValue
                                isStriked={product.promotional_price && product.promotional_price !== null}
                            >
                                {price}
                            </PriceValue>
                        )}
                    </FieldRowSpecial>
                </TextContainer>
            </FieldRowSpecial>

            {/* promotional_price */}
            {(isQuickEdit || product.promotional_price !== null) && (
                <FieldRow>
                    <FieldLabel>Promotional Price:</FieldLabel>
                    {isQuickEdit ? (
                        <EditableInput
                            value={promotionalPrice.toString()}
                            onChangeText={(val) =>
                                setPromotionalPrice(val.replace(/[^0-9.]/g, ""))
                            }
                            keyboardType="numeric"
                            hasError={promotionalPriceError}
                        />
                    ) : (
                        <FieldValue>{product.promotional_price}</FieldValue>
                    )}
                </FieldRow>
            )}

            {/* published */}
            <FieldRow>
                <FieldLabel>Published:</FieldLabel>
                {isQuickEdit ? (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Switch
                            value={published}
                            onValueChange={(val) => setPublished(val)}
                        />
                        <Text style={{ marginLeft: 5 }}>{publishedLabel}</Text>
                    </View>
                ) : (
                    <Text>{publishedLabel}</Text>
                )}
            </FieldRow>

            <FieldRow>
                <FieldLabel>Unit:</FieldLabel>
                <FieldValue>{product.unit}</FieldValue>
            </FieldRow>

            {product.unit_description && (
                <FieldRow>
                    <FieldLabel>Unit Description:</FieldLabel>
                    <FieldValue>{product.unit_description}</FieldValue>
                </FieldRow>
            )}

            <FieldRow>
                <FieldLabel>Description:</FieldLabel>
                <FieldValue>{product.description}</FieldValue>
            </FieldRow>

            {product.additionalDetails && (
                <FieldRow>
                    <FieldLabel>Additional details:</FieldLabel>
                    <FieldValue>{product.additionalDetails}</FieldValue>
                </FieldRow>
            )}

            {product.category && (
                <FieldRow>
                    <FieldLabel>Category:</FieldLabel>
                    <FieldValue>{product.category}</FieldValue>
                </FieldRow>
            )}

            {product.subcategory && (
                <FieldRow>
                    <FieldLabel>Subcategory:</FieldLabel>
                    <FieldValue>{product.subcategory}</FieldValue>
                </FieldRow>
            )}

            {product.custom_category && (
                <FieldRow>
                    <FieldLabel>Custom Cat:</FieldLabel>
                    <FieldValue>{product.custom_category}</FieldValue>
                </FieldRow>
            )}

            {product.custom_subcategory && (
                <FieldRow>
                    <FieldLabel>Custom Subcat:</FieldLabel>
                    <FieldValue>{product.custom_subcategory}</FieldValue>
                </FieldRow>
            )}

            {/* Кнопки внизу */}
            <FieldRow style={{ justifyContent: "space-between", marginTop: 10 }}>
                <Button onPress={handleEditPress}>
                    <ButtonText>Edit</ButtonText>
                </Button>
                {/*<Button onPress={handleViewPress}>*/}
                {/*    <ButtonText>View</ButtonText>*/}
                {/*</Button>*/}
                <Button onPress={handleQuickEditPress} disabled={promotionalPriceError}>
                    <ButtonText>{quickEditButtonLabel}</ButtonText>
                </Button>
            </FieldRow>
        </ProductCardContainer>
    );
};

export default WarehouseProductCard;

