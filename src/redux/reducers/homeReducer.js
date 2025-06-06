const initialState = {
    sliderData: [], // Изначально пустой массив
};

const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SLIDER_DATA':
            return {
                ...state,
                sliderData: action.payload,
            };
        default:
            return state;
    }
};

export default homeReducer;
