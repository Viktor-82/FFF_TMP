import {
    setNewProduct,
    addPhoto,
    removePhoto,
    delImg,
    clearNewProduct,
} from "../actions/newProductAction";

const initialState = {
    photo: [],
    mix_photo_arr: [],
    name: "",
    unit_description: "",
    price: 0,
    promotional_price: null,
    stock: 0,
    category: "",
    subcategory: "",
    unit: "",
    farm_id: "",
    custom_category: "",
    custom_subcategory: "",
    published: false,
    editable: false,
    img_to_delete: []
};

const newProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_NEW_PRODUCT":
            return { ...state, ...action.payload };

        case "ADD_PHOTO":
            if (state.photo.length < 5) {
                return { ...state, photo: [...state.photo, action.payload] };
            }
            return state;

        // case "MIX_PHOTO_ARR":
        //     return { ...state, mix_photo_arr: [...state.mix_photo_arr, action.payload] };

        case "REMOVE_PHOTO":
            return {
                ...state,
                photo: state.photo.filter((_, index) => index !== action.payload),
            };

        case "IMG_TO_DELETE":
                return { ...state, img_to_delete: [...state.img_to_delete, action.payload] };

        case "CLEAR_NEW_PRODUCT":
            return initialState;

        default:
            return state;
    }
};

export default newProductReducer;