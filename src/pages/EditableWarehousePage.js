import React from 'react';
import { View } from 'react-native';
import BottomNavigation from "../components/Shared/BottomNavigation";
import EditableWarehouseProductCard from "../components/Cart/EditableWarehouseProductCard";
import styled from "styled-components/native";

const PageContainer = styled.View`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Content = styled.View`
  flex: 1;
  overflow-y: auto;
`;

const EditableWarehousePage = () => {
    return (
        <PageContainer>
            <Content>
                <EditableWarehouseProductCard/>
            </Content>
            <BottomNavigation/>
        </PageContainer>
    );
};

export default EditableWarehousePage;