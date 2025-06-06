import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import styled from 'styled-components/native';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setNewProduct, addPhoto, delImg } from '../../redux/actions/newProductAction';
import { updateProductChanges, clearProductChanges } from "../../redux/actions/productChangesActions";
import { colors } from "../../assets/styles/colors";
import { showToast } from '../Shared/Notification';
import { Picker } from '@react-native-picker/picker';
// import { addPhoto, delImg } from "../../redux/actions/newProductAction";
import PhotoModalEditor from './PhotoModalEditor'
import { Platform } from 'react-native';
import WarehouseProductCard from "./WarehouseProductCard";

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${colors.neutral.white};
  padding: 20px;
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
  //color: ${colors.brown.earth};
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
  justify-content: space-between;
  margin-top: 20px;
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

export default function EditableWarehouseProductCard() {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const storedProduct = useSelector(state => state.newProduct) || {};
    const storedPhotos = useSelector(state => state.newProduct.photo) || [];
    const { flag } = route.params;
    // const flag = route.params?.flag;
    const productData = route.params?.product || storedProduct;
    const editable = flag ? flag : useSelector(state => state.newProduct.editable)
    const productsList = useSelector(state => state.products.items);
    console.log('editable', editable);
    const {
        product_id,
        images = [],
        name = "",
        unit_description = "",
        price = "",
        promotional_price = "",
        stock = "",
        category = "",
        subcategory = "",
        unit = "",
        farm_id = "",
        custom_category = "",
        custom_subcategory = "",
        description = "",
        published = false,
        img_to_delete = [],
    } = productData;

    console.log('cat subcat', category, subcategory);

    const photo = [];
    const [localPhoto, setLocalPhoto] = useState(photo);
    const [photoToDel, setPhotoToDel] = useState([]);
    const [pathPhotoToDel, setPathPhotoToDel] = useState([]);
    const [localName, setLocalName] = useState(name);
    const [localUnitDescription, setLocalUnitDescription] = useState(unit_description);
    const [localPrice, setLocalPrice] = useState(price ? price.toString() : "");
    const [localPromotionalPrice, setLocalPromotionalPrice] = useState(promotional_price ? promotional_price.toString() : "");
    const [localStock, setLocalStock] = useState(stock ? stock.toString() : "");
    const [localCategory, setLocalCategory] = useState('');
    const [localSubcategory, setLocalSubcategory] = useState('');
    const [localUnit, setLocalUnit] = useState(unit);
    // const [localFarmId, setLocalFarmId] = useState(farmId);
    const [localCustomCategory, setLocalCustomCategory] = useState(custom_category);
    const [localCustomSubcategory, setLocalCustomSubcategory] = useState(custom_subcategory);
    const [localDescription, setLocalDescription] = useState(description);
    const [localAddDetails, setLocalAddDetails] = useState('');
    const [localPublished, setLocalPublished] = useState(published);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [localCategoryName, setLocalCategoryName] = useState('');
    const [localSubcategoryName, setLocalSubcategoryName] = useState('');

    console.log('localPhoto', localPhoto);

    // Redux: категории и субкатегории
    const categories = useSelector((state) => state.categories.categoriesList);
    const subcategoriesAll = useSelector((state) => state.categories.subcategoriesList);
    const currentSubcatList = localCategory ? subcategoriesAll[localCategory] || [] : [];

    // Получаем farmId
    const addresses = useSelector((state) => state.addresses.list);
    const activeFarm = addresses.find(address => address.isActive === true);
    const farmId = activeFarm ? activeFarm.farmId : null;

    // Вызываем эффект только когда изменится массив images
    useEffect(() => {
        if (images && images.length > 0) {
            console.log('call useEffect from Editable');
            const photo = images
                .filter(item => item.key.endsWith('jpg_mobile.jpg'))
                .map(item => item.url);
            setLocalPhoto(photo);
            photo.forEach(url => {
                dispatch(addPhoto(url));
            });
        }
        console.log('localPhoto', localPhoto);
    }, [images]);

    console.log('photo from Editable', photo);
    console.log('localPhoto from Editable', localPhoto);

    // Синхронизация localPhoto с storedPhotos
    useEffect(() => {
        if (storedPhotos && storedPhotos.length > 0) {
            setLocalPhoto(storedPhotos);
            console.log('storedPhotos', storedPhotos);
        }
    }, [storedPhotos]);

    let dataToSend = null;
    // Массив на удаление фото из S3
    const imgToDelete = [];

    // Функция сохранения в Redux
    const saveToRedux = () => {
        dataToSend = {
            photo: localPhoto,
            name: localName,
            unit_description: localUnitDescription,
            price: localPrice,
            promotional_price: localPromotionalPrice,
            stock: localStock,
            category: localCategory,
            subcategory: localSubcategory,
            unit: localUnit,
            // farm_id: localFarmId,
            farm_id: farmId,
            custom_category: localCustomCategory,
            custom_subcategory: localCustomSubcategory,
            description: localDescription,
            add_details: localAddDetails,
            published: localPublished,
            img_to_delete: pathPhotoToDel,
            editable,
        };
        dispatch(setNewProduct({
            product_id,
            photo: localPhoto,
            name: localName,
            unit_description: localUnitDescription,
            price: localPrice,
            promotional_price: localPromotionalPrice,
            stock: localStock,
            category: localCategory,
            subcategory: localSubcategory,
            category_name: localCategoryName,
            subcategory_name: localSubcategoryName,
            unit: localUnit,
            // farm_id: localFarmId,
            farm_id: farmId,
            custom_category: localCustomCategory,
            custom_subcategory: localCustomSubcategory,
            description: localDescription,
            add_details: localAddDetails,
            published: localPublished,
            img_to_delete: pathPhotoToDel,
            editable,
        }));
        showToast("New product data saved", "success");
    };

    function getBasePath(fullKey) {
        // Регулярка убирает из конца:
        // 1) .jpg_mobile.webp
        // 2) .jpg_desktop.webp
        // 3) .jpg_mobile.jpg
        // 4) .jpg_desktop.jpg
        return fullKey.replace(/(\.jpg_mobile\.\w+|\.jpg_desktop\.\w+)$/, "");
    }

    const handleSave = async () => {
        saveToRedux();

        function getBasePath(fullKey) {
            // Убирает суффиксы типа .jpg_mobile.webp, .jpg_desktop.webp, .jpg_mobile.jpg, .jpg_desktop.jpg
            return fullKey.replace(/(\.jpg_mobile\.\w+|\.jpg_desktop\.\w+)$/, "");
        }
        function extractNamePart(fullPath) {
            // Ищет подстроку вида "Salmon_fillet_<цифра>" в конце строки
            // const match = fullPath.match(/Salmon_fillet_\d+$/);
            const match = fullPath.match(/([A-Za-z0-9]+_\d+)$/);
            return match ? match[0] : null;
        }
        function extractIndexFromBasePath(namePart) {
            // Из "Salmon_fillet_0" извлекает 0 (как число)
            const match = namePart.match(/_(\d+)$/);
            return match ? Number(match[1]) : null;
        }

// === Блок if (editable) { ... } ===
        if (editable) {
            // 1. Создаём массив свободных индексов [0,1,2,..., localPhoto.length-1]
            const freeIndices = Array.from({ length: localPhoto.length }, (_, i) => i);
            const occupiedIndices = [];
            const productItem = productsList.find(p => p.product_id === product_id);

            // 2. Собираем занятые индексы из S3-путей
            for (let i = 0; i < localPhoto.length; i++) {
                const url = localPhoto[i];
                if (url.startsWith("https://marketplaceusabucket.s3") && productItem && productItem.images) {
                    const foundImg = productItem.images.find(img => img.url === url);
                    if (foundImg && foundImg.key) {
                        const bp = getBasePath(foundImg.key); // например, "documents/.../Salmon_fillet_0"
                        const namePart = extractNamePart(bp);   // "Salmon_fillet_0"
                        if (namePart) {
                            const idx = extractIndexFromBasePath(namePart);
                            if (idx !== null) {
                                occupiedIndices.push(idx);
                            }
                        }
                    }
                }
            }
            // Удаляем занятые индексы из freeIndices
            occupiedIndices.forEach(num => {
                const pos = freeIndices.indexOf(num);
                if (pos !== -1) {
                    freeIndices.splice(pos, 1);
                }
            });
            console.log("occupiedIndices:", occupiedIndices);
            console.log("freeIndices после удаления:", freeIndices);

            // 3. Формируем итоговый массив объектов (в порядке localPhoto)
            const finalPhotoArr = [];
            const baseName = localName.trim().replace(/\s+/g, "_") || "NoName";

            for (let i = 0; i < localPhoto.length; i++) {
                const url = localPhoto[i];
                if (url.startsWith("https://marketplaceusabucket.s3") && productItem && productItem.images) {
                    const foundImg = productItem.images.find(img => img.url === url);
                    if (!foundImg || !foundImg.key) {
                        finalPhotoArr.push({ name: baseName + "_???", data: {} });
                        continue;
                    }
                    const bp = getBasePath(foundImg.key);
                    const namePart = extractNamePart(bp); // Например, "Salmon_fillet_0"
                    if (!namePart) {
                        finalPhotoArr.push({ name: baseName + "_???", data: {} });
                        continue;
                    }
                    // Собираем все ключи с тем же basePath
                    const matchingKeys = productItem.images
                        .filter(img => getBasePath(img.key) === bp)
                        .map(img => img.key);
                    // Преобразуем массив ключей в объект: {0: key0, 1: key1, ...}
                    const dataObj = {};
                    matchingKeys.forEach((k, idx2) => {
                        dataObj[idx2] = k;
                    });
                    finalPhotoArr.push({ name: namePart, data: dataObj });
                } else {
                    // Локальный файл
                    if (freeIndices.length === 0) {
                        finalPhotoArr.push({ name: baseName + "_???", data: { 0: url } });
                    } else {
                        const usedIndex = freeIndices.shift();
                        finalPhotoArr.push({ name: baseName + "_" + usedIndex, data: { 0: url } });
                    }
                }
            }

            console.log("finalPhotoArr:", finalPhotoArr);

            // 4. Сохраняем результат в Redux
            dispatch(setNewProduct({
                mix_photo_arr: finalPhotoArr,
            }));

            // 5. Формируем formData для локальных файлов
            const formData = new FormData();
            finalPhotoArr.forEach((obj) => {
                // Если объект относится к локальному файлу – data содержит один URL
                const dataValues = Object.values(obj.data);
                if (dataValues.length === 1 && String(dataValues[0]).startsWith("file://")) {
                    let uri = dataValues[0];
                    if (Platform.OS === 'android' && uri && !uri.startsWith('file://')) {
                        uri = 'file://' + uri;
                    }
                    // Из объекта можно получить используемый индекс, если он был добавлен в name
                    // Например, если name === "Salmon_fillet_1", то индекс – 1
                    const usedIndexMatch = obj.name.match(/_(\d+)$/);
                    const usedIndex = usedIndexMatch ? usedIndexMatch[1] : 0;
                    formData.append('files', {
                        uri,
                        type: 'image/jpeg',
                        name: `${baseName}_${usedIndex}.jpg`,
                    });
                }
            });

            // Остальные поля
            formData.append('name', localName || '');
            formData.append('unit_description', localUnitDescription || '');
            formData.append('price', localPrice !== undefined ? Number(localPrice) : '');
            formData.append('promotional_price', localPromotionalPrice !== undefined ? Number(localPromotionalPrice) : '');
            formData.append('stock', localStock !== undefined ? Number(localStock) : '');
            formData.append('category', localCategoryName || '');
            formData.append('subcategory', localSubcategoryName || '');
            formData.append('unit', localUnit || '');
            formData.append('farm_id', farmId || '');
            formData.append('custom_category', localCustomCategory || '');
            formData.append('custom_subcategory', localCustomSubcategory || '');
            formData.append('description', localDescription || '');
            formData.append('add_details', localAddDetails || '');
            formData.append('published', localPublished !== undefined ? localPublished : false);
            formData.append('editable', editable ? editable : false);
            // formData.append('img_to_delete', pathPhotoToDel || '');
            formData.append('img_to_delete', JSON.stringify(pathPhotoToDel) || '');
            // formData.append('mix_photo_arr', finalPhotoArr || '');
            formData.append('mix_photo_arr', JSON.stringify(finalPhotoArr));

            // Отправляем
            let uploadUrl = `https://marketplace-usa-backend-1.onrender.com/api/products/full-update-product/${product_id}`;

            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    showToast('Токен отсутствует, авторизуйтесь', 'error');
                    return;
                }

                const response = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || `Server error: ${response.status}`);
                }

                showToast('Editable data uploaded successfully', 'success');
                // navigation.navigate('EditableWarehouse');
            } catch (err) {
                console.error('Save error:', err.message);
                showToast('Loading error', 'error');
            }

        }
        else {
        saveToRedux();
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                showToast('Токен отсутствует, авторизуйтесь', 'error');
                return;
            }

            const formData = new FormData();

            console.log('localPhoto', localPhoto);

            // Добавляем файлы под ключом "files"
            if (localPhoto) {
                const photos = Array.isArray(localPhoto) ? localPhoto : [localPhoto];
                console.log('Photos', photos);
                photos.forEach((photo, index) => {
                    let uri = photo;
                    if (!uri) {
                        console.warn(`URI for photo ${index} is undefined, skipping...`, photo);
                        return;
                    }
                    // Для Android, если URI не начинается с "file://", добавляем префикс
                    if (Platform.OS === 'android' && uri && !uri.startsWith('file://')) {
                        uri = 'file://' + uri;
                    }
                    formData.append('files', {
                        uri,
                        type: photo.type || 'image/jpeg',
                        // name: `photo_${Date.now()}_${index}.jpg`,
                        name: `${localName}_${index}.jpg`,
                    });
                });
                console.log('Photos', photos);
            }

            // Добавляем текстовые поля
            formData.append('name', localName || '');
            formData.append('unit_description', localUnitDescription || '');
            formData.append('price', localPrice !== undefined ? Number(localPrice) : '');
            formData.append('promotional_price', localPromotionalPrice !== undefined ? Number(localPromotionalPrice) : '');
            formData.append('stock', localStock !== undefined ? Number(localStock) : '');
            formData.append('category', localCategoryName || '');
            formData.append('subcategory', localSubcategoryName || '');
            formData.append('unit', localUnit || '');
            formData.append('farm_id', farmId || '');
            formData.append('custom_category', localCustomCategory || '');
            formData.append('custom_subcategory', localCustomSubcategory || '');
            formData.append('description', localDescription || '');
            formData.append('add_details', localAddDetails || '');
            formData.append('published', localPublished !== undefined ? localPublished : false);
            formData.append('img_to_delete', pathPhotoToDel || '');

            console.log('formData contents:');
            if (formData && typeof formData.append === 'function') {
                const keys = ['name', 'unit_description', 'price', 'promotional_price', 'stock', 'category', 'subcategory', 'unit', 'farm_id', 'custom_category', 'custom_subcategory', 'description', 'add_details', 'published', 'files'];
                keys.forEach(key => {
                    const values = formData.getAll(key);
                    console.log(`${key}:`, values);
                });
            } else {
                console.warn('formData is not a valid FormData object:', formData);
            }

            // Отправляем запрос через fetch
            const response = await fetch(`https://marketplace-usa-backend-1.onrender.com/api/products/add-product/${farmId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Не указываем Content-Type, fetch сам сформирует multipart/form-data с нужным boundary
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Server error: ${response.status}`);
            }

            showToast('Data uploaded successfully', 'success');
        } catch (err) {
            console.error('Save error:', err.message);
            showToast('Loading error', 'error');
        }
    }};

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", () => {
            saveToRedux();
        });
        return unsubscribe;
    }, [navigation, localPhoto, localName, localUnitDescription, localPrice, localPromotionalPrice, localStock, localCategory, localSubcategory, localUnit, farmId, localCustomCategory, localCustomSubcategory, localDescription, localAddDetails, localPublished]);

    useEffect(() => {
        if (category && categories && categories.length > 0) {
            // Ищем категорию по имени
            const foundCat = categories.find(cat => cat.name === category);
            if (foundCat) {
                setLocalCategory(foundCat.id);         // сохраняем ID для Picker
                setLocalCategoryName(foundCat.name);     // сохраняем название для передачи на сервер
            }
        }
    }, [category, categories]);

    // ========== 2. Сопоставление названия субкатегории из productData с ID ==========
    // Этот useEffect выполняется при изменении productData.subcategory, localCategory или subcategoriesAll.
    useEffect(() => {
        if (subcategory && localCategory && subcategoriesAll[localCategory]) {
            // Ищем субкатегорию по имени в массиве для данной категории
            const foundSubcat = subcategoriesAll[localCategory].find(
                sc => sc.name === subcategory
            );
            if (foundSubcat) {
                setLocalSubcategory(foundSubcat.id);         // сохраняем ID для Picker
                setLocalSubcategoryName(foundSubcat.name);     // сохраняем название для передачи на сервер
            }
        }
    }, [subcategory, localCategory, subcategoriesAll]);

    // Функция для обработки ввода цены (формат 123.45)
    const handlePriceChange = (value, setter) => {
        let cleaned = value.replace(/[^0-9.]/g, '');
        const match = cleaned.match(/^(\d{0,7})(\.\d{0,2})?/);
        cleaned = match ? match[0] : "";
        setter(cleaned);
    };

    const isPromotionalPriceActive = localPrice !== "";

    const handleUploadPhoto = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 800,
                height: 600,
                cropping: true,
                compressImageQuality: 0.8,
            });
            // Проверяем, можно ли ещё добавить фото
            if (localPhoto.length < 5) {
                setLocalPhoto([...localPhoto, image.path]);
                dispatch(addPhoto(image.path)); // Добавляем в Redux
            } else {
                showToast("Максимум 5 фото", "info"); // ошибка вызова. warning не существует в Toast
            }
        } catch (error) {
            console.error("Upload photo error:", error);
        }
    };

    // Открытие модального окна
    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    // Закрытие модального окна
    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    // Переход на экран камеры (CameraScreen)
    const handleMakePhoto = () => {
        navigation.goBack();
        navigation.navigate('CameraScreen');
    };

    // «View as customer»
    const handleViewAsCustomer = () => {
        saveToRedux();
        console.log('dataToSend from Editable', dataToSend);
        navigation.navigate('SearchResults', dataToSend );
    };

    return (
        <Container>
            {/* product_id (только чтение) */}
            {product_id ? (
                <FieldRow>
                    <FieldLabel>Product ID:</FieldLabel>
                    <FieldInput
                        value={product_id.toString()}
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
                        {localPhoto.length > 1 && (
                            <IconButton onPress={handleOpenModal}>
                                <Icon name="open-in-new" size={50} color={colors.green.grass} />
                                <IconLabel>Browse|Edit</IconLabel>
                            </IconButton>
                        )}
                    </IconField>
                </View>
            </PhotoContainer>

            {/* name */}
            <FieldRow>
                <FieldLabel>Name:</FieldLabel>
                <FieldInput
                    value={localName}
                    onChangeText={setLocalName}
                />
            </FieldRow>

            {/* description */}
            <FieldRow>
                <FieldLabel>Description:</FieldLabel>
                <FieldInput
                    value={localDescription}
                    onChangeText={setLocalDescription}
                />
            </FieldRow>

            {/* add_details */}
            <FieldRow>
                <FieldLabel>Additional details:</FieldLabel>
                <FieldInput
                    value={localAddDetails}
                    onChangeText={setLocalAddDetails}
                />
            </FieldRow>

            {/* price */}
            <FieldRow>
                <FieldLabel>Price:</FieldLabel>
                <FieldInput
                    value={localPrice}
                    onChangeText={(val) => handlePriceChange(val, setLocalPrice)}
                    keyboardType="numeric"
                    placeholder="e.g. 123.45"
                />
            </FieldRow>

            {/* promotional_price */}
            <FieldRow>
                <FieldLabel>Promotional price:</FieldLabel>
                <FieldInput
                    value={localPromotionalPrice}
                    onChangeText={(val) => handlePriceChange(val, setLocalPromotionalPrice)}
                    keyboardType="numeric"
                    placeholder="e.g. 99.99"
                    editable={isPromotionalPriceActive}
                    style={{
                        backgroundColor: isPromotionalPriceActive ? '#fff' : '#ccc',
                    }}
                />
            </FieldRow>

            {/* stock */}
            <FieldRow>
                <FieldLabel>Stock:</FieldLabel>
                <FieldInput
                    value={localStock}
                    onChangeText={(val) => setLocalStock(val.replace(/[^0-9]/g, ""))}
                    keyboardType="numeric"
                    placeholder="e.g. 100"
                />
            </FieldRow>

            {/* unit */}
            <FieldRow>
                <FieldLabel>Unit:</FieldLabel>
                <FieldInput
                    value={localUnit}
                    onChangeText={setLocalUnit}
                />
            </FieldRow>

            {/* unit_description */}
            <FieldRow>
                <FieldLabel>Unit description:</FieldLabel>
                <FieldInput
                    value={localUnitDescription}
                    onChangeText={setLocalUnitDescription}
                />
            </FieldRow>

            {/* category (Picker) */}
            <FieldRow>
                <FieldLabel>Category:</FieldLabel>
                <Picker
                    selectedValue={localCategory}
                    onValueChange={(newCatId) => {
                        // При выборе новой категории обновляем ID и имя
                        setLocalCategory(newCatId);
                        const found = categories.find(cat => cat.id === newCatId);
                        if (found) {
                            setLocalCategoryName(found.name);
                            // При смене категории сбрасываем субкатегорию
                            setLocalSubcategory("");
                            setLocalSubcategoryName("");
                        }
                    }}
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}
                >
                    <Picker.Item label="Select category" value=""/>
                    {categories.map(cat => (
                        <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                    ))}
                </Picker>
            </FieldRow>
            {/* subcategory (Picker), не активна если category не выбрана */}
            <FieldRow>
                <FieldLabel>Subcategory:</FieldLabel>
                <Picker
                    selectedValue={localSubcategory}
                    onValueChange={(newSubcatId) => {
                        setLocalSubcategory(newSubcatId);
                        const subcatList = subcategoriesAll[localCategory] || [];
                        const found = subcatList.find(sc => sc.id === newSubcatId);
                        if (found) {
                            setLocalSubcategoryName(found.name);
                        }
                    }}
                    enabled={!!localCategory} // Picker активен, если выбрана категория
                    style={{
                        borderWidth: 1,
                        borderColor: localCategory ? '#ccc' : '#aaa',
                        borderRadius: 8,
                    }}
                >
                    <Picker.Item label="Select subcategory" value=""/>
                    {(subcategoriesAll[localCategory] || []).map(sc => (
                        <Picker.Item key={sc.id} label={sc.name} value={sc.id} />
                    ))}
                </Picker>
            </FieldRow>

            {/*/!* farm_id *!/*/}
            {/*<FieldRow>*/}
            {/*    <FieldLabel>Farm ID:</FieldLabel>*/}
            {/*    <FieldInput*/}
            {/*        value={localFarmId}*/}
            {/*        onChangeText={setLocalFarmId}*/}
            {/*    />*/}
            {/*</FieldRow>*/}

            {/* custom_category */}
            <FieldRow>
                <FieldLabel>Custom category:</FieldLabel>
                <FieldInput
                    value={localCustomCategory}
                    onChangeText={setLocalCustomCategory}
                />
            </FieldRow>

            {/* custom_subcategory */}
            <FieldRow>
                <FieldLabel>Custom subcategory:</FieldLabel>
                <FieldInput
                    value={localCustomSubcategory}
                    onChangeText={setLocalCustomSubcategory}
                />
            </FieldRow>

            {/* published (switch) */}
            <FieldRow>
                <FieldLabel>Published:</FieldLabel>
                <SwitchRow>
                    <Text style={{marginRight: 20 }}>hide</Text>
                    <Switch
                        value={localPublished}
                        onValueChange={(val) => setLocalPublished(val)}
                        style={{ transform: [{ scaleX: 1.8 }, { scaleY: 1.8 }] }}
                    />
                    <Text style={{marginLeft: 20 }}>publish</Text>
                </SwitchRow>
            </FieldRow>

            {/* Кнопки сохранения и просмотра */}
            <ButtonRow>
                <ActionButton onPress={handleSave}>
                    <ActionButtonText>Save product</ActionButtonText>
                </ActionButton>

                <ActionButton onPress={handleViewAsCustomer}>
                    <ActionButtonText>View as customer</ActionButtonText>
                </ActionButton>
            </ButtonRow>

            <BottomBlock/>

            {/* Модальное окно */}
            <PhotoModalEditor
                visible={isModalVisible}
                photos={localPhoto}
                delPhoto={pathPhotoToDel}
                specEdit={editable}
                searchId={product_id}
                onClose={handleCloseModal}
                // onSave={(updatedPhotos) => {
                //     setLocalPhoto(updatedPhotos);
                //     setIsModalVisible(false);
                // }}
                onSave={(updatedPhotos, delPhoto) => {
                    setLocalPhoto(updatedPhotos); // Обновляем локальное состояние
                    setPathPhotoToDel(delPhoto);
                    // Обновляем только массив photo в Redux
                    dispatch(setNewProduct({
                        // ...storedProduct, // Берем текущее состояние из Redux
                        photo: updatedPhotos, // Обновляем photo
                        img_to_delete: delPhoto, // Обновляем пути для удаления photo
                    }));
                    setIsModalVisible(false); // Закрываем модалку
                }}
            />
        </Container>
    );
}