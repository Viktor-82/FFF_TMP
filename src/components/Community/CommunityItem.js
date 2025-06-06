import React, { useState, useEffect } from 'react';
import { View, Text, Image, Switch, TouchableOpacity } from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import { updateCommunityChanges, clearCommunityChanges } from "../../redux/actions/communityChangesActions";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateItem } from "../../redux/actions/communityActions";
// import { clearNewProduct } from "../../redux/actions/newProductAction";
// import { fetchCategories } from "../../services/categoryService";
import styled from 'styled-components/native';
import { showToast } from '../Shared/Notification';
import { colors } from "../../assets/styles/colors";

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
  width: 130px;
  color: ${colors.brown.earth};
`;

const FieldLabelSpecial = styled.Text`
  font-weight: bold;
  width: 45px;
  color: ${colors.brown.earth};
`;

// Стандартное отображение значения (read-only)
const FieldValue = styled.Text`
  flex: 1;
  flex-wrap: wrap;
`;

// Поле для редактирования (quick edit)
const EditableInput = styled.TextInput`
  flex: 1;
  border: 1px solid #ccc;
  padding: 1px 5px;
  color: blue;
  margin-bottom: 6px;
  //height: 60px;
  height: auto;
  text-align-vertical: top;
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
const CommunityItem = ({ item, onEdit, onViewAsCustomer }) => {
    // Локальные стейты
    const [description, setDescription] = useState(item.description);
    const [published, setPublished] = useState(item.published);
    const [isQuickEdit, setIsQuickEdit] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const dispatch = useDispatch();

    const addresses = useSelector((state) => state.addresses?.list || []);
    const activeAddress = addresses.find((item) => item.isActive === true);
    const farmId = activeAddress?.farmId;

    const image = item.images.find(img => img.key.endsWith('jpg_mobile.jpg'));
    const imageUrl = image?.url || null; // null если не найдено

    // Отслеживаем изменение description и published
    useEffect(() => {
        if (
            description !== (item.description || '') ||
            published !== item.published
        ) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    }, [description, published, item]);

    // Обработчик нажатия на кнопку Quick Edit / Save
    const handleQuickEditPress = async () => {
        // 1) Если мы еще не в режиме редактирования
        if (!isQuickEdit) {
            setIsQuickEdit(true);
            return;
        }

        // 2) Если уже в режиме редактирования => сохраняем
        if (hasChanges) {
            // Формируем объект changes
            const changes = {
                description: description !== (item.description || '')
                    ? description
                    : undefined,
                published: published !== item.published
                    ? published
                    : undefined,
            };
            const info = {
                type: item.type,
                _id: item._id,
            };

            const dataToSend = {
                ...changes, ...info
            };

            console.log('dataToSend', dataToSend);

            // Обновляем Redux
            dispatch(updateCommunityChanges(item._id, changes));

            // Отправляем запрос на сервер
            try {
                const token = await AsyncStorage.getItem("authToken");
                const response = await axios.put(
                    `https://marketplace-usa-backend-1.onrender.com/api/farmers/full-update-community-info/${farmId}`,
                    dataToSend,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    console.log('communityItemResponse', response.data)
                    showToast("Changes saved successfully!", "success");
                    dispatch(updateItem(response.data.data.type, response.data.data));
                    dispatch(clearCommunityChanges());
                } else {
                    showToast("Error while saving", "error");
                }
            } catch (error) {
                console.log("SAVE ERROR", error);
                showToast("Connection error", "error");
            }
        }

        // Выходим из режима редактирования
        setIsQuickEdit(false);
    };

    // Текст для кнопки
    let quickEditButtonLabel = "Quick Edit";
    if (isQuickEdit && hasChanges) {
        quickEditButtonLabel = "Save";
    } else if (isQuickEdit && !hasChanges) {
        quickEditButtonLabel = "Quick Edit";
    }

    // // Кнопка Edit
    // const handleEditPress = async () => {
    //     await fetchCategories(dispatch);
    //     dispatch(clearNewProduct());
    //     if (onEdit) {
    //         onEdit(item, true);
    //     }
    // };

    // const handleViewPress = () => {
    //     if (onViewAsCustomer) {
    //         onViewAsCustomer(item);
    //     }
    // };

    // Подпись под переключателем published
    const publishedLabel = published ? "publish" : "hide";

    return (
        <ProductCardContainer>
            {/* Верхняя часть (фото + Title) */}
            <FieldRowSpecial>
                {/*<ImageContainer source={{ uri: item.images }} />*/}
                <ImageContainer source={{uri: imageUrl}} />
                <TextContainer>
                    <FieldRowSpecial>
                        <FieldLabelSpecial>Title:</FieldLabelSpecial>
                        <FieldValue>{item.title}</FieldValue>
                    </FieldRowSpecial>
                </TextContainer>
            </FieldRowSpecial>

            {/* description */}
            <FieldRow>
                <FieldLabel>Description:</FieldLabel>
                {isQuickEdit ? (
                    <EditableInput
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                ) : (
                    <FieldValue>{description}</FieldValue>
                )}
            </FieldRow>

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

            {/* Кнопки внизу */}
            <FieldRow style={{ justifyContent: "flex-end", marginTop: 10 }}>
                {/*<Button onPress={handleEditPress}>*/}
                {/*    <ButtonText>Edit</ButtonText>*/}
                {/*</Button>*/}
                <Button onPress={handleQuickEditPress}>
                    <ButtonText>{quickEditButtonLabel}</ButtonText>
                </Button>
            </FieldRow>
        </ProductCardContainer>
    );
};

export default CommunityItem;