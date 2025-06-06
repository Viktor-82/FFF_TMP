import React, { useEffect } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery } from '../../redux/slices/searchSlice';
import { useDebounce } from 'use-debounce';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../assets/styles/colors';

// Тень для iOS / Android:
const shadowStyle = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    android: {
        elevation: 5,
    },
});

// Контейнер для поиска
const SearchContainer = styled.View`
  flex-direction: row;  
  align-items: center;
  background-color: ${colors.neutral.white};
  border-radius: 8px;
  padding: 1px 8px;
  ${Platform.OS === 'android' ? 'elevation: 5;' : ''}; 
  flex: ${({ isSearchPage }) => (isSearchPage ? 1 : 'auto')};
  min-width: ${({ isSearchPage }) => (isSearchPage ? '82%' : 'auto')};
`;

// Поле ввода
const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  margin-left: 5px;
`;

const IconWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

// Кнопка очистки
const ClearButton = styled(TouchableOpacity)`
  position: absolute;
  right: 10px;
  padding: 5px;
`;

const SearchBar = ({ isSearchPage }) => {
    const products = useSelector((state) => state.product.items || []);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Текущая поисковая строка в Redux
    const searchQuery = useSelector((state) => state.search.query || '');
    // Делаем "debounce", чтобы не обрабатывать на каждом символе
    const [debouncedSearchQuery] = useDebounce(searchQuery, 700);

    const clearSearch = () => {
        dispatch(setSearchQuery(''));
    };

    useEffect(() => {
        // Приводим строку к нижнему регистру и убираем пробелы
        const query = debouncedSearchQuery.trim().toLowerCase();

        // Если ничего не введено — просто выходим
        if (!query) return;

        // Фильтруем товары
        const filteredProducts = products.filter((product) =>
            product.name.toLowerCase().startsWith(query)
        );

        // Если что-то нашлось
        if (filteredProducts.length > 0) {
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];

            // Если мы ещё не на экране SearchResults
            if (currentRoute.name !== 'SearchResults') {
                navigation.navigate('SearchResults', { results: filteredProducts });
            } else {
                // Мы УЖЕ на экране SearchResults — проверим, не совпадают ли результаты
                const currentResults = currentRoute.params?.results || [];

                // Сравниваем по JSON, чтобы понять, действительно ли результаты отличаются
                if (JSON.stringify(currentResults) !== JSON.stringify(filteredProducts)) {
                    // Если отличаются — заменяем экран, чтобы не плодить одинаковые экраны
                    navigation.replace('SearchResults', { results: filteredProducts });
                }
            }
        }
        // Если ничего не нашлось — можно добавить логику, например, переход на пустой экран
        // но, судя по вашему примеру, ничего не делаем.

    }, [debouncedSearchQuery, products, navigation]);

    const handleChange = (text) => {
        dispatch(setSearchQuery(text));
    };

    return (
        <View style={shadowStyle}>
            <SearchContainer isSearchPage={isSearchPage}>
                <IconWrapper>
                    <Icon name="search-outline" size={20} color={colors.brown.lightEarth} />
                </IconWrapper>

                <SearchInput
                    placeholder="Search fresh products..."
                    value={searchQuery}
                    onChangeText={handleChange}
                />

                {searchQuery.length > 0 && (
                    <ClearButton onPress={clearSearch}>
                        <Icon name="close-outline" size={20} color={colors.brown.lightEarth} />
                    </ClearButton>
                )}
            </SearchContainer>
        </View>
    );
};

export default SearchBar;
