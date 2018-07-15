import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Web3 from 'web3';
import { Web3Provider } from 'react-web3';

import UsersList from './components/UsersList';
import AddUser from './components/AddUser';

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
web3.eth.getAccounts().then()

class App extends Component {
  constructor() {
    super();

    this.state = {
      users: []
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
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <br/>
            <h1>All Users</h1>
            <hr/><br/>
            <AddUser/>
            <br/>
            <UsersList users={this.state.users}/>
          </div>
        </div>
      </div>
    )
  };
}

ReactDOM.render(  
  <Web3Provider>
    <App /> 
  </Web3Provider>,
  document.getElementById('root')

);
