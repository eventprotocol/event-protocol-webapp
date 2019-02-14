// React stuff
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from 'react-router-dom';

// import Web3 and Drizzle
import { DrizzleProvider } from 'drizzle-react';
import { Drizzle, generateStore } from 'drizzle'
import { BrowserRouter } from 'react-router-dom';
import Web3 from 'web3';

// Routes
import indexRoutes from "./routes/index.jsx";
// css
import "./assets/css/material-dashboard-react.css";

// components
import registerServiceWorker from "./registerServiceWorker.js";

import DrizzleContainer from "./drizzle-components/drizzle-container.js"
// import DrizzleAccount from "./drizzle-components/drizzle-account.js"
import options from "./drizzle-components/drizzle-options.js";

import history from "./history";

// Initialize Web3
let web3 = new Web3();

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.onUnload = this.onUnload.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onUnload);
  }

  componentWillUnmount() {
    window.addEventListener('beforeunload', this.onUnload);
  }

  onUnload() {
    // Redirect to marketplace on refresh
    history.push('/');
  }

  render() {
    // console.log(history);
    return (
      <Router history={history}>
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
