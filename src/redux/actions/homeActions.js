export const FETCH_SLIDER_DATA = "FETCH_SLIDER_DATA";

export const fetchSliderData = () => async (dispatch) => {
    // Заглушка для данных
    const sliderData = [
        {
            id: 1,
            title: "New in Perfumery",
            description: "Newly added collections",
            products: [
                {
                    id: "1",
                    name: "Special face palette Deliplus",
                    image: "/images/face_palette.png",
                    price: 10.5,
                    unit: "unit",
                    weight: "29 g"
                },
                {
                    id: "2",
                    name: "Special eyeshadow palette Deliplus",
                    image: "/images/eyeshadow_palette.png",
                    price: 6.5,
                    unit: "unit",
                    weight: "16 g"
                }
            ]
        },
    ];
    dispatch({ type: FETCH_SLIDER_DATA, payload: sliderData });
};
