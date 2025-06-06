import React, { useState, useEffect } from 'react';
import { Modal, View, FlatList, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const PhotoItem = styled.View`
  margin-bottom: 20px;
  align-items: center;
`;

const PhotoImage = styled.Image`
  width: 300px;
  height: 225px; // для соответствия соотношения сторон фото
  border-radius: 8px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const IconButton = styled.TouchableOpacity`
  margin: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px;
  border-radius: 5px;
`;

export default function CommunityPhotoModalEditor({ visible, specEdit, searchId, photos, delPhoto, onClose, onSave }) {
    const route = useRoute();
    const dispatch = useDispatch();
    // Локальное состояние для редактирования фотографий
    const [localPhotos, setLocalPhotos] = useState(photos);
    const [photosToDel, setPhotosToDel] = useState([]);
    const [pathPhotoToDel, setPathPhotoToDel] = useState(delPhoto);

    const productsArr = useSelector(state => state.community.items);

    console.log('specEdit', specEdit);
    console.log('photosToDel', photosToDel);
    console.log('pathPhotoToDel', pathPhotoToDel);

    // Вспомогательная функция: обрезает .jpg_mobile.webp / .jpg_desktop.webp / .jpg_mobile.jpg / .jpg_desktop.jpg
    function getBasePath(fullKey) {
        // Регулярка ищет:
        // 1) .jpg_mobile.что-угодно
        // 2) .jpg_desktop.что-угодно
        // в самом конце строки
        return fullKey.replace(/(\.jpg_mobile\.\w+|\.jpg_desktop\.\w+)$/, "");
    }

    // Обновляем локальное состояние, если входные photos изменились
    useEffect(() => {
        setLocalPhotos(photos);
    }, [photos]);

    // Метод вычисляет url фото с внешнего хранилища и при удалении записывает в массив на удаление
    const handleDeletePhoto = (index) => {
        const updatedPhotos = [...localPhotos];
        const photoToDelete = updatedPhotos[index];

        // Если режим редактирования включен и это фото с S3
        if (specEdit && photoToDelete.startsWith("https://marketplaceusabucket.s3")) {
            // 1) Добавляем URL в photosToDel
            setPhotosToDel((prev) => [...prev, photoToDelete]);

            // 2) Ищем product с нужным product_id
            const productItem = productsArr.find(
                (item) => item.product_id === searchId
            );

            if (productItem && Array.isArray(productItem.images)) {
                // 3) Ищем объект с url === photoToDelete
                const foundImg = productItem.images.find(
                    (img) => img.url === photoToDelete
                );

                if (foundImg && foundImg.key) {
                    // 4) Обрезаем «хвост», получая базовый путь
                    const basePath = getBasePath(foundImg.key);

                    // 5) Находим все ключи, у которых та же база
                    const matchingKeys = productItem.images
                        .filter((img) => getBasePath(img.key) === basePath)
                        .map((img) => img.key);

                    // 6) Сохраняем их в pathPhotoToDel
                    setPathPhotoToDel((prev) => [...prev, ...matchingKeys]);
                }
            }
        }

        // Удаляем фото из локального массива
        updatedPhotos.splice(index, 1);
        setLocalPhotos(updatedPhotos);
    };

    const handleSetFirstPhoto = (index) => {
        const updatedPhotos = [...localPhotos];
        const [selectedPhoto] = updatedPhotos.splice(index, 1); // Удаляем фото из текущей позиции
        updatedPhotos.unshift(selectedPhoto); // Добавляем его в начало
        setLocalPhotos(updatedPhotos, photosToDel);
    };

    const handleSave = () => {
        onSave(localPhotos, pathPhotoToDel); // Сохраняем изменения и закрываем модалку
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <ModalContainer>
                <CloseButton onPress={onClose}>
                    <Icon name="close" size={40} color="white" />
                </CloseButton>

                <FlatList
                    data={localPhotos}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <PhotoItem>
                            <PhotoImage source={{ uri: item }} />
                            <ButtonsContainer>
                                <IconButton onPress={() => handleDeletePhoto(index)}>
                                    <Icon name="delete" size={30} color="red" />
                                </IconButton>
                                <IconButton onPress={() => handleSetFirstPhoto(index)}>
                                    <Icon name="first-page" size={30} color="green" />
                                </IconButton>
                            </ButtonsContainer>
                        </PhotoItem>
                    )}
                />

                {/* Кнопка сохранения */}
                <IconButton onPress={handleSave}>
                    <Icon name="save" size={30} color="green" />
                </IconButton>
            </ModalContainer>
        </Modal>
    );
}