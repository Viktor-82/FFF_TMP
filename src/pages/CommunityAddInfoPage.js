import React from 'react';
import { View } from 'react-native';
import BottomNavigation from "../components/Shared/BottomNavigation";
import CommunityAddInfo from "../components/Community/CommunityAddInfo";
import styled from "styled-components/native";
import BackButton from "../components/Buttons/BackButton";

const PageContainer = styled.View`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
`;

const Content = styled.View`
  flex: 1;
  overflow-y: auto;
`;

const CommunityAddInfoPage = () => {
    return (
        <PageContainer>
            <BackButton/>
            <Content>
                <CommunityAddInfo/>
            </Content>
            {/*<BottomNavigation/>*/}
        </PageContainer>
    );
};

export default CommunityAddInfoPage;