import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import styled from 'styled-components/native';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCommunityAddInfo, addCommunityAddPhoto } from '../../redux/actions/communityAddInfoActions';
import { colors } from "../../assets/styles/colors";
import { showToast } from '../Shared/Notification';
import CommunityPhotoModalEditor from '../Community/CommunityPhotoModalEditor';
import { Platform } from 'react-native';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${colors.neutral.white};
  padding: 20px;
`;

// Стили для заголовка
const Header = styled(Text)`
  margin: 15px 0; /* 1.5625rem = 25px */
  font-size: 24px; /* 1.5rem = 24px */
  font-weight: bold;
`;

const FieldRow = styled.View`
  margin-bottom: 15px;
`;

const FieldLabel = styled.Text`
  font-weight: bold;
  margin-bottom: 5px;
  color: ${colors.brown.earth};
`;

const FieldInput = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  background-color: ${colors.neutral.white};
  font-size: 16px;
`;

const DescriptionInput = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  background-color: ${colors.neutral.white};
  font-size: 16px;
  height: 150px;
  text-align-vertical: top;
`;

const PhotoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const PhotoPlaceholder = styled.View`
  width: 80px;
  height: 80px;
  background-color: #ccc;
  border-radius: 8px;
  margin-right: 15px;
  justify-content: center;
  align-items: center;
`;

const PhotoImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 15px;
`;

const IconButton = styled.TouchableOpacity`
  margin-right: 10px;
  align-items: center;
`;

const IconLabel = styled.Text`
  font-size: 12px;
  color: ${colors.brown.earth};
`;

const SwitchRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 40px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${colors.green.grass};
  padding: 12px 25px;
  border-radius: 8px;
`;

const ActionButtonText = styled.Text`
  color: ${colors.neutral.white};
  font-size: 16px;
`;

const IconField = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
  justify-content: space-around;
`;

const BottomBlock = styled.View`
  height: 110px;
`;

