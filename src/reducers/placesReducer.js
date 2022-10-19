const SET_PLACES = "SET_PLACES";

const defaultState = {
    all_places: [],
}

export default function placesReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_PLACES:
            return {
                ...state,
                all_places: action.payload,
            }
        default:
            return state
    }
}

export const setPlaces = all_places => ({type: SET_PLACES, payload: all_places})


