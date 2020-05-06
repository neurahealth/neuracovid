import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Redirect, Route, Switch } from 'react-router';
import { Router } from 'react-router-dom';
import Login from './components/Login/index';
import Home from './components/Home/index';
import Faq from './components/Faq/index';
import { I18nextProvider } from "react-i18next";

import i18n from "./i18n";
import { createBrowserHistory } from 'history'

const customHistory = createBrowserHistory();

const Root = () => {
	return (
		<I18nextProvider i18n={i18n}>
		<Router history={customHistory}>
			<Switch>
				<Route exact={true} path="/login" component={Login} />
				<Route  path="/app" component={App} />
				<Route exact={true} path="/home" component={Home} />
				<Route exact={true} path="/faq" component={Faq} />
				<Redirect from="/" to="/login" />
			</Switch>
		</Router>	
		</I18nextProvider>
	)
}

ReactDOM.render( <Root  />, document.getElementById('root'));
serviceWorker.unregister();