export default function CommunityAddInfo() {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const storedType = useSelector(state => state.communityAddInfo.type);
    const storedProduct = useSelector(state => state.communityAddInfo) || {};
    const storedPhotos = useSelector(state => state.communityAddInfo.photo) || [];
    // const { flag, type } = route.params;
    const type = route.params?.type || storedType;
    const productData = route.params?.items || storedProduct;
    // const editable = flag ? flag : useSelector(state => state.communityAddInfo.editable);
    // const { product_id, images = [], name = "", description = "", published = false } = productData;
    const { item_id, images = [], title = "", description = "", published = false } = productData;

    const [localPhoto, setLocalPhoto] = useState([]);
    const [pathPhotoToDel, setPathPhotoToDel] = useState([]);
    const [localTitle, setLocalTitle] = useState(title);
    const [localDescription, setLocalDescription] = useState(description);
    const [localPublished, setLocalPublished] = useState(published);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Получаем farmId
    const addresses = useSelector((state) => state.addresses.list);
    const activeFarm = addresses.find(address => address.isActive === true);
    const farmId = activeFarm ? activeFarm.farmId : null;

    console.log('type', type);

    // Синхронизация фотографий
    useEffect(() => {
        if (images && images.length > 0) {
            const photo = images
                .filter(item => item.key.endsWith('jpg_mobile.jpg'))
                .map(item => item.url);
            setLocalPhoto(photo);
            photo.forEach(url => {
                dispatch(addCommunityAddPhoto(url));
            });
        }
    }, [images]);

    useEffect(() => {
        if (storedPhotos && storedPhotos.length > 0) {
            setLocalPhoto(storedPhotos);
        }
    }, [storedPhotos]);

    let dataToSend = null;

    // Функция сохранения в Redux
    const saveToRedux = () => {
        dataToSend = {
            photo: localPhoto,
            title: localTitle,
            description: localDescription,
            farm_id: farmId,
            published: localPublished,
            img_to_delete: pathPhotoToDel,
            // editable,
        };
        dispatch(setCommunityAddInfo({
            item_id,
            photo: localPhoto,
            title: localTitle,
            description: localDescription,
            farm_id: farmId,
            published: localPublished,
            img_to_delete: pathPhotoToDel,
            // editable,
            type,
        }));
        // showToast("Info saved", "success");
    };

    const handleSave = async () => {
        saveToRedux();

        const formData = new FormData();
        if (localPhoto) {
            const photos = Array.isArray(localPhoto) ? localPhoto : [localPhoto];
            photos.forEach((photo, index) => {
                let uri = photo;
                if (!uri) return;
                if (Platform.OS === 'android' && uri && !uri.startsWith('file://')) {
                    uri = 'file://' + uri;
                }
                formData.append('files', {
                    uri,
                    type: 'image/jpeg',
                    name: `${localTitle}_${index}.jpg`,
                });
            });
        }

        formData.append('title', localTitle || '');
        formData.append('description', localDescription || '');
        formData.append('farm_id', farmId || '');
        formData.append('published', localPublished !== undefined ? localPublished : false);
        formData.append('img_to_delete', JSON.stringify(pathPhotoToDel) || '');
        // formData.append('editable', editable ? editable : false);
        formData.append('type', storedType || type);

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                showToast('Токен отсутствует, авторизуйтесь', 'error');
                return;
            }

            // const url = editable
            //     ? `https://marketplace-usa-backend-1.onrender.com/api/farmers/full-update-community-info/${farmId}`
            //     : `https://marketplace-usa-backend-1.onrender.com/api/farmers/add-community-info/${farmId}`;

            const url = `https://marketplace-usa-backend-1.onrender.com/api/farmers/add-community-info/${farmId}`;

            const response = await fetch(url, {
                // method: editable ? 'PUT' : 'POST',
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Server error: ${response.status}`);
            }

            // showToast('Data uploaded successfully', 'success');
        } catch (err) {
            console.error('Save error:', err.message);
            showToast('Loading error', 'error');
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", () => {
            saveToRedux();
        });
        return unsubscribe;
    }, [navigation, localPhoto, localTitle, localDescription, localPublished]);

    const handleUploadPhoto = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 800,
                height: 600,
                cropping: true,
                compressImageQuality: 0.8,
            });
            if (localPhoto.length < 5) {
                setLocalPhoto([...localPhoto, image.path]);
                dispatch(addCommunityAddPhoto(image.path));
            } else {
                showToast("Maximum 5 photos", "info");
            }
        } catch (error) {
            console.error("Upload photo error:", error);
        }
    };

    // const handleOpenModal = () => {
    //     setIsModalVisible(true);
    // };
    //
    // const handleCloseModal = () => {
    //     setIsModalVisible(false);
    // };

    const handleMakePhoto = () => {
        navigation.goBack();
        navigation.navigate('CommunityCamera');
    };

    // const handleViewAsCustomer = () => {
    //     saveToRedux();
    //     navigation.navigate('SearchResults', dataToSend);
    // };

    return (
        <Container>
            <Header>{type.charAt(0).toUpperCase() + type.slice(1)}</Header>
            {/* product_id */}
            {item_id ? (
                <FieldRow>
                    <FieldLabel>Item ID:</FieldLabel>
                    <FieldInput
                        value={item_id.toString()}
                        editable={false}
                        style={{ backgroundColor: '#f0f0f0', color: '#777' }}
                    />
                </FieldRow>
            ) : null}

            {/* Фото */}
            <FieldLabel>Photo:</FieldLabel>
            <PhotoContainer>
                {localPhoto.length > 0 ? (
                    <PhotoImage source={{ uri: localPhoto[0] }} />
                ) : (
                    <PhotoPlaceholder>
                        <Text>No photo</Text>
                    </PhotoPlaceholder>
                )}
                {localPhoto.length > 1 && (
                    <View style={{ alignItems: 'center', marginTop: 5 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.brown.earth }}>Quantity</Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: localPhoto.length === 5 ? 'red' : 'green' }}>
                            {localPhoto.length}
                        </Text>
                    </View>
                )}
                <View>
                    <IconField>
                        <IconButton onPress={handleMakePhoto} disabled={localPhoto.length >= 5}>
                            <Icon name="add-a-photo" size={50} color={localPhoto.length >= 5 ? "#ccc" : colors.green.grass} />
                            <IconLabel>Make photo</IconLabel>
                        </IconButton>
                        <IconButton onPress={handleUploadPhoto} disabled={localPhoto.length >= 5}>
                            <Icon name="upload-file" size={50} color={localPhoto.length >= 5 ? "#ccc" : colors.green.grass} />
                            <IconLabel>Upload</IconLabel>
                        </IconButton>
                        {/*{localPhoto.length > 1 && (*/}
                        {/*    <IconButton onPress={handleOpenModal}>*/}
                        {/*        <Icon name="open-in-new" size={50} color={colors.green.grass} />*/}
                        {/*        <IconLabel>Browse|Edit</IconLabel>*/}
                        {/*    </IconButton>*/}
                        {/*)}*/}
                    </IconField>
                </View>
            </PhotoContainer>

            {/* title */}
            <FieldRow>
                <FieldLabel>Title:</FieldLabel>
                <FieldInput
                    value={localTitle}
                    onChangeText={setLocalTitle}
                />
            </FieldRow>

            {/* description */}
            <FieldRow>
                <FieldLabel>Description:</FieldLabel>
                <DescriptionInput
                    value={localDescription}
                    onChangeText={setLocalDescription}
                    multiline
                />
            </FieldRow>

            {/* published (switch) */}
            <FieldRow>
                <FieldLabel>Published:</FieldLabel>
                <SwitchRow>
                    <Text style={{ marginRight: 20 }}>hide</Text>
                    <Switch
                        value={localPublished}
                        onValueChange={(val) => setLocalPublished(val)}
                        style={{ transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }] }}
                    />
                    <Text style={{ marginLeft: 20 }}>publish</Text>
                </SwitchRow>
            </FieldRow>

            {/* Кнопки */}
            <ButtonRow>
                <ActionButton onPress={handleSave}>
                    <ActionButtonText>Save {type}</ActionButtonText>
                </ActionButton>
                {/*<ActionButton onPress={handleViewAsCustomer}>*/}
                {/*    <ActionButtonText>View as customer</ActionButtonText>*/}
                {/*</ActionButton>*/}
            </ButtonRow>

            <BottomBlock />

            {/* Модальное окно */}
            {/*<CommunityPhotoModalEditor*/}
            {/*    visible={isModalVisible}*/}
            {/*    photos={localPhoto}*/}
            {/*    delPhoto={pathPhotoToDel}*/}
            {/*    specEdit={editable}*/}
            {/*    searchId={item_id}*/}
            {/*    onClose={handleCloseModal}*/}
            {/*    onSave={(updatedPhotos, delPhoto) => {*/}
            {/*        setLocalPhoto(updatedPhotos);*/}
            {/*        setPathPhotoToDel(delPhoto);*/}
            {/*        dispatch(setCommunityAddInfo({*/}
            {/*            photo: updatedPhotos,*/}
            {/*            img_to_delete: delPhoto,*/}
            {/*        }));*/}
            {/*        setIsModalVisible(false);*/}
            {/*    }}*/}
            {/*/>*/}
        </Container>
    );
}