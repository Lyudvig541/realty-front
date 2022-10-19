import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import authReducer from "./authReducer";
import modalsReducer from "./modalsReducer";
import resourcesReducer from "./resourcesReducer";
import announcementReducer from "./announcementReducer";
import typeReducer from "./typeReducer";
import categoryReducer from "./categoryReducer";
import constructionReducer from "./constructionReducer";
import agentReducer from "./agentReducer";
import notificationsReducer from "./notificationsReducer";
import profileReducer from "./profileReducer";
import verificationReducer from "./verificationReducer";
import regionReducer from "./regionReducer";
import placesReducer from "./placesReducer";
import localeReducer from "./localeReducer";
import requestReducer from "./requestReducer";
import userDataReducer from "./userDataReducer";

const rootReducer = combineReducers({
    auth:authReducer,
    modals:modalsReducer,
    locale:localeReducer,
    resources:resourcesReducer,
    announcement:announcementReducer,
    type:typeReducer,
    category:categoryReducer,
    construction:constructionReducer,
    agent:agentReducer,
    notifications:notificationsReducer,
    profile:profileReducer,
    verification:verificationReducer,
    region:regionReducer,
    places:placesReducer,
    request:requestReducer,
    user:userDataReducer,
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))