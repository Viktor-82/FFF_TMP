// components/pages/LocationPermissionPage.js
import React from 'react';
import { View, Text } from 'react-native';
import LocationPermission from "../components/Location/LocationPermission";
import styled from 'styled-components/native';
import {colors} from "../assets/styles/colors";

// Обертка для компонента LocationPermission
const LocationPermissionPageWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.neutral.lightGray};
`;

const LocationPermissionPage = () => {
    return (
        <LocationPermissionPageWrapper>
            <LocationPermission />
        </LocationPermissionPageWrapper>
    );
};

export default LocationPermissionPage;
