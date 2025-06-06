export const FETCH_SALES_STATS_REQUEST = 'FETCH_SALES_STATS_REQUEST';
export const FETCH_SALES_STATS_SUCCESS = 'FETCH_SALES_STATS_SUCCESS';
export const FETCH_SALES_STATS_FAILURE = 'FETCH_SALES_STATS_FAILURE';

// Экшен для начала запроса статистики продаж.
// Можно передавать выбранные товары, диапазон дат и выбранную метрику.
export const fetchSalesStatsRequest = (selectedProducts, dateRange, metric) => ({
    type: FETCH_SALES_STATS_REQUEST,
    payload: { selectedProducts, dateRange, metric },
});

// Экшен при успешном получении статистики продаж.
// payload – полученные данные (например, массив объектов с данными по каждому товару)
export const fetchSalesStatsSuccess = (salesStats) => ({
    type: FETCH_SALES_STATS_SUCCESS,
    payload: salesStats,
});

// Экшен в случае ошибки при получении статистики продаж.
export const fetchSalesStatsFailure = (error) => ({
    type: FETCH_SALES_STATS_FAILURE,
    payload: error,
});

// // Пример асинхронного thunk для запроса статистики (если используете redux-thunk)
// export const fetchSalesStats = (selectedProducts, dateRange, metric) => {
//     return async (dispatch) => {
//         dispatch(fetchSalesStatsRequest(selectedProducts, dateRange, metric));
//         try {
//             // Здесь реализуйте вызов API, который возвращает статистику продаж
//             // Например:
//             // const response = await api.fetchSalesStats(selectedProducts, dateRange, metric);
//             // dispatch(fetchSalesStatsSuccess(response.data));
//
//             // Для примера просто имитируем задержку и возвращаем mock-данные:
//             const mockData = selectedProducts.map((prodId) => ({
//                 productId: prodId,
//                 name: `Product ${prodId}`,
//                 sales: [
//                     { date: '2023-08-01', quantity: Math.floor(Math.random()*20), revenue: Math.floor(Math.random()*500) },
//                     { date: '2023-08-02', quantity: Math.floor(Math.random()*20), revenue: Math.floor(Math.random()*500) },
//                     { date: '2023-08-03', quantity: Math.floor(Math.random()*20), revenue: Math.floor(Math.random()*500) },
//                     // Дополнительные точки...
//                 ],
//             }));
//             setTimeout(() => {
//                 dispatch(fetchSalesStatsSuccess(mockData));
//             }, 1000);
//         } catch (error) {
//             dispatch(fetchSalesStatsFailure(error.message));
//         }
//     };
// };
