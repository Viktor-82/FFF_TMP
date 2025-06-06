import {
    FETCH_PRODUCTS_REQUEST,
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_FAILURE,
    SET_CATEGORY_SUBCATEGORY_DATA,
    SET_SUBCATEGORY_PRODUCT_DATA,
    SET_SELECTED_CATEGORY,
    SET_PRODUCT_IMAGES,
} from '../actions/productActions';

const initialState = {
    items: [], // Все продукты
    subcategoryProducts: [], // Продукты выбранной подкатегории
    loading: false,
    error: null,
    categorySubcategoriesMap: {},
    subcategoryProductsMap: {},
    selectedCategory: null,
    images: {}, // Структура: { id: [ссылки] }
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_PRODUCTS_REQUEST":
            return { ...state, loading: true, error: null };

        case "FETCH_PRODUCTS_SUCCESS":
            return { ...state, loading: false, items: action.payload };

        case "FETCH_PRODUCTS_FAILURE":
            return { ...state, loading: false, error: action.payload };

        case "SET_SUBCATEGORY_PRODUCTS":
            return { ...state, subcategoryProducts: action.payload }; // Сохраняем продукты подкатегории

        case SET_CATEGORY_SUBCATEGORY_DATA:
            return { ...state, categorySubcategoriesMap: action.payload };

        case SET_SUBCATEGORY_PRODUCT_DATA:
            return { ...state, subcategoryProductsMap: action.payload };

        case SET_SELECTED_CATEGORY:
            return { ...state, selectedCategory: action.payload };

        // case SET_PRODUCT_IMAGES:
        //     return { ...state, images: action.payload }; // Сохраняем ссылки на изображения
        case SET_PRODUCT_IMAGES:
            // Обновляем состояние для изображений
            const newImages = action.payload.reduce((acc, product) => {
                acc[product.id] = product.images;
                return acc;
            }, {});

            return {
                ...state,
                images: { ...state.images, ...newImages },
            };
        case 'UPDATE_PRODUCT_STOCK': // под вопросом существование
            return {
                ...state,
                items: state.items.map((product) =>
                    product.id === action.payload.productId
                        ? { ...product, stock: action.payload.stock }
                        : product
                ),
            };
        case 'REMOVE_PRODUCT':
            return {
                ...state,
                items: state.items.filter((product) => product.id !== action.payload),
            };

        // case "SET_PRODUCT_IMAGE_LINKS":
        //     return {
        //         ...state,
        //         productImageLinks: action.payload,
        //     };

        default:
            return state;
    }
};

export default productReducer;
