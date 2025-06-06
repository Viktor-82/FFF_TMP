import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { startTokenExpirationCheck } from '../../utils/tokenManager';

const TokenChecker = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const checkInterval = startTokenExpirationCheck(navigation);
        return () => clearInterval(checkInterval);
    }, [navigation]);

    return null; // Этот компонент ничего не рендерит
};

export default TokenChecker;