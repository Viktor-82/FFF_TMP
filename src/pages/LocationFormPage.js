// components/pages/LocationFormPage.js
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import {colors} from "../assets/styles/colors";
import LocationForm from "../components/Location/LocationForm";

// Обертка для компонента LocationForm
const LocationFormPageWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${colors.neutral.lightGray};
`;

const LocationFormPage = () => {
    return (
        <LocationFormPageWrapper>
            <LocationForm />
        </LocationFormPageWrapper>
    );
};

export default LocationFormPage;