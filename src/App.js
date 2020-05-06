import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


import Login from './components/Login'
import Home from './components/Home'
import { createBrowserHistory } from 'history'
const customHistory = createBrowserHistory();


export class App extends Component {
  render() {
    return (
      <div>
        <Router history={customHistory}>
          <Switch>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route path="/Home">
              <Home />
            </Route>
            
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
