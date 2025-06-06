const initialState = {
    photo: [],
    title: "",
    description: "",
    published: false,
    editable: false,
    farm_id: "",
    img_to_delete: [],
    type: "",
};

const communityAddInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_COMMUNITY_ADD_INFO":
            return { ...state, ...action.payload };

        case "ADD_COMMUNITY_ADD_PHOTO":
            if (state.photo.length < 5) {
                return { ...state, photo: [...state.photo, action.payload] };
            }
            return state;

        case "REMOVE_COMMUNITY_ADD_PHOTO":
            return {
                ...state,
                photo: state.photo.filter((_, index) => index !== action.payload),
            };

        case "DEL_COMMUNITY_ADD_IMG":
            return {
                ...state,
                img_to_delete: [...state.img_to_delete, action.payload],
            };

        case "CLEAR_COMMUNITY_ADD_INFO":
            return initialState;

        default:
            return state;
    }
};

export default communityAddInfoReducer;
