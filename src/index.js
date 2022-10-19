import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {Provider, useSelector} from 'react-redux';
import Home from './components/home';
import AgentsList from './components/agents-list';
import Error from './components/error';
import Contact from './components/contact';
import Announcements from './components/announcements';
import AddNew from './components/add-property';
import ChooseBroker from './components/choose-broker';
import Sell from './components/sell';
import SellByType from './components/sell-by-type';
import Construction from './components/construction';
import Test from './components/test';
import {store} from "./reducers";
import {useDispatch} from "react-redux";
import {auth} from "./actions/auth";
import AgenciesList from "./components/agencies-list";
import PropertyDetails from "./components/property-details";
import ConstructionDetails from "./components/construction-details";
import ConstructionDetailsTest from "./components/construction-details-test";
import SingleAgent from "./components/single-agent";
import Profile from "./components/profile";
import MyAnnouncements from "./components/my-announcements";
import Favorites from "./components/favorites";
import AgencyPage from "./components/agency-page";
import BankRequest from "./components/bank-request";
import TextPage from "./components/text-page";
import CheckAgentList from "./components/select-agent-list";
import Notifications from "./components/notifications";
import EditProperty from "./components/edit-property";
import {setModal} from "./reducers/modalsReducer";
import ConstAgency from "./components/const-agency";
import ComingSoon from "./components/coming_soon";
import User from "./components/user";
import Card from "./components/section-components/card";

import TagManager from 'react-gtm-module'

const tagManagerArgs = {
    gtmId: 'GTM-MMTQ8TB',
    events: {
        sendUserInfo: 'userInfo'
    }
}

TagManager.initialize(tagManagerArgs)


/*const app = document.getElementById('app')
ReactDOM.render(<Router routes={routes} />, app)*/

function Root() {
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.isAuth)
    const currentUser = useSelector(state => state.auth.currentUser)
    useEffect( () => {
        dispatch(auth());
        if (isAuth && !currentUser.phone_number_verified_at){
            dispatch(setModal('phone_number_verification'));
        }
    }, [dispatch,currentUser.phone_number_verified_at,isAuth])

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        try {
            if(token){
                return true;
            }
            else{
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    function PrivateRoute({ component: Component, ...rest }) {
        return (
            <Route
                {...rest}
                render={props =>
                    isAuthenticated() ? (
                        <Component {...props} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/",
                            }}
                        />
                    )
                }
            />
        );
    }

    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <PrivateRoute exact path="/sell-by-type/:category" component={SellByType}/>
                    <PrivateRoute exact path="/sell" component={Sell}/>
                    <Route exact path="/rent" component={Sell}/>
                    <Route exact path="/from-construction" component={Construction}/>
                    <Route exact path="/property-details/:id" component={PropertyDetails}/>
                    <Route exact path="/construction-details-test/:id" component={ConstructionDetails}/>
                    <Route exact path="/construction-details/:id" component={ConstructionDetailsTest}/>
                    <Route exact path="/agents-list" component={AgentsList}/>
                    <PrivateRoute exact path="/select-agent" component={CheckAgentList}/>
                    <Route exact path="/agent/:id" component={SingleAgent}/>
                    <Route exact path="/error" component={Error}/>
                    <Route exact path="/contact" component={Contact}/>
                    <Route exact path="/announcements" component={Announcements}/>
                    <PrivateRoute exact path="/add-property/:category/:type/:broker" component={AddNew}/>
                    <PrivateRoute exact path="/choose-agent/:category/:type" component={ChooseBroker}/>
                    <PrivateRoute exact path="/edit-property/:id" component={EditProperty}/>
                    <Route exact path="/agencies-list" component={AgenciesList}/>
                    <Route exact path="/agency/:id" component={AgencyPage}/>
                    <Route exact path="/constructor-agency/:id" component={ConstAgency}/>
                    <PrivateRoute exact path="/profile" component={Profile}/>
                    <Route exact path="/my-announcements" component={MyAnnouncements}/>
                    <PrivateRoute exact path="/favorites" component={Favorites}/>
                    <Route exact path="/test" component={Test} />
                    <Route exact path="/bank-request" component={BankRequest} />
                    <Route exact path="/page/:slug" component={TextPage} />
                    <Route exact path="/notifications" component={Notifications} />
                    <Route exact path="/coming_soon" component={ComingSoon} />
                    <Route exact path="/reset_password/:token/:email" component={Home} />
                    <Route path="/user/:id" component={User} />
                    <Route path="/card-test" component={Card} />
                    <Route component={Error} />
                </Switch>
            </div>
        </Router>
    );
}

export default Root;


ReactDOM.render(
    <Provider store={store}>
        <Root/>
    </Provider>,
    document.getElementById('sq')
);
