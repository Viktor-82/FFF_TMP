import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../assets/styles/colors';
import { useNavigation } from '@react-navigation/native'
import { clearCommunityAddInfo } from "../../redux/actions/communityAddInfoActions";

const ButtonWrapper = styled.View`
  align-items: flex-end;
  margin-top: 15px;
`;

const UploadButton = styled.TouchableOpacity`
  background-color: ${colors.green.grass};
  padding: 5px 20px 5px 15px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

const SubmitButtonText = styled.Text`
  color: ${colors.neutral.white};
  font-size: 16px;
`;

const CommunityButton = ({ communityType, onPress }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const handleAddCommunity = () => {
        dispatch(clearCommunityAddInfo());
        navigation.navigate('CommunityAddInfo', { type: communityType });
    };
    return (
        <ButtonWrapper>
            <UploadButton onPress={handleAddCommunity}>
                <Icon name="add" size={20} color="white" />
                <SubmitButtonText>Add</SubmitButtonText>
            </UploadButton>
        </ButtonWrapper>
    );
};

export default CommunityButton;