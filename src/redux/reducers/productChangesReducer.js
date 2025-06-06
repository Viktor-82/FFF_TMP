import { UPDATE_PRODUCT_CHANGES, CLEAR_PRODUCT_CHANGES } from "../actions/productChangesActions";

const initialState = {
    product_id: null,
    changes: {},
};

const productChangesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PRODUCT_CHANGES:
            return {
                product_id: action.payload.product_id,
                changes: {
                    ...state.changes,
                    ...action.payload.updatedFields
                },
            };

        case CLEAR_PRODUCT_CHANGES:
            return initialState;

        default:
            return state;
    }
};

export default productChangesReducer;