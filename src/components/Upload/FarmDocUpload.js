import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert, FlatList, ScrollView } from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import ImagePicker from "react-native-image-crop-picker";
import styled from "styled-components/native";
import {useNavigation, useRoute} from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { colors } from "../../assets/styles/colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { showToast } from '../Shared/Notification';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {updateLocation} from "../../redux/actions/locationActions";

// ---------------------
// Стилизованные компоненты
// ---------------------
const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${colors.neutral.white};
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${colors.brown.earth};
  text-align: center;
`;

const DescriptionText = styled.Text`
  text-align: center;
  font-size: 15px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 5px;
  color: ${colors.brown.earth};
`;

const FileContainer = styled.View`
  margin-top: 10px;
`;

const FileItem = styled.View`
  background-color: ${colors.green.lightGreen};
  padding: 3px 8px;
  margin: 3px 0;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
`;

const FileText = styled.Text`
  font-size: 14px;
  color: ${colors.brown.earth};
  flex: 1;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: red;
  padding: 4px;
  border-radius: 5px;
`;

const DeleteText = styled.Text`
  color: white;
`;

const UploadButton = styled.TouchableOpacity`
  background-color: ${({ disabled }) => (disabled ? colors.green.lightGreen : colors.green.grass)};
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-top: 28px;
`;

const UploadButtonText = styled.Text`
  color: ${colors.brown.earth};
  font-size: 16px;
`;

const SubmitButtonText = styled.Text`
  color: ${({ isDisabled }) => (isDisabled ? colors.brown.earth : colors.neutral.white)};
  font-size: 16px;
`;

const Input = styled.TextInput`
  border: 1px solid ${colors.brown.beige};
  border-radius: 8px;
  background-color: ${colors.neutral.white};
  padding: 10px;
  font-size: 16px;
  margin-top: 5px;
`;

const RequiredField = styled.View`
  border: 2px solid ${({ uploaded }) => (uploaded ? colors.green.grass : "red")};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: 57%;
`;

const InputField = styled.View`
  display: flex;  
  flex-direction: row;
  height: 100px;
`;

const InputFieldAdditional = styled.View`
  display: flex;  
  flex-direction: row;
  height: 120px;
`;

const IconField = styled.View`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-around;
`;

const IconButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin: 5px 10px;
  flex-direction: column;
`;

const IconLabel = styled.Text`
  font-size: 14px;
  color: ${colors.brown.earth};
  margin-top: 5px;
  text-align: center;
`;

const ScrollableList = styled.ScrollView`
  max-height: 150px;
`;

