// React stuff
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from 'react-router-dom';

// axios for server access
import axios from 'axios';

// import Web3 and Drizzle
import { DrizzleProvider } from 'drizzle-react';
import { Drizzle, generateStore } from 'drizzle'
import {BrowserRouter} from 'react-router-dom';
import Web3 from 'web3';

// Routes
import indexRoutes from "./routes/index.jsx";
// css
import "./assets/css/material-dashboard-react.css";

// components
import registerServiceWorker from "./registerServiceWorker.js";
import PublicProfile from "./views/PublicProfile/PublicProfile.jsx";

import EventToken from "./data/EventToken.json";
import DrizzleContainer from "./drizzle-components/drizzle-container.js"
import DrizzleAccount from "./drizzle-components/drizzle-account.js"
import options from "./drizzle-components/drizzle-options.js";

// Initialize browser history
const hist = createBrowserHistory();

// Initialize Web3
let web3 = new Web3();

class App extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      eth_address: '',
      username: '',
      email: '',
      isRegistered: '',
    };
  };

  componentDidMount() {
    // this.getUsers();
  };

  getUsers() {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
    .then((res) => { this.setState({ users: res.data.data.users }); })
    .catch((err) => { console.log(err); });
  };

  render() {
    // Routes for dashboard
    // Routes for account

    return (
      <Router history={hist}>
        <Switch>
          {indexRoutes.map((prop, key) => {
            return <Route path={prop.path} component={prop.component} key={key} />;
          })}
        </Switch>
      </Router>
    );
  };
}

ReactDOM.render(
  <DrizzleProvider options={options}>
    <DrizzleContainer>
       <BrowserRouter>
        <App />
      </BrowserRouter>
    </DrizzleContainer>
  </DrizzleProvider>,
  document.getElementById('root'));

registerServiceWorker();
