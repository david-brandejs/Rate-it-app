import React from 'react';
import { Redirect, Route, BrowserRouter } from 'react-router-dom';
import App from './App';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';
import history from './history';

import Header from './Header';
import AddProvider from './Provider/AddProvider';
import Provider from './Provider/Provider';
import AddReview from './Review/AddReview';
import UpdateReview from './Review/UpdateReview';
import MyReviews from './Review/MyReviews';
import Docs from './Docs/Docs';
import Author from './Author/Author';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

export const makeMainRoutes = () => {
    return (
        <BrowserRouter history={history}>
            <div>
                <Header auth={auth} history={history}/>
                <Route exact path="/" render={(props) => <App auth={auth} {...props} />} />
                <Route path="/author" render={(props) => <Author auth={auth} {...props} />} />
                <Route path="/provider" render={(props) => (
                    !auth.isAuthenticated() ? (
                        <Redirect to="/"/>
                    ) : (
                        <Provider auth={auth} {...props} />
                    )
                )} />
                <Route path="/add-provider" render={(props) => (
                    !auth.isAuthenticated() ? (
                        <Redirect to="/"/>
                    ) : (
                        <AddProvider auth={auth} {...props} />
                    )
                )} />
                <Route path="/add-review" render={(props) => (
                    !auth.isAuthenticated() ? (
                        <Redirect to="/"/>
                    ) : (
                        <AddReview auth={auth} {...props} />
                    )
                )} />
                <Route path="/update-review" render={(props) => (
                    !auth.isAuthenticated() ? (
                        <Redirect to="/"/>
                    ) : (
                        <UpdateReview auth={auth} {...props} />
                    )
                )} />
                <Route path="/my-reviews" render={(props) => (
                    !auth.isAuthenticated() ? (
                        <Redirect to="/"/>
                    ) : (
                        <MyReviews auth={auth} {...props} />
                    )
                )} />
                <Route path="/docs" render={(props) => (
                    !auth.isAuthenticated() ? (
                        <Redirect to="/"/>
                    ) : (
                        <Docs auth={auth} {...props} />
                    )
                )} />
                <Route path="/callback" render={(props) => {
                    handleAuthentication(props);
                    return <Callback {...props} /> 
                }}/>        
            </div>
        </BrowserRouter>
    );
};
