
const BROKER_MESSAGE_SUCCESS = "BROKER_MESSAGE_SUCCESS";
const BROKER_REVIEW_SUCCESS = "BROKER_REVIEW_SUCCESS";
const defaultState = {
    broker_message_success: false,
    broker_review_success: false,
}

export default function resourcesReducer(state = defaultState, action) {
    switch (action.type) {
        case BROKER_MESSAGE_SUCCESS:
            return {
                ...state,
                broker_message_success: action.payload,
            }
        case BROKER_REVIEW_SUCCESS:
            return {
                ...state,
                broker_review_success: action.payload,
            }
        default:
            return state
    }
}

export const brokerMessageSuccess = broker_message_success => ({type: BROKER_MESSAGE_SUCCESS, payload: broker_message_success})
export const brokerReviewSuccess = broker_review_success => ({type: BROKER_REVIEW_SUCCESS, payload: broker_review_success})