// ---------------------
// Компонент DocumentUpload
// ---------------------
const DocumentUpload = () => {
    const [ssnFile, setSsnFile] = useState(null);
    const [einFile, setEinFile] = useState(null);
    const [additionalDocs, setAdditionalDocs] = useState([]);
    const [comment, setComment] = useState("");
    const navigation = useNavigation();
    const route = useRoute();


    const [data, setData] = useState(route.params);
    const { id } = route.params || {};
    // Функция для сканирования документов
    const scanDocument = async (type) => {
        const { scannedImages } = await DocumentScanner.scanDocument();
        if (scannedImages.length > 0) {
            addFile(scannedImages[0], `${type}.jpg`, type);
        }
    };

    // Выбор из галереи
    const pickImage = async (type) => {
        try {
            const image = await ImagePicker.openPicker({ mediaType: "photo", cropping: true });
            addFile(image.path, image.filename || `${type}.jpg`, type);
        } catch (error) {
            console.log("Ошибка выбора изображения:", error);
        }
    };

    // Добавление файла
    const addFile = (uri, name, type) => {
        if (type === "ssn") {
            setSsnFile({ name, uri });
        } else if (type === "ein") {
            setEinFile({ name, uri });
        } else {
            if (additionalDocs.length >= 5) {
                showToast('Maximum 5 additional files', 'error');
                return;
            }
            // Генерируем имя additional_1, additional_2, additional_3 и т. д.
            const additionalNumber = additionalDocs.length + 1;
            const newFileName = `additional_${additionalNumber}.jpg`;

            setAdditionalDocs([...additionalDocs, { name: newFileName, uri }]);
        }
    };

    // Удаление файла
    const removeFile = (type, index = null) => {
        if (type === "ssn") setSsnFile(null);
        if (type === "ein") setEinFile(null);
        if (type === "additional") {
            const updatedDocs = [...additionalDocs];
            updatedDocs.splice(index, 1);
            setAdditionalDocs(updatedDocs);
        }
    };

    // Проверка перед отправкой
    const validateAndSubmit = async () => {
        if (!ssnFile && !einFile) {
            showToast('You must upload your SSN or EIN', 'error');
            return;
        }

        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            showToast('Authorization token is missing. Please log in again.', 'error');
            return;
        }

        try {
            // Создаем FormData
            const formData = new FormData();
            console.log('data', data);

            // Добавляем файлы в FormData
            const appendFile = (file, fieldName) => {
                if (file) {
                    formData.append("files", {
                        uri: file.uri,
                        name: file.name,
                        type: "image/jpeg", // Убедись, что используется корректный MIME-тип
                    });
                }
            };

            if (ssnFile) appendFile(ssnFile, "ssn");
            if (einFile) appendFile(einFile, "ein");
            additionalDocs.forEach((file) => {
                if (file) appendFile(file, "additional");
            });

            // Добавляем текстовые данные
            formData.append("data", JSON.stringify(data)); // Преобразуем объект в строку
            console.log('ДАННЫЕ', formData);

            const response = await axios.post(
                'https://marketplace-usa-backend-1.onrender.com/api/farmers/create-farmer',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            showToast('Documents uploaded successfully!', 'success');
            navigation.navigate('StripeConnect', data);

        } catch (error) {
            console.error('Error saving farmer data:', error);
            showToast('Failed to save location. Data saved locally.', 'error');
        }
    };

    const isFormValid = !!ssnFile || !!einFile;

    return (
        <Container>
            <Title>Attach documents</Title>
            <DescriptionText>Please add one of the required documents{'\n'} - EIN or SSN</DescriptionText>

            {/* SSN */}
            <SectionTitle>Download SSN</SectionTitle>
            <InputField>
                <RequiredField uploaded={!!ssnFile}>
                    {ssnFile && (
                        <FileItem>
                            {/*<FileText>{ssnFile.name} (Loaded ✅)</FileText>*/}
                            <FileText>{ssnFile.name}</FileText>
                            <DeleteButton onPress={() => removeFile("ssn")}>
                                <DeleteText>✖</DeleteText>
                            </DeleteButton>
                        </FileItem>
                    )}
                </RequiredField>
                <IconField>
                    <IconButton onPress={() => scanDocument("ssn")}>
                        <Icon name="document-scanner" size={50} color={colors.green.grass} />
                        <IconLabel>Scan</IconLabel>
                    </IconButton>
                    <IconButton onPress={() => pickImage("ssn")}>
                        <Icon name="upload-file" size={50} color={colors.green.grass} />
                        <IconLabel>Upload</IconLabel>
                    </IconButton>
                </IconField>
            </InputField>
            {/* EIN */}
            <SectionTitle>Download EIN</SectionTitle>
            <InputField>
                <RequiredField uploaded={!!einFile}>
                    {einFile && (
                        <FileItem>
                            {/*<FileText>{einFile.name} (Loaded ✅)</FileText>*/}
                            <FileText>{einFile.name}</FileText>
                            <DeleteButton onPress={() => removeFile("ein")}>
                                <DeleteText>✖</DeleteText>
                            </DeleteButton>
                        </FileItem>
                    )}
                </RequiredField>
                <IconField>
                    <IconButton onPress={() => scanDocument("ein")}>
                        <Icon name="document-scanner" size={50} color={colors.green.grass} />
                        <IconLabel>Scan</IconLabel>
                    </IconButton>
                    <IconButton onPress={() => pickImage("ein")}>
                        <Icon name="upload-file" size={50} color={colors.green.grass} />
                        <IconLabel>Upload</IconLabel>
                    </IconButton>
                </IconField>
            </InputField>

            {/* Дополнительные документы */}
            <SectionTitle>Additional documents</SectionTitle>
            <InputFieldAdditional>
                <RequiredField uploaded={additionalDocs.length > 0}>
                    <ScrollView>
                        {additionalDocs.map((doc, index) => (
                            <FileItem key={index}>
                                <FileText>{doc.name}</FileText>
                                <DeleteButton onPress={() => removeFile("additional", index)}>
                                    <DeleteText>✖</DeleteText>
                                </DeleteButton>
                            </FileItem>
                        ))}
                    </ScrollView>
                </RequiredField>
                <IconField>
                    <IconButton onPress={() => scanDocument("additional")}>
                        <Icon name="document-scanner" size={50} color={colors.green.grass} />
                        <IconLabel>Scan</IconLabel>
                    </IconButton>
                    <IconButton onPress={() => pickImage("additional")}>
                        <Icon name="upload-file" size={50} color={colors.green.grass} />
                        <IconLabel>Upload</IconLabel>
                    </IconButton>
                </IconField>
            </InputFieldAdditional>

            {/* Комментарий */}
            <SectionTitle>Comment</SectionTitle>
            <Input placeholder="Enter a comment..." value={comment} onChangeText={setComment} />

            {/* Кнопка отправки */}
            <UploadButton onPress={validateAndSubmit} disabled={!isFormValid}>
                <SubmitButtonText isDisabled={!isFormValid}>
                    {!isFormValid ? "Not active. Waiting." : "Submit for review"}
                </SubmitButtonText>
            </UploadButton>
        </Container>
    );
};

export default DocumentUpload;

