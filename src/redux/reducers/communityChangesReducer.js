import { UPDATE_COMMUNITY_CHANGES, CLEAR_COMMUNITY_CHANGES } from "../actions/communityChangesActions";

const initialState = {
    _id: null,
    changes: {},
};

const communityChangesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_COMMUNITY_CHANGES:
            return {
                _id: action.payload._id,
                changes: {
                    ...state.changes,
                    ...action.payload.updatedFields
                },
            };

        case CLEAR_COMMUNITY_CHANGES:
            return initialState;

        default:
            return state;
    }
};

export default communityChangesReducer;