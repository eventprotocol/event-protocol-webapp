// React stuff
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from 'react-router-dom';

// axios for server access
import axios from 'axios';

// import Web3 and Drizzle
import Web3 from 'web3';
import { Web3Provider } from 'react-web3';
import { DrizzleProvider } from 'drizzle-react';

// Routes
import indexRoutes from "./routes/index.jsx";

// Components
import "./assets/css/material-dashboard-react.css";
import registerServiceWorker from './registerServiceWorker';
import UsersList from './components/UsersList';
import AddUser from './components/AddUser';

// Initialize browser history
const hist = createBrowserHistory();

// Initialize Web3
let web3 = new Web3();

if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
  web3.setProvider(window.web3.currentProvider);
}

// Setup Drizzle
// const options = {
//   contracts: [
//     // <<Insert Smart Contract Names>>:w
//   ],
//   events: {}
// }

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
    this.getUsers();
  };

  getUsers() {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
    .then((res) => { this.setState({ users: res.data.data.users }); })
    .catch((err) => { console.log(err); });
  };

  render() {
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
  <App />,
  document.getElementById('root'));

registerServiceWorker();
