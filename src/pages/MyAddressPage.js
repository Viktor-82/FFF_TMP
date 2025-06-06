import React from 'react';
import { View } from 'react-native';
import MyAddress from "../components/Location/MyAddress";
import styled from "styled-components/native";
import {colors} from "../assets/styles/colors";

// Обертка для компонента MyAddress
const MyAddressPageWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background-color: ${colors.neutral.lightGray};
`;
const MyAddressPage = () => {
    return (
        <MyAddressPageWrapper>
            <MyAddress/>
        </MyAddressPageWrapper>
    );
};

export default MyAddressPage;