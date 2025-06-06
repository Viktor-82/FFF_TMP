// import React from 'react';
// import { View, Text, ScrollView } from 'react-native';
// import styled from 'styled-components/native';
// import { useSelector } from 'react-redux';
// import { useRoute } from '@react-navigation/native';
// import ProductCard from '../components/Products/ProductCard';
// import BackButton from '../components/Buttons/BackButton';
// import SearchBar from '../components/Shared/SearchBar';
//
// // Стили для контейнера страницы
// const PageContainer = styled(View)`
//   flex: 1;
//   width: 100%;
//   background-color: #fff;
// `;
//
// // Верхняя панель (кнопка "Назад" и SearchBar)
// const TopBar = styled(View)`
//   flex: 1;
//   flex-direction: row;
//   align-items: center;
//   width: 100%;
//   gap: 16px; /* Расстояние между BackButton и SearchBar */
//   margin-bottom: 16px;
//   padding: 10px;
// `;
//
// // Контейнер для товаров
// const ProductsContainer = styled(View)`
//   flex-direction: row;
//   flex-wrap: wrap;
//   justify-content: center;
//   gap: 4px; /* Аналогично MyEssentials */
//   padding: 1px;
// `;
//
// // Сообщение, если результатов нет
// const Message = styled(Text)`
//   font-size: 18px;
//   color: #555;
//   margin-top: 20px;
//   text-align: center;
// `;
//
// const SearchResultsPage = () => {
//     const route = useRoute();
//     // const results = route.params?.results || []; // Получаем результаты из параметров маршрута
//     const product = route.params || []; // Получаем результаты из параметров маршрута
//     const searchQuery = useSelector((state) => state.search.query); // Получаем запрос из Redux
//
//     // console.log('Results', results);
//
//     console.log('call from SearchResult', product);
//
//     return (
//         <PageContainer>
//             <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
//                 <TopBar>
//                     <BackButton />
//                     <SearchBar isSearchPage={true} />
//                 </TopBar>
//
//                 {/*{results.length > 0 ? (*/}
//                 <ProductsContainer>
//                     {/*{results.map((product) => (*/}
//                     {/*    <ProductCard key={product.id} product={product} />*/}
//                     {/*))}*/}
//                     <ProductCard product={product} />
//                 </ProductsContainer>
//                 // ) : (
//                 //     <Message>No results found.</Message>
//                 // )}
//             </ScrollView>
//         </PageContainer>
//     );
// };
//
// export default SearchResultsPage;

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import ProductCard from '../components/Products/ProductCard';
import BackButton from '../components/Buttons/BackButton';
import SearchBar from '../components/Shared/SearchBar';

// Стили для контейнера страницы
const PageContainer = styled(View)`
  flex: 1;
  width: 100%;
  background-color: #fff;
`;

// Верхняя панель (кнопка "Назад" и SearchBar)
const TopBar = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 16px; /* Расстояние между BackButton и SearchBar */
  margin-bottom: 16px;
  padding: 10px;
`;

// Контейнер для товаров
const ProductsContainer = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px; /* Аналогично MyEssentials */
  padding: 1px;
`;

// Сообщение, если результатов нет
const Message = styled(Text)`
  font-size: 18px;
  color: #555;
  margin-top: 20px;
  text-align: center;
`;

const SearchResultsPage = () => {
    const route = useRoute();
    // const results = route.params?.results || []; // Получаем результаты из параметров маршрута
    const product = route.params || []; // Получаем результаты из параметров маршрута
    const searchQuery = useSelector((state) => state.search.query); // Получаем запрос из Redux

    // console.log('Results', results);

    console.log('call from SearchResult', product);

    return (
        <PageContainer>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <TopBar>
                    <BackButton />
                    <SearchBar isSearchPage={true} />
                </TopBar>
                    <ProductsContainer>
                        <ProductCard product={product} />
                    </ProductsContainer>
            </ScrollView>
        </PageContainer>
    );
};

export default SearchResultsPage;
