const SET_UNREAD_NOTIFICATIONS = "SET_UNREAD_NOTIFICATIONS";
const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";
const SET_READ_NOTIFICATION = "SET_READ_NOTIFICATION";

const defaultState = {
    unread_notifications: [],
    all_notifications: [],

}

export default function notificationsReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_UNREAD_NOTIFICATIONS:
            return {
                ...state,
                unread_notifications: action.payload,
            }
        case SET_NOTIFICATIONS:
            return {
                ...state,
                all_notifications: action.payload,
            }
            case SET_READ_NOTIFICATION:
            return {
                ...state,
                all_notifications: action.payload,
            }
        default:
            return state
    }
}

export const getUnreadNotifications = unread_notifications => ({type: SET_UNREAD_NOTIFICATIONS, payload: unread_notifications})
export const getAllNotifications = all_notifications => ({type: SET_NOTIFICATIONS, payload: all_notifications})
export const setReadNotification = all_notifications => ({type: SET_READ_NOTIFICATION, payload: all_notifications})


